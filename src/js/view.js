const GameView = {
    renderizarTabuleiro: function(dados) {
        console.log("Renderizando Visualização...");
        $("#game-title").text(dados.titulo);
        const $board = $("#tabuleiro-visual");
        $board.empty();

        for (let i = 0; i < dados.linhas; i++) {
            
            let $rowDiv = $("<div>").addClass("d-flex justify-content-center align-items-center");

            for (let j = 0; j < dados.colunas; j++) {
                let $ponto = $("<div>").addClass("ponto").attr("data-coord", `${i}-${j}`);
                $rowDiv.append($ponto);

                if (j < dados.colunas - 1) {
                    let $linhaH = $("<div>")
                        .addClass("espaco-horizontal linha-jogo") 
                        .attr("id", `h-${i}-${j}`);              
                    
                    $rowDiv.append($linhaH);
                }
            }
            $board.append($rowDiv);

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
        
        this.configurarCliques();
    },

    configurarCliques: function() {
        $(document).off('click', '.linha-jogo');

        $(document).on('click', '.linha-jogo', function() {
            let idClicado = $(this).attr('id');
            console.log("Clique detectado em:", idClicado);

            // Identificar quem está clicando
            let jogador = null;
            if (typeof obterJogadorAtual === 'function') {
                jogador = obterJogadorAtual();
            }

            // Integração com o motor
            let jogadaValida = false;
            if (typeof GameEngine !== 'undefined' && GameEngine.processarJogada) {
                jogadaValida = GameEngine.processarJogada(idClicado);
            }

            if (jogadaValida) {
                $(this).addClass('ocupada'); 

                if (jogador) {
                    this.style.setProperty('background-color', jogador.cor, 'important');
                    this.style.setProperty('opacity', '1', 'important');
                }
            } else {
                console.log("Jogada inválida ou linha já ocupada.");
            }
        });
    },

    /**
     * Atualiza o badge com o nome do jogador da vez
     */
    atualizarInterface: function() {
        if (typeof obterJogadorAtual === 'function') {
            var jogadorAtual = obterJogadorAtual();

            if (jogadorAtual) {
                var $elemento = $('#jogador-atual');
                
                $elemento.text(jogadorAtual.nome);
                
                $elemento.removeClass('bg-secondary bg-primary bg-danger');
                $elemento.css('background-color', jogadorAtual.cor);
                
                console.log("Interface atualizada: Vez de " + jogadorAtual.nome);

                if (typeof GameView.atualizarPlacar === 'function') {
                    GameView.atualizarPlacar();
                }
            }
        }
    },

    /**
     * Pinta o interior do quadrado
     */
    pintarQuadrado: function(idQuadrado, idJogador) {
        console.log(`Pintando ${idQuadrado} para ${idJogador}`);

        if (typeof GameView.atualizarPlacar === 'function') {
            GameView.atualizarPlacar();
        }  

        $(`#${idQuadrado}`).removeClass('quadrado-p1 quadrado-p2').addClass(idJogador === '1' ? 'quadrado-p1' : 'quadrado-p2');
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
    },

   atualizarPlacar: function() {
        
        if (typeof GameEngine !== 'undefined' && typeof GameEngine.obterJogadores === 'function') {
            const jogadores = GameEngine.obterJogadores();
            if (jogadores && jogadores.length >= 2) {
                const p1 = jogadores[0];
                const p2 = jogadores[1];
                const texto = `${p1.nome}: ${p1.pontos} × ${p2.nome}: ${p2.pontos}`;
                $("#placar-texto").text(texto);
            }
        }
    },

    
    exibirFimDeJogo: function(vencedor, placar) {
        const mensagem = vencedor === "Empate" 
            ? `Fim de jogo! Empate com ${placar} pontos cada!`
            : `Fim de jogo! Vitória de <strong>${vencedor}</strong> com ${placar} pontos!`;

        $(document).off('click', '.linha-jogo');

        if ($("#alerta-fim").length === 0) {
            const alerta = `
                <div id="alerta-fim" class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <strong>${mensagem}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            $("#tabuleiro-visual").before(alerta);
        }

        
        if (typeof GameView.atualizarPlacar === 'function') {
            GameView.atualizarPlacar();
        }
    }
};