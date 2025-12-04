const GameView = {
    renderizarTabuleiro: function(dados) {
        console.log("Renderizando Visualização...");
        $("#game-title").text(dados.titulo);
        const $board = $("#tabuleiro-visual");
        $board.empty();

        // Loop principal (Linhas)
        for (let i = 0; i < dados.linhas; i++) {
            
            // Linha de Pontos e Arestas Horizontais
            let $rowDiv = $("<div>").addClass("d-flex justify-content-center align-items-center");

            for (let j = 0; j < dados.colunas; j++) {
                // Cria o Ponto
                let $ponto = $("<div>").addClass("ponto").attr("data-coord", `${i}-${j}`);
                $rowDiv.append($ponto);

                // Cria a Linha Horizontal (se não for a última coluna)
                if (j < dados.colunas - 1) {
                    let $linhaH = $("<div>")
                        .addClass("espaco-horizontal linha-jogo") // ADICIONADO: classe linha-jogo
                        .attr("id", `h-${i}-${j}`);               // ADICIONADO: ID para o motor achar (ex: h-0-0)
                    
                    $rowDiv.append($linhaH);
                }
            }
            $board.append($rowDiv);

            // Linha de Arestas Verticais
            // Se não for a última linha de pontos, cria as conexões verticais abaixo
            if (i < dados.linhas - 1) {
                let $verticalRow = $("<div>").addClass("d-flex justify-content-center");
                
                for (let j = 0; j < dados.colunas; j++) {
                    let $linhaV = $("<div>")
                        .addClass("espaco-vertical linha-jogo")
                        .attr("id", `v-${i}-${j}`);

                    $verticalRow.append($linhaV);

                    if (j < dados.colunas - 1) {
                        let $quadrado = $("<div>")
                            .addClass("espaco-invisivel")
                            .attr("id", `q-${i}-${j}`); 
                        $verticalRow.append($quadrado); 
                    }
                }
                $board.append($verticalRow);
            }
        }
        
        // Ativar os cliques logo após desenhar o tabuleiro
        this.configurarCliques();
    },

    configurarCliques: function() {
        // Remove listeners antigos para evitar duplicidade
        $(document).off('click', '.linha-jogo');

        $(document).on('click', '.linha-jogo', function() {
            let idClicado = $(this).attr('id');
            console.log("Clique detectado em:", idClicado);

            // Integração com o Motor
            let jogadaValida = false;
            if (typeof GameEngine !== 'undefined' && GameEngine.processarJogada) {
                jogadaValida = GameEngine.processarJogada(idClicado, 'P1');
            } else if (typeof processarJogada === 'function') {
                // Fallback se a função estiver global
                jogadaValida = processarJogada(idClicado, 'P1');
            }

            if (jogadaValida) {
                $(this).addClass('ocupada-p1'); // Muda a cor
            } else {
                console.log("Jogada inválida ou linha já ocupada.");
            }
        });
    },

    pintarQuadrado: function(idQuadrado, idJogador) {
        console.log(`Pintando ${idQuadrado} para ${idJogador}`);
        $(`#${idQuadrado}`).removeClass('quadrado-p1 quadrado-p2').addClass(idJogador === 'P1' ? 'quadrado-p1' : 'quadrado-p2');
    },

    criarBotaoReiniciar: function() {
        if ($("#btn-reiniciar").length > 0) return;

        const $btn = $("<button>")
            .attr("id", "btn-reiniciar")
            .addClass("btn btn-primary m-2") 
            .text("Reiniciar Jogo")
            .css({
                "display": "block",
                "width": "100%",
                "height": "50px",
                "font-size": "1.2rem",
                "font-weight": "bold",
                "margin": "20px auto",
                "padding": "10px 20px",
                "cursor": "pointer"
            });

        $btn.on("click", function() {
            if (typeof GameEngine !== 'undefined') {
                GameEngine.reiniciar();
            }
        });

        $("#tabuleiro-visual").after($btn);
    }
};