const learningRate = 0.1;         // learning rate, increase to speed up training; can lead to exploding gradients

// Add these global variables at the top of the file
const resultDiv = document.getElementById("result");
const feedbackDiv = document.getElementById("feedback");

// Update weights initialization to include hidden layer
let weights = {
    inputToHidden: Array.from({ length: 1 }, () =>  // 1 hidden node
        Array.from({ length: features.length }, () => Math.random() - 0.5)
    ),
    hiddenToOutput: Array.from({ length: options.length }, () =>  // output nodes
        Array.from({ length: 1 }, () => Math.random() - 0.5)  // 1 hidden node
    )
};
let biases = {
    hidden: Array.from({ length: 1 }, () => Math.random() - 0.5),
    output: Array.from({ length: options.length }, () => Math.random() - 0.5)
};

function sigmoid(x) {
    const result = 1 / (1 + Math.exp(-x));
    if (isNaN(result)) {
        console.error('NaN detected in sigmoid');
        return 0;
    }
    return result;
}

function activation(x) {
    const result = Math.max(0, x);
    if (isNaN(result)) {
        console.error('NaN detected in activation');
        return 0;
    }
    return result;
}

function calculateHiddenLayerOutput(inputs) {
    const hiddenInput = inputs.reduce((sum, input, index) => 
        sum + input * weights.inputToHidden[0][index], 0) + biases.hidden[0];
    return {
        hiddenInput,
        hiddenOutput: activation(hiddenInput)
    };
}

function predict(shouldDraw = true) {
    const inputs = features.map((_, index) => document.getElementById(`feature-${index}`).checked ? 1 : 0);
    
    // Calculate hidden layer activation
    const { hiddenOutput } = calculateHiddenLayerOutput(inputs);
    
    // Calculate output layer activations
    const outputs = options.map((_, optIndex) => {
        const weightedSum = hiddenOutput * weights.hiddenToOutput[optIndex][0] + biases.output[optIndex];
        return activation(weightedSum);
    });
    
    // Find the highest probability option
    const maxIndex = outputs.reduce((maxIdx, current, idx) => 
        current > outputs[maxIdx] ? idx : maxIdx, 0);
    
    if (shouldDraw) {
        resultDiv.innerText = `AI thinks: ${options[maxIndex]}`;
        feedbackDiv.style.display = "block";
        drawBrain();
    }
    
    return maxIndex;
}

function updateWeights(correct, shouldDraw = true) {
    const inputs = features.map((_, index) => document.getElementById(`feature-${index}`).checked ? 1 : 0);

    // Forward pass
    const { hiddenInput, hiddenOutput } = calculateHiddenLayerOutput(inputs);
    
    const outputs = options.map((_, optIndex) => {
        const weightedSum = hiddenOutput * weights.hiddenToOutput[optIndex][0] + biases.output[optIndex];
        return activation(weightedSum);
    });

    // Create target array
    const targets = options.map((_, index) => index === correct ? 1 : 0);

    // Backpropagation
    // Output layer
    const outputErrors = outputs.map((output, index) => targets[index] - output);
    
    // Hidden layer - using ReLU derivative (1 for positive inputs, 0 for negative)
    const hiddenDerivative = hiddenInput > 0 ? 1 : 0;
    let hiddenError = outputErrors.reduce((sum, error, index) => 
        sum + error * weights.hiddenToOutput[index][0], 0) * hiddenDerivative;

    // Check for infinity
    if(hiddenError === Infinity || hiddenError === -Infinity) {
        console.error('Infinite hidden error detected');
        hiddenError = Number.MAX_VALUE;
    }

    if(isNaN(hiddenError)) {
        console.error('NaN detected in hidden error:', {
            outputErrors,
            weights: weights.hiddenToOutput,
            hiddenDerivative,
            hiddenInput
        });
        return;
    }

    // Update weights and biases
    // Output layer
    options.forEach((_, optIndex) => {
        const outputDerivative = outputs[optIndex] > 0 ? 1 : 0;
        let weightDelta = learningRate * outputErrors[optIndex] * hiddenOutput * outputDerivative;
        if (isNaN(weightDelta)) {
            console.error('NaN detected in output weight update');
            weightDelta = 0;
        }
        weights.hiddenToOutput[optIndex][0] += weightDelta;
        
        let biasDelta = learningRate * outputErrors[optIndex] * outputDerivative;
        if (isNaN(biasDelta)) {
            console.error('NaN detected in output bias update');
            biasDelta = 0;
        }
        biases.output[optIndex] += biasDelta;
    });

    // Hidden layer
    inputs.forEach((input, index) => {
        let weightDelta = learningRate * hiddenError * input;
        if (isNaN(weightDelta)) {
            console.error('NaN detected in hidden weight update:', {
                learningRate,
                hiddenError,
                input
            });
            weightDelta = 0;
        }
        weights.inputToHidden[0][index] += weightDelta;
    });

    let hiddenBiasDelta = learningRate * hiddenError;
    if (isNaN(hiddenBiasDelta)) {
        console.error('NaN detected in hidden bias update');
        hiddenBiasDelta = 0;
    }
    biases.hidden[0] += hiddenBiasDelta;

    saveBrain();
    
    if (shouldDraw) {
        resultDiv.innerText = "Weights updated. Ready for the next round.";
        document.getElementById("neuron-form").reset();
        drawBrain();
    }
}

function initializeRandomBrain() {
    weights = {
        inputToHidden: Array.from({ length: 1 }, () =>  // 1 hidden node
            Array.from({ length: features.length }, () => Math.random() - 0.5)
        ),
        hiddenToOutput: Array.from({ length: options.length }, () =>  // output nodes
            Array.from({ length: 1 }, () => Math.random() - 0.5)  // 1 hidden node
        )
    };
    biases = {
        hidden: Array.from({ length: 1 }, () => Math.random() - 0.5),
        output: Array.from({ length: options.length }, () => Math.random() - 0.5)
    };
}

function loadBrain() {
    const savedBrain = localStorage.getItem('brain');
    if (savedBrain) {
        try {
            const brainData = JSON.parse(savedBrain);
            // Verify features and options match exactly
            if (JSON.stringify(brainData.features) === JSON.stringify(features) &&
                JSON.stringify(brainData.options) === JSON.stringify(options) &&
                brainData.weights && brainData.biases) {
                weights = brainData.weights;
                biases = brainData.biases;
                return; // Successfully loaded brain
            }
        } catch (e) {
            console.warn('Error parsing brain data from localStorage:', e);
        }
    }
    
    // If we get here, either:
    // 1. No brain in localStorage
    // 2. Invalid brain data
    // 3. Incompatible features/options
    // So initialize a new random brain
    initializeRandomBrain();
    saveBrain(); // Save the new brain to localStorage
}

function saveBrain() {
    const brainData = {
        features,
        options,
        weights,
        biases
    };
    localStorage.setItem('brain', JSON.stringify(brainData));
}

function importBrain(brainData) {
    weights = brainData.weights;
    biases = brainData.biases;
    saveBrain();
    drawBrain();
}