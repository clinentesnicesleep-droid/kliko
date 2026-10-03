import json

with open('scripts/ejes_extracted.json', encoding='utf-8') as f:
    ejes = json.load(f)

# Metadata for each Eje
eje_meta = {
    1: {"icono": "🌲", "color": "#10b981", "color2": "#06b6d4", "presupuesto": "12.500 € (2.500 €/año)", "subtitulo": "Naturaleza protegida y futuro digital desde la Sierra de Segura"},
    2: {"icono": "🎭", "color": "#f59e0b", "color2": "#ef4444", "presupuesto": "13.000 € (2.600 €/año)", "subtitulo": "Cultura viva, deporte, hábitos saludables y creatividad en Orcera"},
    3: {"icono": "💼", "color": "#06b6d4", "color2": "#3b82f6", "presupuesto": "14.500 € (2.900 €/año)", "subtitulo": "Oportunidades de empleo, formación técnica y acceso a la vivienda rural"},
    4: {"icono": "🤝", "color": "#8b5cf6", "color2": "#ec4899", "presupuesto": "10.000 € (2.000 €/año)", "subtitulo": "Asociacionismo, voluntariado activo y codecisión en los asuntos del pueblo"},
    5: {"icono": "❤️", "color": "#ec4899", "color2": "#f43f5e", "presupuesto": "9.500 € (1.900 €/año)", "subtitulo": "Bienestar emocional, salud mental preventiva e inclusión comunitaria"},
    6: {"icono": "⚖️", "color": "#3b82f6", "color2": "#8b5cf6", "presupuesto": "8.000 € (1.600 €/año)", "subtitulo": "Igualdad real, relaciones libres de violencia y respeto a la diversidad"},
    7: {"icono": "🏛️", "color": "#14b8a6", "color2": "#10b981", "presupuesto": "7.500 € (1.500 €/año)", "subtitulo": "Transparencia pública, coordinación municipal y evaluación continua"}
}

