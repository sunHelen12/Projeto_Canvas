var estadoLinhas = {}; 

/**
 * Inicializa o estado das linhas do tabuleiro com base na configuração do XML.
 * 
 * @param {*} xmlDoc - Documento XML contendo a configuração do jogo. 
 */
function inicializarLinhas(xmlDoc) {
    // Extrai o número de linhas e colunas do tabuleiro a partir do XML
    let $tabuleiro = $(xmlDoc).find('tabuleiro');
    let numLinhas = parseInt($tabuleiro.attr('linhas'));
    let numColunas = parseInt($tabuleiro.attr('colunas'));

    // Inicializa o estado das linhas horizontais e verticais
    for (let l = 0; l < numLinhas; l++) {
        for (let c = 0; c < numColunas - 1; c++) {
            let id = `h-${l}-${c}`;
            estadoLinhas[id] = { id: id, status: 'livre', dono: null };
        }
    }

    // Linhas verticais
    for (let l = 0; l < numLinhas - 1; l++) {
        for (let c = 0; c < numColunas; c++) {
            let id = `v-${l}-${c}`;
            estadoLinhas[id] = { id: id, status: 'livre', dono: null };
        }
    }
}