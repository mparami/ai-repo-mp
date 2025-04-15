let trainingIterations = 0;
let isTraining = false;
let lastTimestamp = 0;
const ITERATIONS_PER_FRAME = 100; // Adjust this to control speed/performance

// Add event listener for auto-trainer toggle
document.querySelector('#auto-trainer-toggle').addEventListener('click', toggleAutoTrainer);

function selectRandomOption() {
    const optionIndex = Math.floor(Math.random() * options.length);
    return {
        index: optionIndex,
        option: options[optionIndex]
    };
}

function selectRandomFeatures(optionFeatures) {
    const numFeaturesToCheck = Math.floor(Math.random() * optionFeatures.length) + 1;
    return [...optionFeatures]
        .sort(() => Math.random() - 0.5)
        .slice(0, numFeaturesToCheck);
}

function runTrainingIteration() {
    const { index: optionIndex, option } = selectRandomOption();
    const optionFeatures = autoTrainer[option];
    const selectedFeatures = selectRandomFeatures(optionFeatures);

    // Set checkboxes without visual update
    document.getElementById("neuron-form").reset();
    for (const feature of selectedFeatures) {
        const featureIndex = features.indexOf(feature);
        const checkbox = document.getElementById(`feature-${featureIndex}`);
        checkbox.checked = true;
    }

    // Run prediction and update weights
    const predictedIndex = predict(false);
    updatePredictionStats(predictedIndex, optionIndex);
    updateWeights(optionIndex, false);
    trainingIterations++;
}

function trainingLoop(timestamp) {
    if (!isTraining) {
        return;
    }

    // Run multiple iterations per frame
    for (let i = 0; i < ITERATIONS_PER_FRAME; i++) {
        runTrainingIteration();
        
        // Update visualization every 100 iterations
        if (trainingIterations % 100 === 0) {
            drawBrain();
            updateTrainingStats();
        }
    }

    // Schedule next frame
    requestAnimationFrame(trainingLoop);
}

function updateTrainingStats() {
    const statsDiv = document.getElementById('training-stats');
    statsDiv.textContent = `Iterations: ${trainingIterations} | Accuracy: ${correctPredictionsRatio.toFixed(1)}%`;
}

function toggleAutoTrainer() {
    isTraining = !isTraining;
    const button = document.getElementById('auto-trainer-toggle');
    const statsDiv = document.getElementById('training-stats');
    
    if (isTraining) {
        button.classList.add('active');
        button.textContent = 'Stop Training';
        trainingIterations = 0;
        predictions = 0;
        correctPredictions = 0;
        correctPredictionsRatio = 0;
        statsDiv.style.display = 'block';
        requestAnimationFrame(trainingLoop);
    } else {
        button.classList.remove('active');
        button.textContent = 'Start Auto-Trainer';
        statsDiv.textContent = `Final Accuracy: ${correctPredictionsRatio.toFixed(1)}%`;
        // Final draw to show result
        drawBrain();
    }
}