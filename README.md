# 🕹️ Jogo dos Pontinhos (Dots and Boxes) - Projeto Canvas

> "Conectando pontos, fechando caixas e processando dados."

![Project Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![IFBA](https://img.shields.io/badge/Instituição-IFBA-green)

## 📖 Sobre o Projeto

Este projeto consiste no desenvolvimento de uma aplicação Web *client-side* que simula o clássico **Jogo dos Pontinhos**. O objetivo principal não é apenas o jogo em si, mas a implementação de uma arquitetura baseada em dados, onde um arquivo **XML** descreve as regras, o estado e os componentes visuais do jogo.

O sistema opera seguindo um fluxo: o **Motor (Engine)** consome o XML, processa a estrutura em memória e a **Visualização** renderiza o estado atual no navegador utilizando manipulação de DOM.

Este trabalho é um requisito avaliativo da disciplina **Programação Web I**, ministrada pelo professor **Bruno Costa**, no **Instituto Federal da Bahia (IFBA) - Campus Vitória da Conquista**.

## 🚀 Arquitetura e Funcionalidades

O projeto segue estritamente a arquitetura solicitada, dividindo responsabilidades:

1.  **Data Layer (XML):** Configuração inicial do tabuleiro, jogadores e regras.
2.  **Engine (JavaScript):** O "cérebro" que faz o *parsing* do XML, gerencia a lógica do jogo e mantém o estado em memória.
3.  **Presentation Layer (View):** Interface reativa que traduz o estado da memória para elementos visuais na tela.

### Funcionalidades Planejadas:
* [ ] Carregamento dinâmico de configurações via XML.
* [ ] Tabuleiro interativo renderizado via JavaScript/jQuery.
* [ ] Sistema de turnos e pontuação.
* [ ] Detecção automática de fechamento de quadrados (lógica de grafos/matriz).
* [ ] Design responsivo.

## 🛠️ Tech Stack (Tecnologias)

A stack foi escolhida para garantir robustez na manipulação do DOM e estilização ágil:

* **Linguagem Core:** ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)
* **Dados:** ![XML](https://img.shields.io/badge/-XML-orange)
* **Biblioteca JS:** ![jQuery](https://img.shields.io/badge/-jQuery-0769AD?logo=jquery&logoColor=white)
* **Estilização:** ![Bootstrap](https://img.shields.io/badge/-Bootstrap-563D7C?logo=bootstrap&logoColor=white) e CSS3.
* **Estrutura:** HTML5 Semântico.

## 👥 O Squad (Equipe)

Desenvolvido pelos alunos do Bacharelado em Sistemas de Informação:

* **Gabryelle**
* **Helen** 
* **Kaique**
* **Maria Eduarda**
* **Thiago**
* **Venan**

## 📦 Como Rodar Localmente

Como o projeto faz requisições HTTP para ler o arquivo XML (simulando uma API/banco de dados), **ele não funcionará abrindo o `index.html` diretamente** devido a políticas de segurança dos navegadores (CORS).

Siga os passos:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/sunHelen12/Projeto_Canvas.git
    ```
2.  **Acesse a pasta:**
    ```bash
    cd Projeto_Canvas
    ```
3.  **Rode um servidor local:**
    * Se usar **VS Code**: Instale a extensão "Live Server" e clique em "Go Live".  
    
    * Ou via **Node.js**:
        ```bash
        npx http-server
        ```
4.  Acesse `localhost` na porta indicada no seu navegador.

---
*Feito com 💙 e muito café.*

