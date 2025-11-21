// Elementos do DOM
const tabuleiro = document.querySelector(".tabuleiro");
const botaoJogar = document.getElementById("jogar");
const jogadorAtualSpan = document.getElementById("jogador-atual");
const perguntaSection = document.getElementById("pergunta-section");
const numeroCasas = 50;

// Adiciona botão para reiniciar o jogo
const botaoReiniciar = document.createElement("button");
botaoReiniciar.textContent = "Reiniciar Jogo";
botaoReiniciar.style.position = "absolute";
botaoReiniciar.style.top = "10px";
botaoReiniciar.style.right = "10px";
botaoReiniciar.style.padding = "10px";
botaoReiniciar.style.backgroundColor = "#ff6347";
botaoReiniciar.style.color = "white";
botaoReiniciar.style.border = "none";
botaoReiniciar.style.borderRadius = "5px";
botaoReiniciar.style.cursor = "pointer";

botaoReiniciar.addEventListener("click", () => {
    if (confirm("Tem certeza de que deseja reiniciar o jogo? Todo progresso será perdido.")) {
        localStorage.clear();
        window.location.href = "https://wes-silva2003.github.io/Projeto_Desafio-da-Sabedoria/";
    }
});

document.body.appendChild(botaoReiniciar);

// Recupera dados do localStorage
let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
let posicoes = JSON.parse(localStorage.getItem("posicoes")) || Array(jogadores.length).fill(0);
let jogadorAtual = parseInt(localStorage.getItem("jogadorAtual")) || 0; // Jogador atual
let perguntasUsadas = JSON.parse(localStorage.getItem("perguntasUsadas")) || []; // Perguntas já usadas
let rodadaPronta = false;

// Definindo as cores para os jogadores
const coresJogadores = ['#ff6347', '#32cd32', '#1e90ff', '#ff1493']; // Vermelho, verde, azul, rosa

