/**
 * Objeto responsável pela visualização do jogo.
 */
const GameView = {
    /**
     * Renderiza o tabuleiro do jogo com base nos dados fornecidos.
     * 
     * @param {*} dados Objeto contendo as configurações do tabuleiro.
     */
    renderizarTabuleiro: function(dados) {
        console.log("Renderizando Visualização...");

        this.criarDisplayTempo();

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

     /**
      * Configura os eventos de clique nas linhas do tabuleiro.
      */
    configurarCliques: function() {
        $(document).off('click', '.linha-jogo');

        $(document).on('click', '.linha-jogo', function() {
            let idClicado = $(this).attr('id');
            console.log("Clique detectado em:", idClicado);

            let jogador = null;
            if (typeof obterJogadorAtual === 'function') {
                jogador = obterJogadorAtual();
            }

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
     * Pinta o quadrado com a cor do jogador que o fechou.
     * 
     * @param {*} idQuadrado id do quadrado.
     * @param {*} idJogador id do jogador que fechou o quadrado.
     */
    pintarQuadrado: function(idQuadrado, idJogador) {
        console.log(`Pintando ${idQuadrado} para ${idJogador}`);

        if (typeof GameView.atualizarPlacar === 'function') {
            GameView.atualizarPlacar();
        }  

        $(`#${idQuadrado}`).removeClass('quadrado-p1 quadrado-p2').addClass(idJogador === '1' ? 'quadrado-p1' : 'quadrado-p2');
    },

    /**
     * Cria o botão de reiniciar o jogo.
     */
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

        /**
         * Evento de clique para reiniciar o jogo.
         */
        $btn.on("click", function() {
            
            if ($("#alerta-fim").length > 0) {
                $("#alerta-fim").remove();
                console.log("Alerta de fim de jogo removido.");
            }

            
            if ($(document).off('click', '.linha-jogo').length === 0) {
                GameView.configurarCliques();
            }

            if (typeof GameEngine !== 'undefined') {
                GameEngine.reiniciar();
            }

            /**
             * Delay para garantir que a interface seja atualizada após o reinício.
             */
            setTimeout(() => {
                if (typeof GameView.atualizarInterface === 'function') {
                    GameView.atualizarInterface();
                }
                if (typeof GameView.atualizarPlacar === 'function') {
                    GameView.atualizarPlacar();
                }
            }, 500);
        });

        $("#tabuleiro-visual").after($btn);
    },

    /**
     * Atualiza o placar exibido na interface.
     */
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

    /**
     * Exibe a mensagem de fim de jogo.
     * 
     * @param {*} vencedor id do jogador vencedor ou "Empate".
     * @param {*} placar placar final do jogo.
     */
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
    },

    /**
     * Cria o display do cronômetro.
     */
    criarDisplayTempo: function() {
        if ($("#cronometro-display").length === 0) {
            
            const $containerTempo = $("<div>")
                .attr("id", "cronometro-container")
                .addClass("text-center mb-2 mt-2");

            const $badgeTempo = $("<span>")
                .attr("id", "cronometro-display")
                .addClass("badge bg-dark fs-4")
                .css("min-width", "120px")  
                .text("00s");

            $containerTempo.append($badgeTempo);

            $("#tabuleiro-visual").before($containerTempo);
        }
    },

    /**
     * Atualiza o display do cronômetro com o tempo restante.
     * 
     * @param {*} segundos segundos restantes ou string para exibir mensagem.
     */
    atualizarTempo: function(segundos) {
        const $display = $("#cronometro-display");

        if (typeof segundos === 'string') {
             $display.text(`⏱ ${segundos}`);
             $display.removeClass("bg-danger bg-warning").addClass("bg-success");
             return;
        }
        
        $display.text(`⏱ ${segundos}s`);

        $display.removeClass("bg-success bg-warning bg-danger bg-dark");

        if (segundos <= 5) {
            $display.addClass("bg-danger");
        } else if (segundos <= 10) {
            $display.addClass("bg-warning text-dark");
        } else {
            $display.addClass("bg-success");
        }
    },

    /**
     * Renderiza o seletor de modos de tempo.
     * 
     * @param {*} modos modos de tempo disponíveis.
     * @param {*} tempoInicial tempo inicial selecionado.
     */
    renderizarSeletorTempo: function(modos, tempoInicial) {
        $("#container-seletor-tempo").remove();

        const $container = $("<div>")
            .attr("id", "container-seletor-tempo")
            .addClass("d-flex justify-content-center align-items-center mb-3 gap-2");

        const $label = $("<label>").text("Modo de Tempo: ").addClass("fw-bold");
        
        const $select = $("<select>").addClass("form-select w-auto");

        modos.forEach(modo => {
            let $option = $("<option>")
                .val(modo.tempo)
                .text(`${modo.nome} (${modo.tempo === 0 ? '∞' : modo.tempo + 's'})`);
            
            if (modo.tempo === tempoInicial) {
                $option.attr("selected", true);
            }
            $select.append($option);
        });

        $select.on("change", function() {
            let novoTempo = $(this).val();
            
            if (typeof mudarConfiguracaoTempo === 'function') {
                mudarConfiguracaoTempo(novoTempo);
            }
        });

        $container.append($label, $select);

        if ($("#cronometro-container").length > 0) {
            $("#cronometro-container").before($container);
        } else {
            $("#tabuleiro-visual").before($container);
        }
    },
};