# Curated concise readable titles for the 9 actions of each axis
curated_titles = {
    "ACC-1.1.1": "Sensibilización ambiental anual, jornadas de limpieza y rutas interpretativas",
    "ACC-1.1.2": "Iniciativas juveniles para la conservación y puesta en valor del patrimonio natural",
    "ACC-1.1.3": "Campañas de reciclaje, consumo responsable, ahorro energético y cuidado del agua",
    "ACC-1.2.1": "Talleres de competencias digitales aplicadas al empleo y trámites administrativos",
    "ACC-1.2.2": "Uso seguro y responsable de internet, ciberseguridad y prevención de desinformación",
    "ACC-1.2.3": "Adecuación y dinamización de puntos de acceso a internet en el Telecentro",
    "ACC-1.3.1": "Talleres de iniciación a programación, robótica y nuevas tecnologías aplicadas",
    "ACC-1.3.2": "Puntos de recarga de dispositivos y mejora de conectividad en espacios juveniles",
    "ACC-1.3.3": "Promoción de iniciativas juveniles vinculadas a la innovación y sostenibilidad local",

    "ACC-2.1.1": "Programación anual de ocio educativo: talleres, jornadas temáticas y convivencias",
    "ACC-2.1.2": "Actividades de ocio alternativo nocturno y de fin de semana en espacios municipales",
    "ACC-2.1.3": "Participación activa de la juventud en el diseño de las actividades de ocio",
    "ACC-2.2.1": "Talleres culturales, artísticos y creativos: música, artes plásticas y creación digital",
    "ACC-2.2.2": "Espacios y certámenes para la exposición y difusión de creaciones artísticas jóvenes",
    "ACC-2.2.3": "Facilitación del acceso juvenil a eventos culturales y tradiciones locales de Orcera",
    "ACC-2.3.1": "Programación deportiva juvenil: ligas locales, torneos de pádel y actividades de montaña",
    "ACC-2.3.2": "Campañas y talleres de hábitos de vida saludables y nutrición equilibrada",
    "ACC-2.3.3": "Actividades deportivas inclusivas, intergeneracionales y de convivencia comunitaria",

    "ACC-3.1.1": "Difusión continuada de oferta formativa: FP, universidad, becas e itinerarios",
    "ACC-3.1.2": "Sesiones de orientación académica y profesional personalizada para jóvenes",
    "ACC-3.1.3": "Cursos formativos presenciales y online adaptados a los sectores emergentes locales",
    "ACC-3.2.1": "Bolsa de empleo joven, difusión de ofertas, planes de empleo y orientación laboral",
    "ACC-3.2.2": "Talleres de preparación laboral: currículum digital, entrevistas y búsqueda activa",
    "ACC-3.2.3": "Asesoramiento al emprendimiento, autoempleo y ayudas a la creación de negocios",
    "ACC-3.3.1": "Información y tramitación de ayudas al alquiler y programas de vivienda joven",
    "ACC-3.3.2": "Asesoramiento integral sobre emancipación, contratos y suministros de vivienda",
    "ACC-3.3.3": "Observatorio de necesidades habitacionales juveniles y bolsa local de viviendas vacías",

    "ACC-4.1.1": "Encuentros periódicos entre jóvenes y Ayuntamiento: diálogo directo y propuestas",
    "ACC-4.1.2": "Canales digitales y buzón participativo en la app municipal para recogida de ideas",
    "ACC-4.1.3": "Consultas y votaciones juveniles vinculantes sobre programación municipal",
    "ACC-4.2.1": "Apoyo a la reactivación formal de la Asociación Juvenil de Orcera y carnet digital",
    "ACC-4.2.2": "Cesión y autogestión de recursos y espacios municipales para colectivos juveniles",
    "ACC-4.2.3": "Convocatoria anual de microayudas para proyectos ideados por jóvenes del municipio",
    "ACC-4.3.1": "Campañas de fomento del voluntariado y solidaridad comunitaria entre jóvenes",
    "ACC-4.3.2": "Programa de voluntariado medioambiental, cultural y de apoyo a personas mayores",
    "ACC-4.3.3": "Alianzas con entidades sociales comarcales para acreditación de competencias voluntarias",

    "ACC-5.1.1": "Campañas preventivas contra adicciones: sustancias, juego patológico y pantallas",
    "ACC-5.1.2": "Talleres de hábitos saludables: descanso, actividad física y gestión del estrés",
    "ACC-5.1.3": "Guía y mapa de recursos sanitarios y de prevención accesibles para jóvenes",
    "ACC-5.2.1": "Talleres de educación emocional, gestión de la ansiedad, frustración y autoestima",
    "ACC-5.2.2": "Sensibilización contra el estigma en salud mental y promoción del apoyo psicológico",
    "ACC-5.2.3": "Servicio de asesoría y orientación psicológica joven y confidencial en Orcera",
    "ACC-5.3.1": "Difusión de recursos sociales de protección y apoyo a familias y juventud vulnerable",
    "ACC-5.3.2": "Acciones de sensibilización sobre inclusión social, diversidad funcional y accesibilidad",
    "ACC-5.3.3": "Itinerarios de inclusión y acompañamiento individualizado para jóvenes en riesgo social",

    "ACC-6.1.1": "Talleres y campañas de sensibilización en igualdad de género y corresponsabilidad",
    "ACC-6.1.2": "Prevención activa de la violencia machista, relaciones tóxicas y ciberacoso sexista",
    "ACC-6.1.3": "Promoción del lenguaje inclusivo y eliminación de roles y estereotipos sexistas",
    "ACC-6.2.1": "Sensibilización sobre diversidad cultural, funcional y colectivo LGTBI+",
    "ACC-6.2.2": "Protocolo de inclusión y accesibilidad universal en todas las actividades municipales",
    "ACC-6.2.3": "Campañas de tolerancia cero frente al racismo, la xenofobia y los delitos de odio",
    "ACC-6.3.1": "Talleres de comunicación asertiva, resolución pacífica de conflictos y mediación",
    "ACC-6.3.2": "Actividades de convivencia comunitaria, respeto mutuo y diálogo intergeneracional",
    "ACC-6.3.3": "Pautas de prevención del acoso escolar (bullying) y ciberacoso en centros y redes",

    "ACC-7.1.1": "Comisión de coordinación interconcejalías para transversalidad de las políticas de juventud",
    "ACC-7.1.2": "Convenios con IES El Yelmo, asociaciones locales y agentes socioeconómicos",
    "ACC-7.1.3": "Agenda unificada y calendario anual coordinado de actuaciones con la juventud",
    "ACC-7.2.1": "Plataforma digital interactiva y métricas ciudadanas en tiempo real para seguimiento",
    "ACC-7.2.2": "Metodologías ágiles e innovadoras en el desarrollo de actividades juveniles",
    "ACC-7.2.3": "Intercambio de buenas prácticas con redes de municipios rurales de Andalucía y Europa",
    "ACC-7.3.1": "Cuadro de mando e indicadores oficiales anuales de ejecución del III Plan",
    "ACC-7.3.2": "Memoria e informe anual de evaluación y rendición de cuentas pública en el Pleno",
    "ACC-7.3.3": "Evaluación final de impacto del Plan (2027–2031) y bases para el IV Plan Municipal"
}

print(f"Total curated titles: {len(curated_titles)}")
for eje in ejes:
    for a in eje['acciones']:
        if a['codigo'] not in curated_titles:
            print(f"MISSING: {a['codigo']}")
print("All matched!")
