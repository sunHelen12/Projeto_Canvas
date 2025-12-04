const GameEngine = {
    // Memória interna - Estado do Jogo
    dadosDoJogo:{},

    /**
     * Função de inicialização 
     *  
     */ 
    iniciar: function(){
        console.log("Motor ligado...")

        // Fazendo requisição HTTP
        $.get("../data/game-config.xml")
            .done((xml) =>{
                console.log("XML Recebido!");
                this.processarDados(xml);
            })
            .fail(() => {
                alert("Erro ao carregar XML!")
            });
    },

    // Jogando o XML para a memória JS
    processarDados: function(xmlDoc){
        console.log("Processando dados...");
        // Navegando com o JQuery no XML
        const $xml = $(xmlDoc);
        const $tabuleiro = $xml.find("tabuleiro");

        // Chamando Função inicializarLinhas
        inicializarLinhas(xmlDoc);

        // Extraindo atributos
        this.dadosDoJogo = {
            titulo: $xml.find('titulo').text(),
            linhas: parseInt($tabuleiro.attr('linhas')),
            colunas: parseInt($tabuleiro.attr('colunas'))
        };       

        // Chamando Visualização
        if(typeof GameView !== 'undefined'){
            GameView.renderizarTabuleiro(this.dadosDoJogo);
        }
    },    
    
    /**
     * Processando a jogada 
     */

    processarJogada: function(idLinha, idJogador) {
        console.log(`Game Engine recebeu jogada na linha ${idLinha}`);
        // Chamando Função processarJogada
        return processarJogada(idLinha, idJogador);
    },

    reiniciar: function() {
        console.log("Reiniciando jogo...");
        
        // 1. Zera a memória global das linhas para remover os donos
        estadoLinhas = {}; 

        // 2. Chama o iniciar novamente para recarregar o XML e redesenhar o tabuleiro
        this.iniciar();
    },
};


var estadoLinhas = {};

    /**
     * Inicializa o estado das linhas do tabuleiro com base na configuração do XML.
     * @param {*} xmlDoc - Documento XML contendo a configuração do jogo. 
     */
    function inicializarLinhas(xmlDoc) {
        // Extrai o número de linhas e colunas do tabuleiro a partir do XML
        let $tabuleiro = $(xmlDoc).find('tabuleiro');
        let numLinhas = parseInt($tabuleiro.attr('linhas'));
        let numColunas = parseInt($tabuleiro.attr('colunas'));

        // Inicializa o estado das linhas horizontais (H)
        for (let l = 0; l < numLinhas; l++) {
            for (let c = 0; c < numColunas - 1; c++) {
                let id = `h-${l}-${c}`;
                estadoLinhas[id] = { id: id, status: 'livre', dono: null };
            }
        }

        // Inicializa o estado das linhas verticais (V)
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

        // Se a linha não existe na memória, cria ela na hora
        if (!linha) {
            console.warn(`Linha ${idLinha} não encontrada na memória (Criando para teste)`);
            estadoLinhas[idLinha] = { id: idLinha, status: 'livre', dono: null };
            linha = estadoLinhas[idLinha];
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

    var estadoQuadrados = {}; 

    /**
     * Processa a jogada e verifica se fechou quadrado
     */
    function processarJogada(idLinha, idJogador) {
        let linha = estadoLinhas[idLinha];

        if (!linha) {
            estadoLinhas[idLinha] = { id: idLinha, status: 'livre', dono: null };
            linha = estadoLinhas[idLinha];
        }

        if (linha.status === 'livre') {
            linha.status = 'ocupada';
            linha.dono = idJogador;
            console.log(`Linha ${idLinha} dominada por ${idJogador}`);

            let pontos = verificarQuadradosFechados(idLinha, idJogador);
            
            if (pontos > 0) {
                console.log(`Jogador ${idJogador} fechou ${pontos} quadrado(s)!`);
            }
            
            return true; 
        }
        return false; 
    }

    /**
     * Verifica os vizinhos da linha recém clicada
     */
    function verificarQuadradosFechados(idLinha, idJogador) {
        let partes = idLinha.split('-'); // ex: h-0-0
        let tipo = partes[0];
        let l = parseInt(partes[1]);
        let c = parseInt(partes[2]);

        let totalFechados = 0;

        if (tipo === 'h') {
            if (checarQuadrado(l, c, idJogador)) totalFechados++;
            if (checarQuadrado(l - 1, c, idJogador)) totalFechados++;
        } 
        else if (tipo === 'v') {
            if (checarQuadrado(l, c, idJogador)) totalFechados++;
            if (checarQuadrado(l, c - 1, idJogador)) totalFechados++;
        }

        return totalFechados;
    }

    /**
     * Verifica se as 4 arestas do quadrado [l, c] estão ocupadas
     */
    function checarQuadrado(l, c, idJogador) {
        let idQuad = `q-${l}-${c}`;
        
        if (estadoQuadrados[idQuad]) return false;

        let topo    = `h-${l}-${c}`;
        let baixo   = `h-${l+1}-${c}`;
        let esq     = `v-${l}-${c}`;
        let dir     = `v-${l}-${c+1}`;

        if (isOcupada(topo) && isOcupada(baixo) && isOcupada(esq) && isOcupada(dir)) {
            
            estadoQuadrados[idQuad] = idJogador;
            
            if (typeof GameView !== 'undefined') {
                GameView.pintarQuadrado(idQuad, idJogador);
            }
            return true; 
        }
        return false;
    }

    function isOcupada(id) {
        return estadoLinhas[id] && estadoLinhas[id].status === 'ocupada';
    }