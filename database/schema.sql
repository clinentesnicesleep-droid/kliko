-- ==============================================================================
-- III PLAN MUNICIPAL DE JUVENTUD DE ORCERA (2027-2031)
-- ESQUEMA DE BASE DE DATOS RELACIONAL (POSTGRESQL / SUPABASE)
-- ==============================================================================

-- Extensiones recomendadas para UUIDs y funciones criptográficas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE USUARIOS / JÓVENES DEL MUNICIPIO
CREATE TYPE user_role_enum AS ENUM ('joven', 'asociacion', 'tecnico_juventud', 'concejal', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    fecha_nacimiento DATE,
    edad_rango VARCHAR(20) CHECK (edad_rango IN ('12-15', '16-18', '19-24', '25-30', '+30')),
    genero VARCHAR(30), -- 'femenino', 'masculino', 'no_binario', 'prefiero_no_decir'
    empadronado_orcera BOOLEAN DEFAULT TRUE,
    puntos_civicos INT DEFAULT 0 CHECK (puntos_civicos >= 0),
    nivel_gamificacion VARCHAR(50) DEFAULT 'Novato de la Sierra',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE EJES ESTRATÉGICOS DEL PLAN
CREATE TABLE ejes (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL CHECK (numero BETWEEN 1 AND 7),
    titulo VARCHAR(200) NOT NULL,
    lema VARCHAR(255),
    icono VARCHAR(50) NOT NULL,
    color_primario VARCHAR(20) NOT NULL, -- Ej: #15803D (verde bosque) o #F97316 (coral eléctrico)
    color_secundario VARCHAR(20) NOT NULL,
    presupuesto_anual_base DECIMAL(12,2) NOT NULL, -- Presupuesto previsto anual
    presupuesto_quinquenal_base DECIMAL(12,2) GENERATED ALWAYS AS (presupuesto_anual_base * 5) STORED,
    descripcion_corta TEXT NOT NULL,
    orden INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE OBJETIVOS (GENERALES Y ESPECÍFICOS)
CREATE TYPE objetivo_tipo_enum AS ENUM ('general', 'especifico');

CREATE TABLE objetivos (
    id SERIAL PRIMARY KEY,
    eje_id INT REFERENCES ejes(id) ON DELETE CASCADE,
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Ej: 'OBJ-1.1'
    tipo objetivo_tipo_enum NOT NULL,
    descripcion TEXT NOT NULL,
    indicador_meta TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE ACCIONES DEL PLAN
CREATE TYPE estado_accion_enum AS ENUM ('no_iniciada', 'en_curso', 'finalizada', 'en_revision_participativa');

CREATE TABLE acciones (
    id SERIAL PRIMARY KEY,
    eje_id INT REFERENCES ejes(id) ON DELETE CASCADE,
    objetivo_id INT REFERENCES objetivos(id) ON DELETE SET NULL,
    codigo VARCHAR(30) UNIQUE NOT NULL, -- Ej: 'ACC-1.1.1'
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    concejalias_responsables TEXT[] NOT NULL, -- ['Juventud', 'Medio Ambiente', 'Deportes']
    recursos_asociados TEXT,
    estado estado_accion_enum DEFAULT 'no_iniciada',
    ano_inicio INT CHECK (ano_inicio BETWEEN 2027 AND 2031),
    ano_fin INT CHECK (ano_fin BETWEEN 2027 AND 2031),
    trimestre_objetivo VARCHAR(10) CHECK (trimestre_objetivo IN ('Q1', 'Q2', 'Q3', 'Q4', 'Anual')),
    es_destacada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE PRESUPUESTOS Y EJECUCIÓN ECONÓMICA EN TIEMPO REAL
CREATE TABLE presupuestos (
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

-- 6. TABLA DE INDICADORES DE ÉXITO (MÉTRICAS CUANTITATIVAS Y CUALITATIVAS)
CREATE TYPE tipo_metrica_enum AS ENUM ('cuantitativo_participantes', 'porcentaje_satisfaccion', 'genero_ratio', 'talleres_realizados');

CREATE TABLE indicadores (
    id SERIAL PRIMARY KEY,
    accion_id INT REFERENCES acciones(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    tipo tipo_metrica_enum NOT NULL,
    valor_meta DECIMAL(10,2) NOT NULL,
    valor_conseguido DECIMAL(10,2) DEFAULT 0.00,
    unidad_medida VARCHAR(50) NOT NULL, -- 'asistentes', '%', 'sesiones', 'propuestas'
    metodologia_medicion TEXT,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA DE VALORACIONES Y EVALUACIÓN JUVENIL (1-5 ESTRELLAS)
CREATE TABLE valoraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    accion_id INT REFERENCES acciones(id) ON DELETE CASCADE,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    recomienda_amigos BOOLEAN DEFAULT TRUE,
    es_anonimo BOOLEAN DEFAULT FALSE,
    impacto_percibido VARCHAR(50) CHECK (impacto_percibido IN ('Muy Positivo', 'Positivo', 'Neutro', 'Mejorable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_user_accion_eval UNIQUE (user_id, accion_id)
);

-- 8. TABLA DE PROPUESTAS JUVENILES Y BUZÓN PARTICIPATIVO
CREATE TYPE estado_propuesta_enum AS ENUM ('recibida', 'en_estudio', 'admitida_para_votacion', 'incorporada_al_plan', 'desestimada');

CREATE TABLE propuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    eje_id INT REFERENCES ejes(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion_orcerena VARCHAR(150), -- Ej: 'Piscina Amurjo', 'Espacio Joven', 'Pista Polideportiva'
    votos_favorables INT DEFAULT 0,
    estado estado_propuesta_enum DEFAULT 'recibida',
    respuesta_equipo_gobierno TEXT,
    coste_estimado DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABLA DE RECOMPENSAS Y GAMIFICACIÓN (ORCERA PUNTOS / AMURJO)
CREATE TABLE recompensas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL, -- Ej: 'Bono 1 Día Piscina Municipal de Amurjo'
    descripcion TEXT NOT NULL,
    coste_puntos INT NOT NULL,
    stock_disponible INT DEFAULT 100,
    badge_requerido VARCHAR(50),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE canjes_recompensas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recompensa_id INT REFERENCES recompensas(id) ON DELETE RESTRICT,
    codigo_canje VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'canjeado' CHECK (estado IN ('canjeado', 'usado', 'caducado')),
    canjeado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- VISTAS ANALÍTICAS Y TRIGGERS PARA TRANSPARENCIA MUNICIPAL
-- ==============================================================================

-- Vista del panel de control de transparencia por Eje
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

-- Trigger para recompensar con puntos cívicos cuando un joven participa o valora
CREATE OR REPLACE FUNCTION fn_sumar_puntos_por_valoracion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET puntos_civicos = puntos_civicos + 50
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_valoracion_puntos
AFTER INSERT ON valoraciones
FOR EACH ROW
EXECUTE FUNCTION fn_sumar_puntos_por_valoracion();
