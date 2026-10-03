/**
 * KLIKO · III Plan Municipal de Juventud de Orcera (2027-2031)
 * Cliente de Conexión Oficial con Supabase (Rural-Tech Cloud)
 */

const SUPABASE_CONFIG = {
  url: "https://dyyhknpoymnuoueavfmk.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eWhrbnBveW1udW91ZWF2Zm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzI2MjUsImV4cCI6MjEwNjYwODYyNX0.AaNKe4jmLAHQcWpiB23fmetRbhYeIwmiNN8zJCP5HpY",
  projectId: "dyyhknpoymnuoueavfmk"
};

class KlikoDatabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.listeners = [];
  }

  init() {
    try {
      if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        this.isConnected = true;
        console.log("⚡ [KLIKO] Supabase Cloud inicializado con éxito:", SUPABASE_CONFIG.url);
        this.updateStatusBadge(true);
        this.setupRealtimeSubscriptions();
      } else {
        console.warn("⚠️ [KLIKO] Librería Supabase JS no detectada, funcionando en modo offline local.");
        this.updateStatusBadge(false);
      }
    } catch (err) {
      console.error("❌ [KLIKO] Error al conectar con Supabase:", err);
      this.isConnected = false;
      this.updateStatusBadge(false);
    }
  }

  updateStatusBadge(connected) {
    const badge = document.getElementById("supabase-status-badge");
    if (badge) {
      if (connected) {
        badge.innerHTML = `<span class="cloud-dot online"></span><span class="cloud-status-text">En Vivo</span>`;
        badge.classList.remove("offline");
        badge.classList.add("online");
        badge.title = "Supabase Cloud Conectado (Orcera)";
      } else {
        badge.innerHTML = `<span class="cloud-dot offline"></span><span class="cloud-status-text">Local</span>`;
        badge.classList.remove("online");
        badge.classList.add("offline");
        badge.title = "Trabajando en modo local";
      }
    }
  }

  // ==========================================
  // 1. PROPUESTAS (BUZÓN COMUNITARIO)
  // ==========================================
  async getPropuestas() {
    if (!this.isConnected || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from('propuestas')
        .select('*')
        .order('votos_favorables', { ascending: false });

      if (error) throw error;
      return data.map(p => ({
        id: p.id,
        autor: p.autor_nombre || 'Joven de Orcera',
        ejeId: p.eje_id || 1,
        ejeNombre: `Eje ${p.eje_id || 1}`,
        titulo: p.titulo,
        descripcion: p.descripcion,
        ubicacion: p.ubicacion_orcerena || 'Orcera',
        votos: p.votos_favorables || 0,
        estado: p.estado || 'recibida',
        apoyadaPorUsuario: false
      }));
    } catch (err) {
      console.warn("Error al consultar propuestas en Supabase:", err);
      return null;
    }
  }

  async addPropuesta(prop) {
    if (!this.isConnected || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from('propuestas')
        .insert([{
          titulo: prop.titulo,
          descripcion: prop.descripcion,
          autor_nombre: prop.autor,
          eje_id: prop.ejeId,
          ubicacion_orcerena: prop.ubicacion,
          votos_favorables: prop.votos || 1,
          estado: 'recibida'
        }])
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Propuesta guardada en Supabase:", data);
      return data;
    } catch (err) {
      console.warn("Error al guardar propuesta en Supabase:", err);
      return null;
    }
  }

  async votePropuesta(propId, newVoteCount) {
    if (!this.isConnected || !this.client) return false;
    try {
      // Si el id es UUID
      const { error } = await this.client
        .from('propuestas')
        .update({ votos_favorables: newVoteCount })
        .eq('id', propId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Error al actualizar voto en Supabase:", err);
      return false;
    }
  }

  // ==========================================
  // 2. VALORACIONES Y EVALUACIÓN DE EJES
  // ==========================================
  async addValoracion(ejeId, rating, comentario, user) {
    if (!this.isConnected || !this.client) return null;
    try {
      const payload = {
        eje_id: ejeId,
        puntuacion: rating,
        comentario: comentario,
        usuario_nombre: user ? (user.alias || user.nombre) : 'Joven anónimo',
        recomienda_amigos: true
      };

      const { data, error } = await this.client
        .from('valoraciones')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Valoración guardada en Supabase:", data);
      return data;
    } catch (err) {
      console.warn("Error al enviar valoración a Supabase:", err);
      return null;
    }
  }

  async getValoracionesByEje(ejeId) {
    if (!this.isConnected || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from('valoraciones')
        .select('*')
        .eq('eje_id', ejeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(v => ({
        usuario: v.usuario_nombre || 'Joven de Orcera',
        estrellas: v.puntuacion,
        comentario: v.comentario,
        fecha: v.created_at
      }));
    } catch (err) {
      console.warn("Error al obtener valoraciones de Supabase:", err);
      return null;
    }
  }

  // ==========================================
  // 3. SINCRONIZACIÓN DE USUARIOS Y PUNTOS
  // ==========================================
  async syncUser(user) {
    if (!this.isConnected || !this.client || !user) return null;
    try {
      const payload = {
        client_id: user.id,
        nombre: user.nombre,
        alias: user.alias,
        dni: user.dni,
        edad_rango: user.rangoEdad,
        empadronado_orcera: !!user.empadronado,
        puntos_civicos: user.puntos || 0,
        nivel_gamificacion: user.nivel || 'Novato de la Sierra'
      };

      const { data, error } = await this.client
        .from('users')
        .upsert(payload, { onConflict: 'client_id' })
        .select()
        .single();

      if (error) throw error;
      console.log("👤 Usuario sincronizado con Supabase:", data);
      return data;
    } catch (err) {
      console.warn("Error al sincronizar usuario en Supabase:", err);
      return null;
    }
  }

  // ==========================================
  // 4. CANJE DE RECOMPENSAS (ORCERA PUNTOS / AMURJO)
  // ==========================================
  async registrarCanje(reward, ticketCode, user) {
    if (!this.isConnected || !this.client) return null;
    try {
      const payload = {
        recompensa_id: reward.id,
        recompensa_titulo: reward.titulo,
        codigo_canje: ticketCode,
        user_client_id: user ? user.id : 'anon',
        estado: 'canjeado'
      };

      const { data, error } = await this.client
        .from('canjes_recompensas')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      console.log("🎟️ Canje registrado en Supabase:", data);
      return data;
    } catch (err) {
      console.warn("Error al registrar canje en Supabase:", err);
      return null;
    }
  }

  // ==========================================
  // 5. RESUMEN DE TRANSPARENCIA EN TIEMPO REAL
  // ==========================================
  async getTransparenciaResumen() {
    if (!this.isConnected || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from('vista_resumen_transparencia_ejes')
        .select('*');

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Error al leer vista de transparencia:", err);
      return null;
    }
  }

  // ==========================================
  // 6. TIEMPO REAL (REALTIME)
  // ==========================================
  setupRealtimeSubscriptions() {
    if (!this.isConnected || !this.client) return;
    try {
      const channel = this.client
        .channel('kliko-realtime-feed')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'propuestas' }, payload => {
          console.log("⚡ [Realtime] Nueva propuesta en Supabase:", payload.new);
          window.dispatchEvent(new CustomEvent('kliko:propuesta_creada', { detail: payload.new }));
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'valoraciones' }, payload => {
          console.log("⚡ [Realtime] Nueva valoración en Supabase:", payload.new);
          window.dispatchEvent(new CustomEvent('kliko:valoracion_creada', { detail: payload.new }));
        })
        .subscribe();
    } catch (err) {
      console.warn("Error al suscribirse a canales realtime:", err);
    }
  }
}

// Instancia global accesible desde cualquier script
window.KlikoDB = new KlikoDatabaseService();