// Perguntas por nível
const perguntas = {
    verde: [
        { pergunta: "Quanto é 2 + 2?", respostaCorreta: "4", alternativas: ["3", "4", "5", "6"] },
        { pergunta: "Qual é a capital da França?", respostaCorreta: "Paris", alternativas: ["Paris", "Londres", "Roma", "Berlim"] },
        { pergunta: "Qual é o maior planeta do sistema solar?", respostaCorreta: "Júpiter", alternativas: ["Terra", "Marte", "Júpiter", "Saturno"] },
        { pergunta: "Qual é o animal conhecido como 'Rei da Selva'?", respostaCorreta: "Leão", alternativas: ["Tigre", "Leão", "Elefante", "Gorila"] },
        { pergunta: "Quantos dias há em um ano bissexto?", respostaCorreta: "366", alternativas: ["364", "365", "366", "367"] },
        { pergunta: "Qual é a cor do céu em um dia claro?", respostaCorreta: "Azul", alternativas: ["Verde", "Azul", "Cinza", "Rosa"] },
        { pergunta: "Qual é a capital do Brasil?", respostaCorreta: "Brasília", alternativas: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"] },
        { pergunta: "Quantos lados tem um quadrado?", respostaCorreta: "4", alternativas: ["3", "4", "5", "6"] },
        { pergunta: "Qual é o maior oceano do mundo?", respostaCorreta: "Oceano Pacífico", alternativas: ["Oceano Atlântico", "Oceano Índico", "Oceano Pacífico", "Oceano Ártico"] },
        { pergunta: "Quantas horas há em um dia?", respostaCorreta: "24", alternativas: ["12", "24", "36", "48"] },
        { pergunta: "Qual é o animal que mia?", respostaCorreta: "Gato", alternativas: ["Cachorro", "Gato", "Pássaro", "Cavalo"] },
        { pergunta: "Quantos segundos há em um minuto?", respostaCorreta: "60", alternativas: ["30", "45", "60", "90"] },
        { pergunta: "Qual é o formato da Terra?", respostaCorreta: "Esférico", alternativas: ["Plano", "Cúbico", "Esférico", "Triangular"] },
        { pergunta: "Qual é a moeda do Brasil?", respostaCorreta: "Real", alternativas: ["Dólar", "Euro", "Real", "Peso"] },
        { pergunta: "Quantos continentes existem no mundo?", respostaCorreta: "7", alternativas: ["5", "6", "7", "8"] },
        { pergunta: "Qual é a estação mais fria do ano?", respostaCorreta: "Inverno", alternativas: ["Primavera", "Verão", "Outono", "Inverno"] },
        { pergunta: "Qual é a língua oficial do Brasil?", respostaCorreta: "Português", alternativas: ["Inglês", "Espanhol", "Português", "Francês"] },
        { pergunta: "Quantos meses há em um ano?", respostaCorreta: "12", alternativas: ["10", "11", "12", "13"] },
        { pergunta: "Qual é o menor país do mundo?", respostaCorreta: "Vaticano", alternativas: ["Mônaco", "Vaticano", "San Marino", "Malta"] },
        { pergunta: "Qual é o nome do nosso satélite natural?", respostaCorreta: "Lua", alternativas: ["Sol", "Estrela", "Lua", "Cometa"] },
        { pergunta: "Qual é o nome do maior deserto do mundo?", respostaCorreta: "Saara", alternativas: ["Gobi", "Saara", "Atacama", "Kalahari"] },
        { pergunta: "Qual é o maior mamífero do mundo?", respostaCorreta: "Baleia Azul", alternativas: ["Elefante", "Baleia Azul", "Girafa", "Rinoceronte"] },
        { pergunta: "Qual é a unidade básica de vida?", respostaCorreta: "Célula", alternativas: ["Átomo", "Molécula", "Célula", "Organismo"] },
        { pergunta: "Qual é o gás que respiramos?", respostaCorreta: "Oxigênio", alternativas: ["Hidrogênio", "Oxigênio", "Nitrogênio", "Dióxido de Carbono"] },
        { pergunta: "Qual é a bebida mais consumida no mundo depois da água?", respostaCorreta: "Chá", alternativas: ["Café", "Chá", "Leite", "Refrigerante"] },
        { pergunta: "Qual é o esporte mais popular do mundo?", respostaCorreta: "Futebol", alternativas: ["Basquete", "Futebol", "Ténis", "Vôlei"] },
        { pergunta: "Qual é o maior órgão do corpo humano?", respostaCorreta: "Pele", alternativas: ["Coração", "Pulmão", "Fígado", "Pele"] },
        { pergunta: "Qual é o país que inventou o sushi?", respostaCorreta: "Japão", alternativas: ["China", "Japão", "Coreia", "Tailândia"] },
        { pergunta: "Qual é o nome do primeiro presidente do Brasil?", respostaCorreta: "Deodoro da Fonseca", alternativas: ["Dom Pedro I", "Deodoro da Fonseca", "Floriano Peixoto", "Getúlio Vargas"] },
        { pergunta: "Quantas cores há no arco-íris?", respostaCorreta: "7", alternativas: ["5", "6", "7", "8"] }
    ],
    amarelo: [
        { pergunta: "Quem pintou a Mona Lisa?", respostaCorreta: "Leonardo da Vinci", alternativas: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"] },
        { pergunta: "Qual é o maior país do mundo em área?", respostaCorreta: "Rússia", alternativas: ["China", "Canadá", "Rússia", "Estados Unidos"] },
        { pergunta: "Quantos ossos tem o corpo humano adulto?", respostaCorreta: "206", alternativas: ["200", "206", "210", "215"] },
        { pergunta: "Qual planeta é conhecido como o Planeta Vermelho?", respostaCorreta: "Marte", alternativas: ["Terra", "Marte", "Vênus", "Júpiter"] },
        { pergunta: "Quem escreveu 'Dom Quixote'?", respostaCorreta: "Miguel de Cervantes", alternativas: ["William Shakespeare", "Miguel de Cervantes", "Victor Hugo", "Gabriel García Márquez"] },
        { pergunta: "Quantos continentes há no planeta Terra?", respostaCorreta: "7", alternativas: ["5", "6", "7", "8"] },
        { pergunta: "Qual é o elemento químico representado pela letra 'O'?", respostaCorreta: "Oxigênio", alternativas: ["Ouro", "Oxigênio", "Osmium", "Óxido"] },
        { pergunta: "Quem descobriu o Brasil?", respostaCorreta: "Pedro Álvares Cabral", alternativas: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"] },
        { pergunta: "Em que ano aconteceu a Revolução Francesa?", respostaCorreta: "1789", alternativas: ["1776", "1789", "1799", "1815"] },
        { pergunta: "Qual é a menor unidade da matéria?", respostaCorreta: "Átomo", alternativas: ["Molécula", "Átomo", "Célula", "Partícula"] },
        { pergunta: "Quantos planetas há no sistema solar?", respostaCorreta: "8", alternativas: ["7", "8", "9", "10"] },
        { pergunta: "Qual é o símbolo químico da água?", respostaCorreta: "H2O", alternativas: ["O2", "H2O", "CO2", "H2"] },
        { pergunta: "Quem foi o primeiro presidente dos Estados Unidos?", respostaCorreta: "George Washington", alternativas: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"] },
        { pergunta: "Qual é o ponto mais alto da Terra?", respostaCorreta: "Monte Everest", alternativas: ["Monte Everest", "K2", "Mont Blanc", "Pico da Neblina"] },
        { pergunta: "Qual é a fórmula química do sal de cozinha?", respostaCorreta: "NaCl", alternativas: ["NaCl", "KCl", "CaCO3", "HCl"] },
        { pergunta: "Quem é conhecido como o pai da física moderna?", respostaCorreta: "Albert Einstein", alternativas: ["Isaac Newton", "Galileu Galilei", "Albert Einstein", "Nikola Tesla"] },
        { pergunta: "Qual país é famoso por sua torre inclinada?", respostaCorreta: "Itália", alternativas: ["França", "Itália", "Grécia", "Espanha"] },
        { pergunta: "Quem escreveu a peça 'Romeu e Julieta'?", respostaCorreta: "William Shakespeare", alternativas: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"] },
        { pergunta: "Qual é a capital do Japão?", respostaCorreta: "Tóquio", alternativas: ["Pequim", "Seul", "Tóquio", "Bangkok"] },
        { pergunta: "Qual é o metal mais precioso do mundo?", respostaCorreta: "Ouro", alternativas: ["Prata", "Platina", "Ouro", "Cobre"] },
        { pergunta: "Qual órgão do corpo humano é responsável por bombear sangue?", respostaCorreta: "Coração", alternativas: ["Cérebro", "Fígado", "Coração", "Pulmões"] },
        { pergunta: "Qual é a capital da Argentina?", respostaCorreta: "Buenos Aires", alternativas: ["Santiago", "Buenos Aires", "Montevidéu", "Lima"] },
        { pergunta: "Qual é o maior rio do Brasil?", respostaCorreta: "Rio Amazonas", alternativas: ["Rio São Francisco", "Rio Amazonas", "Rio Paraná", "Rio Tocantins"] },
        { pergunta: "Quem pintou o teto da Capela Sistina?", respostaCorreta: "Michelangelo", alternativas: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"] },
        { pergunta: "Qual é a maior ilha do mundo?", respostaCorreta: "Groenlândia", alternativas: ["Austrália", "Groenlândia", "Madagascar", "Nova Guiné"] },
        { pergunta: "Qual é a unidade de medida de energia?", respostaCorreta: "Joule", alternativas: ["Newton", "Watt", "Joule", "Pascal"] },
        { pergunta: "Quem foi o autor de 'A Origem das Espécies'?", respostaCorreta: "Charles Darwin", alternativas: ["Isaac Newton", "Charles Darwin", "Galileu Galilei", "Aristóteles"] },
        { pergunta: "Em que ano aconteceu a Proclamação da República no Brasil?", respostaCorreta: "1889", alternativas: ["1888", "1889", "1890", "1891"] },
        { pergunta: "Qual planeta é conhecido como o gigante gasoso?", respostaCorreta: "Júpiter", alternativas: ["Saturno", "Júpiter", "Urano", "Netuno"] },
        { pergunta: "Qual é a ciência que estuda os fósseis?", respostaCorreta: "Paleontologia", alternativas: ["Arqueologia", "Paleontologia", "Geologia", "Antropologia"] }
    ],
    vermelho: [
        { pergunta: "Quem inventou a lâmpada elétrica?", respostaCorreta: "Thomas Edison", alternativas: ["Nikola Tesla", "Thomas Edison", "Albert Einstein", "Michael Faraday"] },
        { pergunta: "Quem foi o autor de 'Cem Anos de Solidão'?", respostaCorreta: "Gabriel García Márquez", alternativas: ["Gabriel García Márquez", "Mario Vargas Llosa", "Carlos Fuentes", "Jorge Luis Borges"] },
        { pergunta: "Qual cientista desenvolveu a teoria da relatividade?", respostaCorreta: "Albert Einstein", alternativas: ["Isaac Newton", "Albert Einstein", "Galileu Galilei", "Nikola Tesla"] },
        { pergunta: "Qual foi o primeiro país a enviar um homem ao espaço?", respostaCorreta: "União Soviética", alternativas: ["Estados Unidos", "União Soviética", "China", "França"] },
        { pergunta: "Em que ano foi concluída a construção da Grande Muralha da China?", respostaCorreta: "1644", alternativas: ["1453", "1644", "1776", "1912"] },
        { pergunta: "Qual é o maior oceano do mundo?", respostaCorreta: "Oceano Pacífico", alternativas: ["Oceano Atlântico", "Oceano Índico", "Oceano Pacífico", "Oceano Ártico"] },
        { pergunta: "Quem foi o último imperador romano?", respostaCorreta: "Rômulo Augústulo", alternativas: ["Júlio César", "Nerva", "Rômulo Augústulo", "Augusto"] },
        { pergunta: "Em que ano ocorreu a queda do Império Romano do Ocidente?", respostaCorreta: "476 d.C.", alternativas: ["410 d.C.", "476 d.C.", "800 d.C.", "1000 d.C."] },
        { pergunta: "Qual é o nome científico do Homo sapiens?", respostaCorreta: "Homo sapiens", alternativas: ["Homo habilis", "Homo sapiens", "Homo erectus", "Australopithecus afarensis"] },
        { pergunta: "Qual foi o primeiro computador eletrônico?", respostaCorreta: "ENIAC", alternativas: ["Colossus", "ENIAC", "UNIVAC", "Atanasoff-Berry Computer"] },
        { pergunta: "Qual foi a primeira nação a abolir a escravidão?", respostaCorreta: "Haiti", alternativas: ["Reino Unido", "Haiti", "França", "Estados Unidos"] },
        { pergunta: "Quem escreveu '1984'?", respostaCorreta: "George Orwell", alternativas: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Philip K. Dick"] },
        { pergunta: "Qual é o nome da teoria que sugere que a Terra é o centro do universo?", respostaCorreta: "Geocentrismo", alternativas: ["Geocentrismo", "Heliocentrismo", "Teoria da relatividade", "Teoria quântica"] },
        { pergunta: "Qual elemento químico foi nomeado em homenagem a Marie Curie?", respostaCorreta: "Curium", alternativas: ["Radônio", "Curium", "Polônio", "Cobalto"] },
        { pergunta: "Quem foi o primeiro presidente da República Francesa?", respostaCorreta: "Louis-Napoléon Bonaparte", alternativas: ["Napoleão Bonaparte", "Louis-Napoléon Bonaparte", "Charles de Gaulle", "François Mitterrand"] },
        { pergunta: "Em que cidade foi assinado o Tratado de Versalhes?", respostaCorreta: "Versalhes", alternativas: ["Paris", "Versalhes", "Berlim", "Londres"] },
        { pergunta: "Quem foi o primeiro a mapear o sistema circulatório humano?", respostaCorreta: "William Harvey", alternativas: ["Andreas Vesalius", "William Harvey", "Hippocrates", "Claude Bernard"] },
        { pergunta: "Qual é o nome do único satélite natural de Netuno?", respostaCorreta: "Tritão", alternativas: ["Caronte", "Tritão", "Fobos", "Ío"] },
        { pergunta: "Quem inventou o avião?", respostaCorreta: "Irmãos Wright", alternativas: ["Alberto Santos Dumont", "Irmãos Wright", "Leonardo da Vinci", "Samuel Morse"] },
        { pergunta: "Qual foi a primeira civilização a utilizar escrita?", respostaCorreta: "Sumérios", alternativas: ["Sumérios", "Egípcios", "Chineses", "Maias"] },
        { pergunta: "Em que ano foi construída a primeira pirâmide do Egito?", respostaCorreta: "2630 a.C.", alternativas: ["3000 a.C.", "2630 a.C.", "2200 a.C.", "1500 a.C."] },
        { pergunta: "Qual a primeira molécula sintetizada em laboratório?", respostaCorreta: "Ureia", alternativas: ["Água", "Ureia", "Ácido acético", "Glicerol"] },
        { pergunta: "Quem pintou a obra 'A Última Ceia'?", respostaCorreta: "Leonardo da Vinci", alternativas: ["Raphael", "Leonardo da Vinci", "Michelangelo", "Caravaggio"] },
        { pergunta: "Quem desenvolveu a teoria da evolução das espécies?", respostaCorreta: "Charles Darwin", alternativas: ["Gregor Mendel", "Charles Darwin", "Jean-Baptiste Lamarck", "Ernst Mayr"] },
        { pergunta: "Qual foi o primeiro ser vivo a ser clonado?", respostaCorreta: "Ovelha Dolly", alternativas: ["Ovelha Dolly", "Cavalo", "Vaca", "Cachorro"] },
        { pergunta: "Qual cientista propôs a teoria do Big Bang?", respostaCorreta: "Georges Lemaître", alternativas: ["Galileu Galilei", "Isaac Newton", "Georges Lemaître", "Albert Einstein"] },
        { pergunta: "Qual é o nome da famosa caverna com pinturas rupestres na França?", respostaCorreta: "Caverna de Lascaux", alternativas: ["Caverna de Altamira", "Caverna de Lascaux", "Caverna de Chauvet", "Caverna de Blombos"] },
        { pergunta: "Em que ano o Brasil se tornou independente de Portugal?", respostaCorreta: "1822", alternativas: ["1808", "1822", "1889", "1500"] },
        { pergunta: "Quem inventou o rádio?", respostaCorreta: "Guglielmo Marconi", alternativas: ["Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi", "Thomas Edison"] },
        { pergunta: "Qual é o nome da primeira mulher a ganhar um Prêmio Nobel?", respostaCorreta: "Marie Curie", alternativas: ["Marie Curie", "Rosalind Franklin", "Dorothy Crowfoot Hodgkin", "Barbara McClintock"] },
        { pergunta: "Quem foi o primeiro homem a voar mais rápido que a velocidade do som?", respostaCorreta: "Chuck Yeager", alternativas: ["Amelia Earhart", "Chuck Yeager", "Neil Armstrong", "Bert Hinkler"] },
        { pergunta: "Em que ano foi realizada a primeira viagem ao redor do mundo?", respostaCorreta: "1519", alternativas: ["1453", "1519", "1588", "1660"] },
        { pergunta: "Quem descobriu a penicilina?", respostaCorreta: "Alexander Fleming", alternativas: ["Edward Jenner", "Louis Pasteur", "Alexander Fleming", "Joseph Lister"] },
        { pergunta: "Qual foi o primeiro filme a ganhar o Oscar de Melhor Filme?", respostaCorreta: "Wings", alternativas: ["Wings", "O Mágico de Oz", "E o Vento Levou", "Cidadão Kane"] }
    ],
    roxo: [
        { pergunta: "Quem foi o primeiro homem a caminhar na Lua?", respostaCorreta: "Neil Armstrong", alternativas: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"] },
        { pergunta: "Qual é o elemento químico com o maior número atômico?", respostaCorreta: "Oganesson", alternativas: ["Uranium", "Oganesson", "Plutonium", "Radon"] },
        { pergunta: "Quem descobriu a teoria dos germes da doença?", respostaCorreta: "Louis Pasteur", alternativas: ["Louis Pasteur", "Robert Koch", "Joseph Lister", "Edward Jenner"] },
        { pergunta: "Em que ano foi lançada a primeira missão espacial a Marte?", respostaCorreta: "1960", alternativas: ["1957", "1960", "1969", "1973"] },
        { pergunta: "Qual é o maior número primo conhecido?", respostaCorreta: "Mersenne Prime", alternativas: ["Mersenne Prime", "10^100", "2^82-1", "257"] },
        { pergunta: "Quem escreveu 'A República'?", respostaCorreta: "Platão", alternativas: ["Aristóteles", "Platão", "Sócrates", "Demócrito"] },
        { pergunta: "Quem foi o primeiro imperador da China?", respostaCorreta: "Qin Shi Huang", alternativas: ["Liu Bang", "Qin Shi Huang", "Wudi", "Sun Tzu"] },
        { pergunta: "Qual foi o primeiro animal a ser clonado?", respostaCorreta: "Ovelha Dolly", alternativas: ["Ovelha Dolly", "Cavalo", "Macaco", "Vaca"] },
        { pergunta: "Quem formulou a teoria da relatividade geral?", respostaCorreta: "Albert Einstein", alternativas: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileu Galilei"] },
        { pergunta: "Qual é o nome do maior vulcão do sistema solar?", respostaCorreta: "Monte Olimpo", alternativas: ["Monte Etna", "Monte Olimpo", "Vulcão Mauna Kea", "Vulcão Kilauea"] },
        { pergunta: "Quem foi o responsável pela criação do primeiro sistema de numeração?", respostaCorreta: "Sumérios", alternativas: ["Sumérios", "Egípcios", "Babilônios", "Romanos"] },
        { pergunta: "Qual é a teoria científica que descreve a origem do universo?", respostaCorreta: "Big Bang", alternativas: ["Big Bang", "Teoria da Relatividade", "Teoria Quântica", "Teoria do Multiverso"] },
        { pergunta: "Em que ano foi fundada a Organização das Nações Unidas (ONU)?", respostaCorreta: "1945", alternativas: ["1919", "1945", "1950", "1960"] },
        { pergunta: "Quem foi o primeiro a criar a teoria heliocêntrica?", respostaCorreta: "Nicolau Copérnico", alternativas: ["Galileu Galilei", "Nicolau Copérnico", "Johannes Kepler", "Isaac Newton"] },
        { pergunta: "Qual é o nome da maior estrela conhecida?", respostaCorreta: "UY Scuti", alternativas: ["VY Canis Majoris", "Betelgeuse", "UY Scuti", "Rigel"] },
        { pergunta: "Em que ano foi realizada a primeira expedição ao Polo Sul?", respostaCorreta: "1911", alternativas: ["1909", "1911", "1920", "1930"] },
        { pergunta: "Quem descobriu a estrutura do DNA?", respostaCorreta: "James Watson e Francis Crick", alternativas: ["James Watson e Francis Crick", "Rosalind Franklin", "Linus Pauling", "Maurice Wilkins"] },
        { pergunta: "Quem foi o autor da teoria da evolução das espécies?", respostaCorreta: "Charles Darwin", alternativas: ["Charles Darwin", "Alfred Russel Wallace", "Gregor Mendel", "Jean-Baptiste Lamarck"] },
        { pergunta: "Quem inventou o primeiro microscópio?", respostaCorreta: "Zacharias Janssen", alternativas: ["Robert Hooke", "Antonie van Leeuwenhoek", "Zacharias Janssen", "Galileo Galilei"] },
        { pergunta: "Quem foi o primeiro a teorizar a evolução humana?", respostaCorreta: "Jean-Baptiste Lamarck", alternativas: ["Charles Darwin", "Jean-Baptiste Lamarck", "Gregor Mendel", "Alfred Russel Wallace"] },
        { pergunta: "Qual é o nome do maior satélite de Saturno?", respostaCorreta: "Titã", alternativas: ["Titã", "Encélado", "Mimas", "Tétis"] },
        { pergunta: "Qual é o maior planeta do sistema solar?", respostaCorreta: "Júpiter", alternativas: ["Júpiter", "Saturno", "Urano", "Netuno"] },
        { pergunta: "Qual é a estrela mais próxima da Terra?", respostaCorreta: "Sol", alternativas: ["Alpha Centauri", "Sol", "Proxima Centauri", "Sirius"] },
        { pergunta: "Quem formulou a lei da gravitação universal?", respostaCorreta: "Isaac Newton", alternativas: ["Isaac Newton", "Albert Einstein", "Galileu Galilei", "Johannes Kepler"] },
        { pergunta: "Em que ano foi feita a primeira observação astronômica através de um telescópio?", respostaCorreta: "1609", alternativas: ["1600", "1609", "1620", "1645"] },
        { pergunta: "Qual é o maior órgão do corpo humano?", respostaCorreta: "Pele", alternativas: ["Pele", "Coração", "Fígado", "Pulmões"] },
        { pergunta: "Quem desenvolveu a teoria da psicanálise?", respostaCorreta: "Sigmund Freud", alternativas: ["Sigmund Freud", "Carl Jung", "Alfred Adler", "Erik Erikson"] },
        { pergunta: "Quem foi o primeiro a desenvolver a teoria da relatividade especial?", respostaCorreto: "Albert Einstein", alternativas: ["Albert Einstein", "Niels Bohr", "Max Planck", "Erwin Schrödinger"] }
    ]
};

// Atualiza o tabuleiro com as posições dos jogadores
function atualizarTabuleiro() {
    tabuleiro.innerHTML = ""; // Limpa o tabuleiro antes de atualizar
    for (let i = 0; i < numeroCasas; i++) {
        const casa = document.createElement("div");
        casa.className = "casa";
        casa.textContent = i + 1;

        jogadores.forEach((jogador, index) => {
            if (posicoes[index] === i) {
                const marcador = document.createElement("span");
                marcador.className = `jogador jogador-${index}`;
                marcador.textContent = jogador[0]; // Inicial do jogador
                marcador.style.backgroundColor = coresJogadores[index]; // Cor do jogador
                marcador.style.color = "#fff"; // Cor do texto
                marcador.style.padding = "5px";
                marcador.style.borderRadius = "50%";
                marcador.style.margin = "5px";
                casa.appendChild(marcador);
            }
        });

        tabuleiro.appendChild(casa);
    }
    jogadorAtualSpan.textContent = jogadores[jogadorAtual];
    jogadorAtualSpan.style.color = coresJogadores[jogadorAtual]; // Cor do texto do jogador atual
    console.log("Jogador atual no tabuleiro:", jogadorAtual);
}

// Seleciona uma pergunta aleatória que ainda não foi usada
function selecionarPerguntaAleatoria() {
    const todasPerguntas = Object.values(perguntas).flat();
    const perguntasDisponiveis = todasPerguntas.filter((_, index) => !perguntasUsadas.includes(index));

    if (perguntasDisponiveis.length === 0) {
        alert("Todas as perguntas já foram usadas!");
        return null;
    }

    const indiceAleatorio = Math.floor(Math.random() * perguntasDisponiveis.length);
    const perguntaSelecionada = perguntasDisponiveis[indiceAleatorio];
    const indiceGlobal = todasPerguntas.indexOf(perguntaSelecionada);

    perguntasUsadas.push(indiceGlobal);
    localStorage.setItem("perguntasUsadas", JSON.stringify(perguntasUsadas));

    return { pergunta: perguntaSelecionada, nivel: determinarNivelPergunta(perguntaSelecionada) };
}

// Determina o nível da pergunta com base na sua origem
function determinarNivelPergunta(pergunta) {
    for (const [nivel, listaPerguntas] of Object.entries(perguntas)) {
        if (listaPerguntas.includes(pergunta)) {
            return nivel;
        }
    }
    return "verde"; // Retorna "verde" como padrão se não encontrado
}

// Exibe a pergunta aleatória
function exibirPergunta() {
    rodadaPronta = true; // Permite responder a pergunta
    perguntaSection.innerHTML = ""; // Limpa perguntas anteriores

    const { pergunta, nivel } = selecionarPerguntaAleatoria();

    if (!pergunta) {
        return;
    }

    const perguntaContainer = document.createElement("div");
    perguntaContainer.className = `pergunta-section pergunta-${nivel}`;
    perguntaContainer.textContent = pergunta.pergunta;
    perguntaSection.appendChild(perguntaContainer);

    pergunta.alternativas.forEach((alternativa) => {
        const botaoAlternativa = document.createElement("button");
        botaoAlternativa.textContent = alternativa;
        botaoAlternativa.className = "alternativa";
        perguntaContainer.appendChild(botaoAlternativa);

        botaoAlternativa.addEventListener("click", () => {
            if (!rodadaPronta) {
                alert("Você precisa girar a roleta antes de responder!");
                return;
            }

            let mensagem; // Variável para armazenar a mensagem de feedback
            // Verifica se a resposta está correta
            if (alternativa === pergunta.respostaCorreta) {
                mensagem = "Parabéns! Você acertou!";
                const movimento = nivel === "roxo" ? parseInt(resultado) * 2 : parseInt(resultado);
                posicoes[jogadorAtual] = Math.min(posicoes[jogadorAtual] + movimento, numeroCasas - 1);
            } else {
                mensagem = "Que pena! Você errou!";
                posicoes[jogadorAtual] = Math.max(posicoes[jogadorAtual] - parseInt(resultado), 0);
            }

            alert(mensagem); // Exibe a mensagem de feedback para o jogador
            console.log("Posições atualizadas:", posicoes);

            verificarVitoria();

            // Atualiza para o próximo jogador
            jogadorAtual = (jogadorAtual + 1) % jogadores.length;
            localStorage.setItem("jogadorAtual", jogadorAtual);
            localStorage.setItem("posicoes", JSON.stringify(posicoes));

            rodadaPronta = false;
            atualizarTabuleiro();
            perguntaSection.innerHTML = ""; // Limpa perguntas após a resposta
        });
    });
}

// Verifica se há um vencedor
function verificarVitoria() {
    if (posicoes[jogadorAtual] === numeroCasas - 1) {
        // Salva o vencedor e redireciona para a tela final
        localStorage.setItem("vencedor", jogadores[jogadorAtual]);
        localStorage.setItem("corVencedor", coresJogadores[jogadorAtual]);
        window.location.href = "tela_final.html";
    }
}

// Gerencia o turno do jogador
function realizarTurno() {
    if (rodadaPronta) {
        alert("Responda a pergunta atual antes de girar a roleta!");
        return;
    }
    localStorage.setItem("jogadorAtual", jogadorAtual); // Salva o jogador atual antes de sair
    console.log("Jogador atual salvo no LocalStorage:", jogadorAtual);
    window.location.href = "roleta.html"; // Direciona para a roleta
}

// Inicializa o tabuleiro e as interações
atualizarTabuleiro();
botaoJogar.addEventListener("click", realizarTurno);

// Verifica se há um resultado da roleta para exibir pergunta
const resultado = localStorage.getItem("resultadoRoleta");
if (resultado) {
    exibirPergunta();
    localStorage.removeItem("resultadoRoleta"); // Limpa o resultado após uso
}