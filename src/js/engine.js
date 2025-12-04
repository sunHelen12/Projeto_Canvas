const GameEngine = {
    dadosDoJogo:{},

    /**
     * Função de inicialização 
     *  
     */ 
    iniciar: function(){
        console.log("Motor ligado...")

        $.get("../data/game-config.xml")
            .done((xml) =>{
                console.log("XML Recebido!");
                this.processarDados(xml);
            })
            .fail(() => {
                alert("Erro ao carregar XML!")
            });
    },

    processarDados: function(xmlDoc){
        console.log("Processando dados...");
        const $xml = $(xmlDoc);
        const $tabuleiro = $xml.find("tabuleiro");

        inicializarLinhas(xmlDoc);

        this.dadosDoJogo = {
            titulo: $xml.find('titulo').text(),
            linhas: parseInt($tabuleiro.attr('linhas')),
            colunas: parseInt($tabuleiro.attr('colunas'))
        };       

        if(typeof GameView !== 'undefined'){
            GameView.renderizarTabuleiro(this.dadosDoJogo);
        }
    },    
    
    /**
     * Processando a jogada 
     */
    processarJogada: function(idLinha, idJogador) {
        console.log(`Game Engine recebeu jogada na linha ${idLinha}`);
        return processarJogada(idLinha, idJogador);
    },

    reiniciar: function() {
        console.log("Reiniciando jogo...");
        
        estadoLinhas = {}; 

        this.iniciar();
    },
};


var estadoLinhas = {};

    /**
     * Inicializa o estado das linhas do tabuleiro com base na configuração do XML.
     * @param {*} xmlDoc - Documento XML contendo a configuração do jogo. 
     */
    function inicializarLinhas(xmlDoc) {
        let $tabuleiro = $(xmlDoc).find('tabuleiro');
        let numLinhas = parseInt($tabuleiro.attr('linhas'));
        let numColunas = parseInt($tabuleiro.attr('colunas'));

        for (let l = 0; l < numLinhas; l++) {
            for (let c = 0; c < numColunas - 1; c++) {
                let id = `h-${l}-${c}`;
                estadoLinhas[id] = { id: id, status: 'livre', dono: null };
            }
        }

        for (let l = 0; l < numLinhas - 1; l++) {
            for (let c = 0; c < numColunas; c++) {
                let id = `v-${l}-${c}`;
                estadoLinhas[id] = { id: id, status: 'livre', dono: null };
            }
        }
        console.log("Linhas inicializadas na memória:", estadoLinhas);
    }

    /**
     * Processa uma jogada feita por um jogador.
     * 
     * @param {*} idLinha linha selecionada.
     * @param {*} idJogador jogador que fez a jogada.
     * @returns {boolean} true se a jogada for válida, false caso contrário.
     */
    function processarJogada (idLinha, idJogador) {
        let linha = estadoLinhas[idLinha];

        if (!linha) {
            console.warn(`Linha ${idLinha} não encontrada na memória (Criando para teste)`);
            estadoLinhas[idLinha] = { id: idLinha, status: 'livre', dono: null };
            linha = estadoLinhas[idLinha];
        }

        if (linha && linha.status === 'livre') {
            linha.status = 'ocupada';
            linha.dono = idJogador;

            console.log(`Linha ${idLinha} dominada por ${idJogador}`);
            return true; 
        }

        console.log("Jogada inválida ou linha ocupada");
        return false; 
    }
