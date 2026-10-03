import re
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    modal_snippet = """
  <!-- MODAL DE VOLANTE DE JUSTIFICANTE CONTABLE OFICIAL (FACTURA O NÓMINA) -->
  <div class="modal-overlay" id="justificante-modal" role="dialog" aria-hidden="true">
    <div class="volante-contable-box">
      <button class="btn-close-modal" id="close-justificante-modal" aria-label="Cerrar justificante">&times;</button>

      <div class="volante-header">
        <div class="volante-header-text">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="font-size:1.1rem;">🏛️</span>
            <strong>AYUNTAMIENTO DE ORCERA</strong>
          </div>
          <h3>Intervención y Tesorería Municipal</h3>
          <p>Justificación Contable · III Plan Municipal de Juventud (2027–2031)</p>
        </div>
        <div class="volante-seal">
          Fiscalizado<br>Intervención<br>Orcera
        </div>
      </div>

      <div id="justificante-modal-content">
        <!-- Rellenado dinámicamente con JS -->
      </div>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px;">
        <button type="button" class="btn btn-secondary" id="btn-print-justificante" style="padding: 6px 12px; font-size: 0.76rem;">
          🖨️ Imprimir Volante
        </button>
        <button type="button" class="btn btn-primary" id="btn-close-justificante" style="padding: 6px 14px; font-size: 0.76rem;">
          Cerrar
        </button>
      </div>
    </div>
  </div>
"""

    if 'id="justificante-modal"' not in html:
        # Insert before </body> or right after qr-modal
        qr_pos = html.find('id="qr-modal"')
        if qr_pos != -1:
            end_qr = html.find('</div>\n  </div>', qr_pos)
            if end_qr != -1:
                insert_pos = end_qr + len('</div>\n  </div>')
                html = html[:insert_pos] + "\n" + modal_snippet + html[insert_pos:]
            else:
                html = html.replace('</body>', modal_snippet + '\n</body>')
        else:
            html = html.replace('</body>', modal_snippet + '\n</body>')

        # Bump versions
        html = re.sub(r'data-ejes\.js\?v=[^"]*', 'data-ejes.js?v=finanzas_anualizadas_v1', html)
        html = re.sub(r'app\.js\?v=[^"]*', 'app.js?v=finanzas_anualizadas_v1', html)

        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Successfully added justificante-modal to index.html and bumped versions!")
    else:
        print("justificante-modal already in index.html.")

if __name__ == '__main__':
    main()
