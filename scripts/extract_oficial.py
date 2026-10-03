import re
import json
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    with open('docs/plan_completo_extraido.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('=== PAGINA 29 ===')
    # Search for the Section 12 header AFTER start_idx
    end_idx = text.find('12. SISTEMA DE SEGUIMIENTO Y EVALUACIÓN', start_idx)
    if end_idx == -1:
        end_idx = text.find('=== PAGINA 65 ===', start_idx)

    actions_raw = text[start_idx:end_idx]
    actions_clean = re.sub(r'===\s*PAGINA\s*\d+\s*===', ' ', actions_raw)
    actions_clean = re.sub(r'\s+', ' ', actions_clean)

    eje_pattern = re.compile(r'EJE\s+ESTRATÉGICO\s+(\d+)\.\s*(.*?)(?=EJE\s+ESTRATÉGICO|\Z)', re.I)
    ejes = eje_pattern.findall(actions_clean)

    def split_indicators(ind_text):
        parts = re.split(r'\.\s+(?=[A-ZÁÉÍÓÚ])', ind_text.strip())
        indicators = [p.strip().rstrip('.') for p in parts if len(p.strip()) > 3]
        return indicators

    data = []

    for eje_num, eje_body in ejes:
        eje_num = int(eje_num)
        m_title = re.match(r'^(.*?)\s+Objetivo específico', eje_body)
        eje_title = m_title.group(1).strip() if m_title else ''
        
        block_pattern = re.compile(
            r'Objetivo específico\s+(\d+)\s+(.*?)\s+Acción\s+(.*?)\s+Persona y/o departamento(?: responsable)?\s+(.*?)\s+Recursos\s+(.*?)\s+Indicador(?:es)?\s+(.*?)(?=Objetivo específico|\Z)',
            re.I
        )
        blocks = block_pattern.findall(eje_body)
        
        eje_dict = {
            'eje_numero': eje_num,
            'eje_titulo': eje_title,
            'objetivos': {}
        }
        
        act_idx = 1
        for obj_num, obj_desc, act_desc, resp, rec, ind_str in blocks:
            obj_num = int(obj_num)
            indicators = split_indicators(ind_str)
            
            if obj_num not in eje_dict['objetivos']:
                eje_dict['objetivos'][obj_num] = {
                    'obj_num': obj_num,
                    'obj_titulo': obj_desc.strip(),
                    'acciones': []
                }
            
            action_item = {
                'act_num': act_idx,
                'codigo': f'ACC-{eje_num}.{obj_num}.{((act_idx - 1) % 3) + 1}',
                'codigo_simple': f'{eje_num}.{act_idx}',
                'titulo': act_desc.strip(),
                'responsable': resp.strip(),
                'recursos': rec.strip(),
                'indicadores': indicators
            }
            eje_dict['objetivos'][obj_num]['acciones'].append(action_item)
            act_idx += 1
            
        data.append(eje_dict)

    with open('docs/acciones_e_indicadores_oficiales.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total_acc = sum(len(o['acciones']) for e in data for o in e['objetivos'].values())
    total_ind = sum(len(a['indicadores']) for e in data for o in e['objetivos'].values() for a in o['acciones'])
    print(f'Total Ejes: {len(data)}, Total Acciones: {total_acc}, Total Indicadores Oficiales: {total_ind}')
    acc_7_3_3 = data[6]['objetivos'][3]['acciones'][2]
    print('ACC-7.3.3 indicators count:', len(acc_7_3_3['indicadores']))
    for ind in acc_7_3_3['indicadores']:
        print('  *', ind)

if __name__ == '__main__':
    main()
