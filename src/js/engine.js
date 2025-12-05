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

        // carrega os modos de tempo
        let modosDeTempo = [];
        $xml.find('modo-tempo').each(function(){
            modosDeTempo.push({
                nome: $(this).attr('nome'),
                tempo: parseInt($(this).attr('tempo'))
            });
        });

        // Define o padrão se existir, ou o primeiro da lista
        let modoPadrao = modosDeTempo.find(m => m.nome === "Normal") || modosDeTempo[0];
        tempoPorTurno = modoPadrao.tempo;
        
        // Envia a lista para a View criar o dropdown
        if(typeof GameView !== 'undefined' && typeof GameView.renderizarSeletorTempo === 'function'){
            GameView.renderizarSeletorTempo(modosDeTempo, tempoPorTurno);
        }

        inicializarLinhas(xmlDoc);

        //Chamando os jogadores
        carregarJogadores(xmlDoc);

        // Extraindo atributos
        this.dadosDoJogo = {
            titulo: $xml.find('titulo').text(),
            linhas: parseInt($tabuleiro.attr('linhas')),
            colunas: parseInt($tabuleiro.attr('colunas'))
        };      
        
        totalQuadradosPossiveis = (this.dadosDoJogo.linhas - 1) * (this.dadosDoJogo.colunas - 1);
        quadradosFechados = 0;
        console.log(`Total de quadrados possíveis: ${totalQuadradosPossiveis}`);

        if(typeof GameView !== 'undefined'){
            GameView.renderizarTabuleiro(this.dadosDoJogo);

            if (typeof GameView.atualizarInterface === 'function'){
                GameView.atualizarInterface();
            }
        }

        iniciarCronometro();
    },    
    
    /**
     * Processando a jogada 
     */
    processarJogada: function(idLinha, idJogador) {
        console.log(`Game Engine recebeu jogada na linha ${idLinha}`);

        // Descobre quem é o jogador atual dinamicamente
        let jogadorAtual = obterJogadorAtual();
        let idDoJogador = jogadorAtual ? jogadorAtual.id : 'P1';

        let jogadaValida = processarJogada(idLinha, idDoJogador);

        // --- CÓDIGO NOVO: Se a jogada foi válida, reinicia o timer ---
        // (Seja porque trocou o turno OU porque o jogador joga novamente)
        if (jogadaValida && quadradosFechados !== totalQuadradosPossiveis) {
            iniciarCronometro();
        }
        
        return jogadaValida;
    },

    reiniciar: function() {
        console.log("Reiniciando jogo...");
        
        pararCronometro();
        estadoLinhas = {}; 
        estadoQuadrados = {};     
        quadradosFechados = 0;

        jogadoresMemoria.forEach(j => j.pontos = 0);

        if (typeof GameView !== 'undefined' && $("#alerta-fim").length > 0) {
            $("#alerta-fim").remove();
        }

        this.iniciar();
    },
    obterJogadores: function() {
        return jogadoresMemoria;
    },
    jogoTerminado: function() {
        return quadradosFechados === totalQuadradosPossiveis;
    }
};


var estadoLinhas = {};
var jogadoresMemoria = [];
var intervaloTimer = null;
var tempoPorTurno = 30;
var tempoRestante = 0;

/**
 * Inicializa o estado das linhas do tabuleiro com base na configuração do XML.
 * @param {*} xmlDoc - Documento XML contendo a configuração do jogo. 
 */
