import json
import re
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    with open('js/data-ejes.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Locate the JSON array
    prefix = 'const EJES_DATA = '
    start_pos = content.find(prefix) + len(prefix)
    end_pos = content.rfind('; if (typeof window')
    if end_pos == -1:
        end_pos = content.rfind(';\nif (typeof window')
    if end_pos == -1:
        end_pos = content.rfind(';\n\nif (typeof window')
    if end_pos == -1:
        # Find the last closing bracket of array
        end_pos = content.rfind('];') + 1

    json_str = content[start_pos:end_pos].strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1].strip()

    ejes = json.loads(json_str)
    print(f"Loaded {len(ejes)} Ejes successfully.")

    # Budgets from Section 14.1 of Plan
    budget_by_eje = {
        1: 2500,
        2: 4000,
        3: 2500,
        4: 1500,
        5: 2000,
        6: 1500,
        7: 1000
    }

    # Supplying realistic companies and professionals for invoices & payrolls
    proveedores_eje = {
        1: [
            {"nombre": "Aventura y Guías Sierra de Segura S.L.", "cif": "B-23451290", "tipo": "factura", "item": "Material de campo, senderismo y bolsas biodegradables"},
            {"nombre": "Carlos M. S. (Monitor Ambiental)", "cif": "***4128**", "tipo": "nomina", "item": "Nómina monitor jornadas de voluntariado verde y limpieza"},
            {"nombre": "Viveros y Madera Segura C.B.", "cif": "E-23881234", "tipo": "factura", "item": "Plantones autóctonos y protectores para reforestación"},
            {"nombre": "Estudio Creativo Rural", "cif": "B-23910452", "tipo": "factura", "item": "Campaña audiovisual y cartelería ambiental"},
            {"nombre": "Marta N. P. (Formadora Tecnológica)", "cif": "***8834**", "tipo": "nomina", "item": "Nómina formadora talleres prácticos de competencias digitales e IA"},
            {"nombre": "Sistemas Informáticos Segura S.L.", "cif": "B-23114920", "tipo": "factura", "item": "Equipamiento de aula digital y licencias de software"},
            {"nombre": "Desarrollo Web & Cloud S.L.", "cif": "B-23881099", "tipo": "factura", "item": "Mantenimiento servidor y portal digital de juventud"},
            {"nombre": "Javier T. M. (Dinamizador de Redes)", "cif": "***7712**", "tipo": "nomina", "item": "Nómina dinamizador canal juvenil de información comarcal"}
        ],
        2: [
            {"nombre": "Sonido e Iluminación Sierra Sur", "cif": "B-23771940", "tipo": "factura", "item": "Alquiler de equipos para festivales y conciertos juveniles"},
            {"nombre": "Laura R. G. (Coordinadora Ocio Juvenil)", "cif": "***5519**", "tipo": "nomina", "item": "Nómina monitora ocio alternativo de fin de semana"},
            {"nombre": "Asociación Juvenil Los Pinos de Orcera", "cif": "G-23990145", "tipo": "factura", "item": "Materiales lúdicos, juegos de mesa gigantes y talleres"},
            {"nombre": "Deportes y Competición Segura S.L.", "cif": "B-23441920", "tipo": "factura", "item": "Trofeos, balones y equipamiento torneos juveniles"},
            {"nombre": "Sergio B. V. (Árbitro y Monitor Deportivo)", "cif": "***6621**", "tipo": "nomina", "item": "Nómina arbitrajes y coordinación liga juvenil comarcal"},
            {"nombre": "Compañía Teatral Sierra de Segura", "cif": "B-23190874", "tipo": "factura", "item": "Talleres de expresión dramática y montaje escénico"},
            {"nombre": "Imprenta y Rotulación Orcera", "cif": "B-23551029", "tipo": "factura", "item": "Folletos de ocio saludable y programas culturales"},
            {"nombre": "Elena G. F. (Tallerista Creativa)", "cif": "***9012**", "tipo": "nomina", "item": "Nómina monitora talleres de pintura mural y fotografía"}
        ],
        3: [
            {"nombre": "Consultoría y Orientación Laboral Jaén S.L.", "cif": "B-23992014", "tipo": "factura", "item": "Servicio de asesoramiento para becas y ciclos formativos"},
            {"nombre": "Andrés P. L. (Orientador Académico)", "cif": "***3341**", "tipo": "nomina", "item": "Nómina técnico de empleo y asesoramiento profesional"},
            {"nombre": "Academia de Formación y Nuevas Profesiones", "cif": "B-23880123", "tipo": "factura", "item": "Plataforma online de microcursos y certificados homologados"},
            {"nombre": "Asociación de Jóvenes Emprendedores Rurales", "cif": "G-23771920", "tipo": "factura", "item": "Jornadas de fomento del autoempleo y cooperativismo"},
            {"nombre": "Patricia M. V. (Agente de Desarrollo Rural)", "cif": "***7730**", "tipo": "nomina", "item": "Nómina técnica acompañamiento a proyectos de vivienda joven"},
            {"nombre": "Gabinete Técnico Vivienda Segura", "cif": "B-23450912", "tipo": "factura", "item": "Estudio técnico y mapa de vivienda disponible para emancipación"},
            {"nombre": "Imprenta Sierra Segura", "cif": "B-23774102", "tipo": "factura", "item": "Guía práctica de ayudas al alquiler y rehabilitación para jóvenes"}
        ],
        4: [
            {"nombre": "Dinamiza Participación Ciudadana S.L.", "cif": "B-23881920", "tipo": "factura", "item": "Dinamización de mesas de diálogo y pleno juvenil"},
            {"nombre": "Rubén C. M. (Técnico de Participación)", "cif": "***4401**", "tipo": "nomina", "item": "Nómina técnico coordinador del Consejo de Juventud"},
            {"nombre": "Federación Provincial de Asociaciones Juveniles", "cif": "G-23661092", "tipo": "factura", "item": "Asesoría jurídica y contable para constitución de asociaciones"},
            {"nombre": "Papelería y Suministros Orcera", "cif": "B-23991204", "tipo": "factura", "item": "Material de oficina y actas para colectivos juveniles"},
            {"nombre": "Sonia V. T. (Coordinadora de Voluntariado)", "cif": "***2289**", "tipo": "nomina", "item": "Nómina responsable red municipal de voluntariado joven"},
            {"nombre": "Transportes Segura S.A.", "cif": "A-23110940", "tipo": "factura", "item": "Desplazamiento para encuentro comarcal de jóvenes activos"}
        ],
        5: [
            {"nombre": "Gabinete de Psicología y Bienestar Emocional", "cif": "B-23554190", "tipo": "factura", "item": "Talleres grupales de gestión del estrés y salud mental"},
            {"nombre": "Beatriz L. M. (Psicóloga Juvenil)", "cif": "***8821**", "tipo": "nomina", "item": "Nómina profesional acompañamiento y talleres de autoestima"},
            {"nombre": "Asociación de Prevención de Adicciones Sierra Sur", "cif": "G-23441098", "tipo": "factura", "item": "Campañas de prevención de consumo de sustancias y pantallas"},
            {"nombre": "Nutrición y Salud Comunitaria C.B.", "cif": "E-23771890", "tipo": "factura", "item": "Talleres prácticos de cocina sana y hábitos saludables"},
            {"nombre": "Fernando G. R. (Educador Social)", "cif": "***3390**", "tipo": "nomina", "item": "Nómina educador para inclusión de jóvenes en vulnerabilidad"},
            {"nombre": "Imprenta y Diseño Orcera", "cif": "B-23551029", "tipo": "factura", "item": "Guía de recursos de salud mental y teléfonos de apoyo 24h"}
        ],
        6: [
            {"nombre": "Coeduca y Convivencia S.L.", "cif": "B-23994102", "tipo": "factura", "item": "Talleres de prevención de violencia de género en centros juveniles"},
            {"nombre": "Carmen S. D. (Agente de Igualdad)", "cif": "***6610**", "tipo": "nomina", "item": "Nómina técnica responsable de programas de igualdad joven"},
            {"nombre": "Asociación por la Diversidad y la Inclusión", "cif": "G-23880199", "tipo": "factura", "item": "Material pedagógico y campañas contra la discriminación"},
            {"nombre": "Mediación y Diálogo Sierra de Segura", "cif": "B-23119024", "tipo": "factura", "item": "Talleres de resolución pacífica de conflictos comunitarios"},
            {"nombre": "Manuel R. K. (Mediador Comunitario)", "cif": "***9921**", "tipo": "nomina", "item": "Nómina mediador para actividades de convivencia entre iguales"},
            {"nombre": "Estudio Creativo Sierra", "cif": "B-23910452", "tipo": "factura", "item": "Campaña en redes por el respeto y contra el ciberacoso"}
        ],
        7: [
            {"nombre": "Evaluación Pública y Estrategia S.L.", "cif": "B-23661902", "tipo": "factura", "item": "Consultoría externa para indicadores y sistema de evaluación"},
            {"nombre": "Álvaro D. G. (Técnico de Coordinación Municipal)", "cif": "***5512**", "tipo": "nomina", "item": "Nómina técnico redacción informes anuales de evaluación"},
            {"nombre": "Plataforma OpenGov y Datos Abiertos S.L.", "cif": "B-23771092", "tipo": "factura", "item": "Licencia del visor de transparencia y rendición de cuentas"},
            {"nombre": "Imprenta y Maquetación de Informes", "cif": "B-23774102", "tipo": "factura", "item": "Edición y maquetación de informes anuales para Pleno Municipal"},
            {"nombre": "Sara M. H. (Auditora de Calidad)", "cif": "***1124**", "tipo": "nomina", "item": "Nómina técnica recopilación de fichas de seguimiento"}
        ]
    }

    # Rates for annual execution:
    # 2027: year in progress / closed (around 92%)
    # 2028: consolidation (around 87%)
    # 2029: midway (around 90%)
    # 2030: maturity (around 93%)
    # 2031: closing evaluation (around 95%)
    tasa_ano = {
        2027: 0.928,
        2028: 0.884,
        2029: 0.912,
        2030: 0.936,
        2031: 0.960
    }

    for eje in ejes:
        eje_num = eje["id"]
        annual_budget = budget_by_eje[eje_num]
        prov_list = proveedores_eje[eje_num]

        # Financial structure by year (2027 to 2031)
        finanzas_por_ano = {}
        resumen_quinquenal = []

        all_actions = eje["acciones"]

        for yr in [2027, 2028, 2029, 2030, 2031]:
            # Filter actions active in this year
            active_actions = [acc for acc in all_actions if yr in acc["roadmap"]["anos"]]
            num_active = len(active_actions)
            if num_active == 0:
                active_actions = all_actions[:3]
                num_active = len(active_actions)

            tasa = tasa_ano[yr]
            gasto_total_ano = round(annual_budget * tasa, 2)
            saldo_ano = round(annual_budget - gasto_total_ano, 2)

            # Revenue breakdown according to Section 14.2:
            # 60% Ayto, 20% Diputacion, 15% Junta/IAJ, 5% Otras
            fuentes_ingreso = {
                "recursosPropios": round(annual_budget * 0.60, 2),
                "diputacionJaen": round(annual_budget * 0.20, 2),
                "juntaAndaluciaIAJ": round(annual_budget * 0.15, 2),
                "otrasAyudas": round(annual_budget * 0.05, 2)
            }

            # Distribute budget and expenses among active actions
            base_alloc = round(annual_budget / num_active, 2)
            proyectos_ano = []
            todos_justificantes_ano = []

            for i, acc in enumerate(active_actions):
                # Small variation for realism
                weight = 1.0 + ((i % 3) - 1) * 0.15
                alloc_action = round(base_alloc * weight, 2)
                gasto_action = round(alloc_action * tasa, 2)
                saldo_action = round(alloc_action - gasto_action, 2)
                pct_action = round((gasto_action / alloc_action) * 100, 1)

                # Generate 1 Factura and 1 Nómina (or 2 receipts) per action
                prov1 = prov_list[(i * 2) % len(prov_list)]
                prov2 = prov_list[(i * 2 + 1) % len(prov_list)]

                split_factor = 0.55
                monto1 = round(gasto_action * split_factor, 2)
                monto2 = round(gasto_action - monto1, 2)

                ref_num1 = f"{'FAC' if prov1['tipo'] == 'factura' else 'NOM'}-{yr}-E{eje_num}-{acc['numero']}A"
                ref_num2 = f"{'FAC' if prov2['tipo'] == 'factura' else 'NOM'}-{yr}-E{eje_num}-{acc['numero']}B"

                just1 = {
                    "id": f"JUST-{yr}-E{eje_num}-{acc['numero']}-1",
                    "tipo": prov1["tipo"],
                    "tipoLabel": "Factura Comercial" if prov1["tipo"] == "factura" else "Nómina de Personal",
                    "ref": ref_num1,
                    "accionCodigo": acc["codigo"],
                    "accionTitulo": acc["titulo"],
                    "proveedorBeneficiario": prov1["nombre"],
                    "cifNif": prov1["cif"],
                    "concepto": f"{prov1['item']} ({acc['codigo']})",
                    "fecha": f"{10 + (i * 3) % 18:02d}/{(3 + i) % 12 + 1:02d}/{yr}",
                    "importe": monto1,
                    "estado": "Aprobado y Fiscalizado por Intervención",
                    "partidaPresupuestaria": f"337.226.09 (Gasto Juventud Eje {eje_num})",
                    "numExpediente": f"EXP-JUV-{yr}-{eje_num}{acc['numero']}"
                }

                just2 = {
                    "id": f"JUST-{yr}-E{eje_num}-{acc['numero']}-2",
                    "tipo": prov2["tipo"],
                    "tipoLabel": "Factura Comercial" if prov2["tipo"] == "factura" else "Nómina de Personal",
                    "ref": ref_num2,
                    "accionCodigo": acc["codigo"],
                    "accionTitulo": acc["titulo"],
                    "proveedorBeneficiario": prov2["nombre"],
                    "cifNif": prov2["cif"],
                    "concepto": f"{prov2['item']} ({acc['codigo']})",
                    "fecha": f"{15 + (i * 2) % 13:02d}/{(4 + i) % 12 + 1:02d}/{yr}",
                    "importe": monto2,
                    "estado": "Aprobado y Fiscalizado por Intervención",
                    "partidaPresupuestaria": f"337.131.00 (Personal Juventud)" if prov2["tipo"] == "nomina" else f"337.226.09 (Gasto Juventud Eje {eje_num})",
                    "numExpediente": f"EXP-JUV-{yr}-{eje_num}{acc['numero']}"
                }

                proy_item = {
                    "codigo": acc["codigo"],
                    "codigoSimple": acc["codigoSimple"],
                    "numero": acc["numero"],
                    "titulo": acc["titulo"],
                    "responsable": acc["responsable"],
                    "duracion": acc["roadmap"]["vigencia"],
                    "previsionIngresos": alloc_action,
                    "gastoEjecutado": gasto_action,
                    "saldo": saldo_action,
                    "porcentajeEjecucion": pct_action,
                    "justificantes": [just1, just2]
                }
                proyectos_ano.append(proy_item)
                todos_justificantes_ano.extend([just1, just2])

            # Recalculate exact sum to guarantee 100% mathematical consistency
            calc_ingresos = round(sum(p["previsionIngresos"] for p in proyectos_ano), 2)
            calc_gastos = round(sum(p["gastoEjecutado"] for p in proyectos_ano), 2)

            finanzas_por_ano[yr] = {
                "ano": yr,
                "ingresosPrevistosTotal": annual_budget,
                "fuentesIngreso": fuentes_ingreso,
                "gastosEjecutadosTotal": calc_gastos,
                "saldoRemanente": round(annual_budget - calc_gastos, 2),
                "porcentajeEjecucion": round((calc_gastos / annual_budget) * 100, 1),
                "accionesDesarrolladas": proyectos_ano,
                "totalAccionesActivas": len(proyectos_ano),
                "justificantes": todos_justificantes_ano,
                "totalFacturas": len([j for j in todos_justificantes_ano if j["tipo"] == "factura"]),
                "totalNominas": len([j for j in todos_justificantes_ano if j["tipo"] == "nomina"])
            }

            resumen_quinquenal.append({
                "ano": yr,
                "ingresos": annual_budget,
                "gastos": calc_gastos,
                "saldo": round(annual_budget - calc_gastos, 2),
                "porcentaje": round((calc_gastos / annual_budget) * 100, 1),
                "acciones": len(proyectos_ano),
                "facturas": len([j for j in todos_justificantes_ano if j["tipo"] == "factura"]),
                "nominas": len([j for j in todos_justificantes_ano if j["tipo"] == "nomina"])
            })

        eje["finanzasPorAno"] = finanzas_por_ano
        eje["resumenQuinquenalFinanzas"] = resumen_quinquenal
        # Update compatibility fields
        eje["presupuestoReal2027"] = int(finanzas_por_ano[2027]["gastosEjecutadosTotal"])

    # Output back to js/data-ejes.js
    new_js = "/**\n * III PLAN MUNICIPAL DE JUVENTUD DE ORCERA (2027-2031)\n * DATA OFICIAL: 7 Ejes, 21 Objetivos Específicos, 63 Acciones Oficiales y 378 Indicadores Oficiales\n * GESTIÓN ECONÓMICA ANUALIZADA: Ingresos, Gastos por Proyecto, Facturas y Nóminas\n */\n\n"
    new_js += "const EJES_DATA = " + json.dumps(ejes, ensure_ascii=False, indent=2) + ";\n\n"
    new_js += "if (typeof window !== 'undefined') {\n  window.EJES_DATA = EJES_DATA;\n}\n"

    with open('js/data-ejes.js', 'w', encoding='utf-8') as f:
        f.write(new_js)

    print("Successfully built financial module in js/data-ejes.js!")
    print(f"Eje 1 (2027): Ingresos={ejes[0]['finanzasPorAno']['2027']['ingresosPrevistosTotal']} €, Gastos={ejes[0]['finanzasPorAno']['2027']['gastosEjecutadosTotal']} €, Acciones activas={len(ejes[0]['finanzasPorAno']['2027']['accionesDesarrolladas'])}, Justificantes={len(ejes[0]['finanzasPorAno']['2027']['justificantes'])}")

if __name__ == '__main__':
    main()
