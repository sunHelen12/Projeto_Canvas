const GameView = {
    renderizarTabuleiro:function(dados){
        console.log("Renderizando Visualização...");

        // Atualizando o título da página
        $("#game-title").text(dados.titulo);

        const $board = $("#tabuleiro-visual");
        // Limpando tudo antes de desenhar
        $board.empty();

        //Loop para criar o Grid 
        for(let i = 0; i < dados.linhas; i++){
            // Criando uma linha container - Bootstrap
            let $rowDiv = $("<div>").addClass("d-flex justify-content-center");

            for(let j = 0; j < dados.colunas; j++){
                // Criando ponto
                let $ponto = $("<div>")
                    .addClass("ponto")
                    // Guardando as coordenadas
                    .attr("data-coord", `${i}-${j}`);
                
                $rowDiv.append($ponto);

                // Adicionando um espaço entre os pontos para adição da linha
                if(j < dados.colunas - 1){
                    $rowDiv.append($("<div>").addClass("espaco-horizontal"));
                }
            }

            $board.append($rowDiv);

            // Espaço vertical entre as linhas e pontos
            if(i < dados.linhas - 1){
                $board.append($("<div>").addClass("espaco-vertical-row"));                
            }
        }
    }
};