const GameEngine = {
    // Estado interno das linhas (Memória)
    estadoLinhas: {},

    /**
     * Função chamada pelo index.html para começar o jogo
     */
    iniciar: function() {
        console.log("Motor iniciado!");
    },

    /**
     * Inicializa o estado das linhas do tabuleiro com base na configuração do XML.
     * @param {*} xmlDoc - Documento XML contendo a configuração do jogo. 
     */
    inicializarLinhas: function(xmlDoc) {
        // Extrai o número de linhas e colunas do tabuleiro a partir do XML
        let $tabuleiro = $(xmlDoc).find('tabuleiro');
        let numLinhas = parseInt($tabuleiro.attr('linhas'));
        let numColunas = parseInt($tabuleiro.attr('colunas'));

        // Inicializa o estado das linhas horizontais (H)
        for (let l = 0; l < numLinhas; l++) {
            for (let c = 0; c < numColunas - 1; c++) {
                let id = `h-${l}-${c}`;
                this.estadoLinhas[id] = { id: id, status: 'livre', dono: null };
            }
        }

        // Inicializa o estado das linhas verticais (V)
        for (let l = 0; l < numLinhas - 1; l++) {
            for (let c = 0; c < numColunas; c++) {
                let id = `v-${l}-${c}`;
                this.estadoLinhas[id] = { id: id, status: 'livre', dono: null };
            }
        }
        console.log("Linhas inicializadas na memória:", this.estadoLinhas);
    },

    /**
     * Processa uma jogada feita por um jogador.
     * 
     * @param {*} idLinha linha selecionada.
     * @param {*} idJogador jogador que fez a jogada.
     * @returns {boolean} true se a jogada for válida, false caso contrário.
     */
    processarJogada: function(idLinha, idJogador) {
        let linha = this.estadoLinhas[idLinha];

        // Se a linha não existe na memória, cria ela na hora
        if (!linha) {
            console.warn(`Linha ${idLinha} não encontrada na memória (Criando para teste)`);
            this.estadoLinhas[idLinha] = { id: idLinha, status: 'livre', dono: null };
            linha = this.estadoLinhas[idLinha];
        }

        if (linha && linha.status === 'livre') {
            // Atualiza estado
            linha.status = 'ocupada';
            linha.dono = idJogador;

            // Registra a jogada
            console.log(`Linha ${idLinha} dominada por ${idJogador}`);
            return true; // Jogada válida
        }

        console.log("Jogada inválida ou linha ocupada");
        return false; // Jogada inválida
    }
};