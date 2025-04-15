function drawBrain() {
    if (!weights || !weights.inputToHidden || !weights.inputToHidden[0]) {
        console.error('Weights not properly initialized');
        return;
    }

    const brainDiv = document.getElementById("brain");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = windowWidth * 0.85;
    const height = windowHeight;
    const inputX = 0;
    const hiddenX = width/2 - 150;
    const outputX = width - 150;
    
    // Calculate vertical spacing
    const inputStartY = 50;
    const inputEndY = height - 100;
    const inputSpacing = (inputEndY - inputStartY) / (features.length - 1);
    
    const hiddenY = height/2;
    
    const outputStartY = 50;
    const outputEndY = height - 100;
    const outputSpacing = (outputEndY - outputStartY) / (options.length - 1);
    
    const svg = `<svg width="${width}" height="${height}"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#888"/></marker></defs><g transform="translate(50,20)">
    ${features.map((feature, i) => `
        <circle class="input-neuron" cx="${inputX}" cy="${inputStartY + i * inputSpacing}" r="15" fill="#aaa">
            <title>Input: ${feature}
Outgoing connection:
→ Hidden: ${weights.inputToHidden[0][i].toFixed(3)}</title>
        </circle>
        <text x="${inputX + 30}" y="${inputStartY + 5 + i * inputSpacing}" font-size="12">${feature}</text>
        <line x1="${inputX + 15}" y1="${inputStartY + i * inputSpacing}" 
              x2="${hiddenX}" y2="${hiddenY}" 
              stroke="#888"
              stroke-width="2" 
              opacity="0.7"
              marker-end="url(#arrowhead)">
            <title>Weight: ${weights.inputToHidden[0][i].toFixed(3)}</title>
        </line>
        <text x="${(inputX + hiddenX) / 2}" 
              y="${(inputStartY + i * inputSpacing + hiddenY) / 2 - 10}" 
              font-size="12"
              text-anchor="middle">
            ${weights.inputToHidden[0][i].toFixed(2)}
        </text>
    `).join('')}
    
    <circle class="hidden-neuron" cx="${hiddenX}" cy="${hiddenY}" r="20" fill="#aaf">
        <title>Hidden Node
Bias: ${biases.hidden[0].toFixed(3)}</title>
    </circle>
    <text x="${hiddenX - 20}" y="${hiddenY + 35}" font-size="12">Bias: ${biases.hidden[0].toFixed(3)}</text>
    
    ${options.map((option, i) => `
        <circle class="output-neuron" cx="${outputX}" cy="${outputStartY + i * outputSpacing}" r="20" fill="#faa">
            <title>Output: ${option}
Bias: ${biases.output[i].toFixed(3)}
← Hidden: ${weights.hiddenToOutput[i][0].toFixed(3)}</title>
        </circle>
        <text x="${outputX + 30}" y="${outputStartY + 5 + i * outputSpacing}" font-size="14">${option}</text>
        <text x="${outputX - 20}" y="${outputStartY + 25 + i * outputSpacing}" font-size="12">Bias: ${biases.output[i].toFixed(3)}</text>
        <line x1="${hiddenX + 20}" y1="${hiddenY}" 
              x2="${outputX}" y2="${outputStartY + i * outputSpacing}" 
              stroke="#888"
              stroke-width="2" 
              opacity="0.7"
              marker-end="url(#arrowhead)">
            <title>Weight: ${weights.hiddenToOutput[i][0].toFixed(3)}</title>
        </line>
        <text x="${(hiddenX + outputX) / 2}" 
              y="${(hiddenY + outputStartY + i * outputSpacing) / 2 - 10}" 
              font-size="12"
              text-anchor="middle">
            ${weights.hiddenToOutput[i][0].toFixed(2)}
        </text>
    `).join('')}</g></svg>`;
    
    brainDiv.innerHTML = svg;
}
