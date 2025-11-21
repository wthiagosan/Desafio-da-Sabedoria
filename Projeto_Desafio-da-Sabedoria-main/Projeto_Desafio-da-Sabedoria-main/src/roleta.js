const container = document.querySelector(".container");
const btn = document.getElementById("spin");
const arrow = document.querySelector(".arrow");

const segments = ["1", "2", "3", "4", "5", "6", "7", "8"]; // Os segmentos da roleta
const segmentAngle = 360 / segments.length; // Ângulo de cada segmento
let currentRotation = 0; // Controle de rotação acumulada

btn.addEventListener("click", () => {
    const randomSpin = Math.floor(Math.random() * 3600) + 720; // Gira de 720° a 4320°
    currentRotation += randomSpin;

    // Aplica a rotação com animação
    container.style.transition = "transform 5s ease-out";
    container.style.transform = `rotate(${currentRotation}deg)`;

    // Determina o segmento vencedor após a rotação
    setTimeout(() => {
        const normalizedRotation = (currentRotation % 360 + 360) % 360; // Normaliza o ângulo entre 0 e 360
        const selectedSegmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
        const result = segments[selectedSegmentIndex];

        console.log("Segmento selecionado:", result); // Exibe no console para verificação
        localStorage.setItem("resultadoRoleta", result); // Salva o resultado no localStorage

        // Exibe o resultado abaixo da roleta
        const resultDisplay = document.createElement("div");
        resultDisplay.textContent = `Resultado: ${result}`;
        resultDisplay.style.marginTop = "20px";
        resultDisplay.style.fontSize = "24px";
        resultDisplay.style.fontWeight = "bold";
        resultDisplay.style.color = "#333";
        resultDisplay.style.textAlign = "center";
        container.parentElement.appendChild(resultDisplay);

        // Redireciona para jogo_principal.html após exibir o resultado
        setTimeout(() => {
            window.location.href = "jogo_principal.html";
        }, 2000); // Redireciona após 2 segundos
    }, 5000); // Espera a animação completar antes de determinar o resultado
});