function inicializarLinhas(xmlDoc) {
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

var estadoQuadrados = {};
var totalQuadradosPossiveis = 0;
var quadradosFechados = 0;

/**
 * Processa uma jogada feita por um jogador.
 * 
 * @param {*} idLinha linha selecionada.
 * @param {*} idJogador jogador que fez a jogada.
 * @returns {boolean} true se a jogada for válida, false caso contrário.
 */
function processarJogada(idLinha, idJogador) {
    let linha = estadoLinhas[idLinha];

    // Se a linha não existe na memória, cria ela na hora (segurança)
    if (!linha) {
        console.warn(`Linha ${idLinha} não encontrada na memória (Criando para teste)`);
        estadoLinhas[idLinha] = { id: idLinha, status: 'livre', dono: null };
        linha = estadoLinhas[idLinha];
    }

    if (linha && linha.status === 'livre') {
        linha.status = 'ocupada';
        linha.dono = idJogador;
        console.log(`Linha ${idLinha} dominada por ${idJogador}`);

        let pontos = verificarQuadradosFechados(idLinha, idJogador);

        if (pontos > 0) {
            console.log(`Jogador ${idJogador} fechou ${pontos} quadrado(s)! Joga de novo.`);
        } else {
            alternarTurno(); 
        }

        if (typeof GameView !== 'undefined' && typeof GameView.atualizarInterface === 'function') {
            GameView.atualizarInterface();
        } else {
            console.error("ERRO: GameView ou atualizarInterface não encontrados!");
        }

        return true; // Jogada válida
    }

    console.log("Jogada inválida ou linha ocupada");
    return false; // Jogada inválida
}

/**
 * Função chamada quando o jogo inicia.
 * Lê o XML e preenche a variável jogadoresMemoria.
 */
function carregarJogadores(xmlDoc) {
    jogadoresMemoria = [];

    $(xmlDoc).find('jogador').each(function() {
        var jogador = {
            id: $(this).attr('id'),
            nome: $(this).attr('nome'),
            cor: $(this).attr('cor'),
            atual: $(this).attr('atual') == "true",
            pontos: parseInt($(this).attr('pontos'))
        };
        jogadoresMemoria.push(jogador);
    });

    console.log("Jogadores carregados na memória:", jogadoresMemoria);
    jogadoresMemoria.forEach(j => {
        if (!j.pontos && j.pontos !== 0) j.pontos = 0;
    });
}

/**
 * Função para retornar que é o jogador da vez atual.
 */
function obterJogadorAtual() {
    return jogadoresMemoria.find(j => j.atual === true);
}

/**
 * Função para trocar o turno.
 * Deve ser chamada quando o jogador faz uma jogada e não fecha o quadrado.
 */
function alternarTurno() {
    var indexAtual = jogadoresMemoria.findIndex(i => i.atual === true);
    
    if (indexAtual !== -1) {
        jogadoresMemoria[indexAtual].atual = false;
        var proximoIndex = (indexAtual + 1) % jogadoresMemoria.length;
        jogadoresMemoria[proximoIndex].atual = true;

        console.log("Turno alternado. Vez de:", jogadoresMemoria[proximoIndex].nome);
    }
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
        
        quadradosFechados++;  // ADICIONADO: conta quadrado fechado

        // Atualiza pontuação do jogador
        const jogador = jogadoresMemoria.find(j => j.id === idJogador);
        if (jogador) {
            jogador.pontos++;
        }

        if (typeof GameView !== 'undefined') {
            GameView.pintarQuadrado(idQuad, idJogador);
        }

        // ADICIONADO: Verifica se o jogo acabou
        if (quadradosFechados === totalQuadradosPossiveis) {
            setTimeout(() => {
                const p1 = jogadoresMemoria[0];
                const p2 = jogadoresMemoria[1];
                let vencedor = p1.pontos > p2.pontos ? p1.nome : p2.nome;
                let placarVencedor = Math.max(p1.pontos, p2.pontos);

                if (p1.pontos === p2.pontos) {
                    vencedor = "Empate";
                    placarVencedor = p1.pontos;
                }

                if (typeof GameView !== 'undefined' && GameView.exibirFimDeJogo) {
                    GameView.exibirFimDeJogo(vencedor, placarVencedor);
                }
            }, 300);
        }

        return true;
    }
    return false;
}

function isOcupada(id) {
    return estadoLinhas[id] && estadoLinhas[id].status === 'ocupada';
}

function iniciarCronometro() {
    pararCronometro(); // Limpa timer anterior para não encavalar
    
    if (tempoPorTurno === 0) {
        console.log("Modo Paciência: Sem cronômetro.");
        if (typeof GameView !== 'undefined') {
            GameView.atualizarTempo("∞");
        }
        return;
    }

    tempoRestante = tempoPorTurno;
    console.log(`Cronômetro iniciado: ${tempoRestante}s`);

    // Atualiza visualmente imediatamente (opcional, se tiver suporte na View)
    if (typeof GameView !== 'undefined' && typeof GameView.atualizarTempo === 'function') {
        GameView.atualizarTempo(tempoRestante);
    }

    intervaloTimer = setInterval(function() {
        tempoRestante--;

        // Atualiza a View se existir
        if (typeof GameView !== 'undefined' && typeof GameView.atualizarTempo === 'function') {
            GameView.atualizarTempo(tempoRestante);
        }

        if (tempoRestante <= 0) {
            pararCronometro();
            console.log("Tempo esgotado! Trocando turno...");
            alert("Tempo esgotado! Passando a vez.");

            alternarTurno();
            iniciarCronometro(); // Reinicia o tempo para o próximo jogador

            if (typeof GameView !== 'undefined' && typeof GameView.atualizarInterface === 'function') {
                GameView.atualizarInterface();
            }
        }
    }, 1000);
}

function pararCronometro() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
    }
}

function mudarConfiguracaoTempo(novoTempo) {
    console.log(`Mudando tempo para: ${novoTempo}s`);
    tempoPorTurno = parseInt(novoTempo);

    iniciarCronometro();
}