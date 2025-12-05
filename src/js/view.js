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
                    // Cria a Linha Vertical
                    let $linhaV = $("<div>")
                        .addClass("espaco-vertical linha-jogo")
                        .attr("id", `v-${i}-${j}`);               //  id (ex: v-0-0)
                    
                    $verticalRow.append($linhaV);

                    // Adiciona um espaçador entre as linhas verticais para alinhar com os pontos
                    if (j < dados.colunas - 1) {
                        $verticalRow.append($("<div>").addClass("espaco-invisivel")); 
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

            let jogador = null;
            if (typeof obterJogadorAtual === 'function') {
                jogador = obterJogadorAtual();
            }

            // Integração com o Motor
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

    atualizarInterface: function() {
        if (typeof obterJogadorAtual === 'function') {
            var jogadorAtual = obterJogadorAtual();

            if (jogadorAtual) {
                var $elemento = $('#jogador-atual');
                
                $elemento.text(jogadorAtual.nome);
                
                $elemento.removeClass('bg-secondary bg-primary bg-danger');
                $elemento.css('background-color', jogadorAtual.cor);
                
                console.log("Interface atualizada: Vez de " + jogadorAtual.nome);
            }
        }
    }
};