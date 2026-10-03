-- ==============================================================================
-- III PLAN MUNICIPAL DE JUVENTUD DE ORCERA (2027-2031)
-- ESQUEMA DE BASE DE DATOS RELACIONAL (POSTGRESQL / SUPABASE)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE USUARIOS / JÓVENES DEL MUNICIPIO
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('joven', 'asociacion', 'tecnico_juventud', 'concejal', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    alias VARCHAR(100),
    dni VARCHAR(20),
    fecha_nacimiento DATE,
    edad_rango VARCHAR(20) CHECK (edad_rango IN ('12-15', '16-18', '19-24', '25-30', '+30')),
    genero VARCHAR(30),
    empadronado_orcera BOOLEAN DEFAULT TRUE,
    puntos_civicos INT DEFAULT 0 CHECK (puntos_civicos >= 0),
    nivel_gamificacion VARCHAR(50) DEFAULT 'Novato de la Sierra',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE EJES ESTRATÉGICOS DEL PLAN
CREATE TABLE IF NOT EXISTS ejes (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL CHECK (numero BETWEEN 1 AND 7),
    titulo VARCHAR(200) NOT NULL,
    lema VARCHAR(255),
    icono VARCHAR(50) NOT NULL,
    color_primario VARCHAR(20) NOT NULL,
    color_secundario VARCHAR(20) NOT NULL,
    presupuesto_anual_base DECIMAL(12,2) NOT NULL,
    presupuesto_quinquenal_base DECIMAL(12,2) GENERATED ALWAYS AS (presupuesto_anual_base * 5) STORED,
    descripcion_corta TEXT NOT NULL,
    orden INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE OBJETIVOS (GENERALES Y ESPECÍFICOS)
DO $$ BEGIN
    CREATE TYPE objetivo_tipo_enum AS ENUM ('general', 'especifico');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS objetivos (
    id SERIAL PRIMARY KEY,
    eje_id INT REFERENCES ejes(id) ON DELETE CASCADE,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    tipo objetivo_tipo_enum NOT NULL,
    descripcion TEXT NOT NULL,
    indicador_meta TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE ACCIONES DEL PLAN
DO $$ BEGIN
    CREATE TYPE estado_accion_enum AS ENUM ('no_iniciada', 'en_curso', 'finalizada', 'en_revision_participativa');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS acciones (
    id SERIAL PRIMARY KEY,
    eje_id INT REFERENCES ejes(id) ON DELETE CASCADE,
    objetivo_id INT REFERENCES objetivos(id) ON DELETE SET NULL,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    concejalias_responsables TEXT[] NOT NULL,
    recursos_asociados TEXT,
    estado estado_accion_enum DEFAULT 'no_iniciada',
    ano_inicio INT CHECK (ano_inicio BETWEEN 2027 AND 2031),
    ano_fin INT CHECK (ano_fin BETWEEN 2027 AND 2031),
    trimestre_objetivo VARCHAR(10) CHECK (trimestre_objetivo IN ('Q1', 'Q2', 'Q3', 'Q4', 'Anual')),
    es_destacada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE PRESUPUESTOS Y EJECUCIÓN ECONÓMICA
CREATE TABLE IF NOT EXISTS presupuestos (
    id SERIAL PRIMARY KEY,
    accion_id INT REFERENCES acciones(id) ON DELETE CASCADE,
    ano_ejecucion INT NOT NULL CHECK (ano_ejecucion BETWEEN 2027 AND 2031),
    presupuesto_previsto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    presupuesto_real DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    porcentaje_ejecucion DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN presupuesto_previsto > 0 THEN ROUND((presupuesto_real / presupuesto_previsto) * 100, 2)
            ELSE 0.00
        END
    ) STORED,
    facturas_justificadas_url TEXT,
    observaciones_intervencion TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_accion_ano UNIQUE (accion_id, ano_ejecucion)
);

-- 6. TABLA DE INDICADORES DE ÉXITO
DO $$ BEGIN
    CREATE TYPE tipo_metrica_enum AS ENUM ('cuantitativo_participantes', 'porcentaje_satisfaccion', 'genero_ratio', 'talleres_realizados');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS indicadores (
    id SERIAL PRIMARY KEY,
    accion_id INT REFERENCES acciones(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    tipo tipo_metrica_enum NOT NULL,
    valor_meta DECIMAL(10,2) NOT NULL,
    valor_conseguido DECIMAL(10,2) DEFAULT 0.00,
    unidad_medida VARCHAR(50) NOT NULL,
    metodologia_medicion TEXT,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA DE VALORACIONES Y EVALUACIÓN JUVENIL
CREATE TABLE IF NOT EXISTS valoraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    eje_id INT REFERENCES ejes(id) ON DELETE CASCADE,
    accion_id INT REFERENCES acciones(id) ON DELETE CASCADE,
    usuario_nombre VARCHAR(150),
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    recomienda_amigos BOOLEAN DEFAULT TRUE,
    es_anonimo BOOLEAN DEFAULT FALSE,
    impacto_percibido VARCHAR(50) CHECK (impacto_percibido IN ('Muy Positivo', 'Positivo', 'Neutro', 'Mejorable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLA DE PROPUESTAS JUVENILES Y BUZÓN PARTICIPATIVO
DO $$ BEGIN
    CREATE TYPE estado_propuesta_enum AS ENUM ('recibida', 'en_estudio', 'admitida_para_votacion', 'incorporada_al_plan', 'desestimada');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS propuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    autor_nombre VARCHAR(150),
    eje_id INT REFERENCES ejes(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion_orcerena VARCHAR(150),
    votos_favorables INT DEFAULT 0,
    estado estado_propuesta_enum DEFAULT 'recibida',
    respuesta_equipo_gobierno TEXT,
    coste_estimado DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABLA DE RECOMPENSAS Y GAMIFICACIÓN
CREATE TABLE IF NOT EXISTS recompensas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    coste_puntos INT NOT NULL,
    stock_disponible INT DEFAULT 100,
    badge_requerido VARCHAR(50),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS canjes_recompensas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_client_id VARCHAR(100),
    recompensa_id INT REFERENCES recompensas(id) ON DELETE RESTRICT,
    recompensa_titulo VARCHAR(200),
    codigo_canje VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'canjeado' CHECK (estado IN ('canjeado', 'usado', 'caducado')),
    canjeado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- VISTAS ANALÍTICAS Y TRIGGERS
-- ==============================================================================
CREATE OR REPLACE VIEW vista_resumen_transparencia_ejes AS
SELECT 
    e.id AS eje_id,
    e.numero AS eje_numero,
    e.titulo AS eje_titulo,
    e.presupuesto_anual_base,
    COUNT(DISTINCT a.id) AS total_acciones,
    COUNT(DISTINCT CASE WHEN a.estado = 'finalizada' THEN a.id END) AS acciones_finalizadas,
    COUNT(DISTINCT CASE WHEN a.estado = 'en_curso' THEN a.id END) AS acciones_en_curso,
    COALESCE(SUM(p.presupuesto_previsto), 0.00) AS total_presupuesto_previsto,
    COALESCE(SUM(p.presupuesto_real), 0.00) AS total_presupuesto_ejecutado,
    CASE 
        WHEN COALESCE(SUM(p.presupuesto_previsto), 0) > 0 
        THEN ROUND((COALESCE(SUM(p.presupuesto_real), 0) / SUM(p.presupuesto_previsto)) * 100, 2)
        ELSE 0.00
    END AS porcentaje_ejecucion_global,
    ROUND(AVG(v.puntuacion), 2) AS valoracion_media_juventud,
    COUNT(DISTINCT v.id) AS total_valoraciones
FROM ejes e
LEFT JOIN acciones a ON e.id = a.eje_id
LEFT JOIN presupuestos p ON a.id = p.accion_id
LEFT JOIN valoraciones v ON a.id = v.accion_id
GROUP BY e.id, e.numero, e.titulo, e.presupuesto_anual_base;

CREATE OR REPLACE FUNCTION fn_sumar_puntos_por_valoracion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE users 
        SET puntos_civicos = puntos_civicos + 50
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_valoracion_puntos ON valoraciones;
CREATE TRIGGER trg_valoracion_puntos
AFTER INSERT ON valoraciones
FOR EACH ROW
EXECUTE FUNCTION fn_sumar_puntos_por_valoracion();

-- ==============================================================================
-- HABILITAR RLS (ROW LEVEL SECURITY) Y POLÍTICAS PÚBLICAS
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejes ENABLE ROW LEVEL SECURITY;
ALTER TABLE objetivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE acciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE recompensas ENABLE ROW LEVEL SECURITY;
ALTER TABLE canjes_recompensas ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Public read ejes" ON ejes FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read objetivos" ON objetivos FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read acciones" ON acciones FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read presupuestos" ON presupuestos FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read indicadores" ON indicadores FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read recompensas" ON recompensas FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read propuestas" ON propuestas FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public insert propuestas" ON propuestas FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public update propuestas" ON propuestas FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read valoraciones" ON valoraciones FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public insert valoraciones" ON valoraciones FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read users" ON users FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public update users" ON users FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public read canjes" ON canjes_recompensas FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public insert canjes" ON canjes_recompensas FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- DATOS SEMILLA OFICIALES (7 EJES, RECOMPENSAS Y PROPUESTAS INICIALES)
-- ==============================================================================
INSERT INTO ejes (id, numero, titulo, lema, icono, color_primario, color_secundario, presupuesto_anual_base, descripcion_corta, orden)
VALUES
(1, 1, 'Entorno Sostenible, Digital y Conectado', 'Naturaleza protegida y futuro digital desde la Sierra de Segura', '🌲', '#10b981', '#06b6d4', 2500.00, 'Promover un entorno municipal sostenible, accesible y conectado que favorezca la calidad de vida de las personas jóvenes.', 1),
(2, 2, 'Ocio, Cultura, Deporte y Vida Saludable', 'Espacios vivos, cultura joven y deporte activo en el Parque Natural', '🎭', '#3b82f6', '#8b5cf6', 4000.00, 'Fomentar alternativas de ocio enriquecedoras, eventos culturales y práctica deportiva.', 2),
(3, 3, 'Emancipación, Empleo, Formación y Vivienda', 'Oportunidades de futuro, emprendimiento y arraigo en Orcera', '🚀', '#f59e0b', '#ef4444', 2500.00, 'Facilitar el acceso al empleo rural, cualificación profesional y soluciones de emancipación.', 3),
(4, 4, 'Participación Juvenil, Ciudadanía Activa y Voluntariado', 'Voz, voto y poder de decisión en el futuro del pueblo', '🗳️', '#ec4899', '#f43f5e', 1500.00, 'Canalizar el protagonismo y la iniciativa de la juventud en la vida democrática local.', 4),
(5, 5, 'Salud, Bienestar Emocional e Inclusión Social', 'Cuidarnos entre todos: bienestar mental, diversidad y acogida', '❤️', '#06b6d4', '#10b981', 2000.00, 'Priorizar el bienestar integral, la salud mental comunitaria y el apoyo mutuo.', 5),
(6, 6, 'Igualdad, Diversidad y Convivencia', 'Libertad, respeto mutuo y convivencia en el medio rural', '🌈', '#8b5cf6', '#a855f7', 1500.00, 'Garantizar la igualdad de trato, la erradicación del machismo y el respeto a la diversidad.', 6),
(7, 7, 'Gobernanza, Innovación y Evaluación de las Políticas', 'Transparencia total, rendición de cuentas y mejora continua', '⚖️', '#6366f1', '#3b82f6', 1000.00, 'Garantizar el seguimiento riguroso, abierto y transparente del III Plan Municipal.', 7)
ON CONFLICT (id) DO UPDATE SET 
    titulo = EXCLUDED.titulo,
    lema = EXCLUDED.lema,
    icono = EXCLUDED.icono,
    color_primario = EXCLUDED.color_primario,
    color_secundario = EXCLUDED.color_secundario,
    presupuesto_anual_base = EXCLUDED.presupuesto_anual_base,
    descripcion_corta = EXCLUDED.descripcion_corta;

INSERT INTO recompensas (id, titulo, descripcion, coste_puntos, stock_disponible, badge_requerido, activo)
VALUES
(1, 'Alta Oficial Gratuita · Asociación Juvenil de Orcera', 'Recompensa de bienvenida del III Plan: Carnet digital de socio/a, voz y voto en asambleas, y acceso preferente a actividades.', 0, 999, '🎁 Gratis por Registro', true),
(2, 'Pase de 1 Día · Piscina Municipal de Amurjo', 'Disfruta de la piscina natural más grande de Europa en plena Sierra de Segura.', 200, 150, 'Más Popular', true),
(3, 'Abono 1 Mes Pistas de Pádel / Gimnasio Orcera', 'Acceso ilimitado a las pistas municipales reservando desde la app.', 450, 50, 'Deporte', true),
(4, 'Plaza Preferente en Curso DJ / Producción Musical', 'Reserva garantizada de plaza y uso del equipamiento del Espacio Joven.', 350, 20, 'Cultura', true),
(5, 'Pack Merchandising Oficial KLIKO (Sudadera + Botella)', 'Sudadera de algodón orgánico con el logo oficial KLIKO y botella térmica.', 300, 40, 'Eco', true)
ON CONFLICT (id) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descripcion = EXCLUDED.descripcion,
    coste_puntos = EXCLUDED.coste_puntos,
    stock_disponible = EXCLUDED.stock_disponible,
    badge_requerido = EXCLUDED.badge_requerido;

INSERT INTO propuestas (titulo, descripcion, autor_nombre, eje_id, votos_favorables, estado, ubicacion_orcerena)
VALUES
('Torneo Nocturno de Vóley-Playa en Amurjo con DJ', 'Aprovechar la iluminación nocturna de la piscina de Amurjo en julio para hacer un torneo comarcal de vóley mixto amenizado por jóvenes DJs locales.', 'Alejandro M. (21 años)', 2, 34, 'admitida_para_votacion', 'Piscina Municipal de Amurjo'),
('Taller Práctico de Reparación de Bicis de Montaña (MTB)', 'Instalar un punto de herramientas comunitarias en el pueblo y enseñar a ajustar frenos y cambios para no tener que bajar a Jaén o Úbeda.', 'Lucía F. (19 años)', 1, 21, 'en_estudio', 'Polideportivo Municipal'),
('Muro Libre para Arte Urbano y Graffiti Rural en el Río Trujala', 'Habilitar un muro municipal para muralismo joven con temática de fauna del Parque Natural y flora autóctona.', 'Carlos N. (26 años)', 2, 18, 'recibida', 'Ribera del Río Trujala')
ON CONFLICT DO NOTHING;
