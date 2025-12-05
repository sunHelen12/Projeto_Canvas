$(document).ready(function () {
    console.log("Inicializando Aplicação...");

    if (typeof GameView.criarBotaoReiniciar === 'function') {
        GameView.criarBotaoReiniciar();
    }

    GameEngine.iniciar();
});