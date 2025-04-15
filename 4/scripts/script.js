let predictions = 0;
let correctPredictions = 0;
let correctPredictionsRatio = 0;

// Constants and configuration
const options = ["Plant", "Animal", "Sport"];
const features = [
    "Green", "Soil", "Leafs", "Flowers",        // Plant
    "Fur", "Tail", "Beak", "Wings",            // Animal
    "Ball", "Run", "Soccer", "Field"          // Sport
];
const autoTrainer = {
    "Plant": ["Green", "Soil", "Leafs", "Flowers"],
    "Animal": ["Fur", "Tail", "Beak", "Wings"],
    "Sport": ["Ball", "Run", "Soccer", "Field"]
};

// Initialize application
function initializeApp() {
    setupUI();
    loadBrain();
    drawBrain();
}

// UI Setup
function setupUI() {
    setupFeatureCheckboxes();
    setupBrainControls();
    setupFeedbackButtons();
}

function setupFeatureCheckboxes() {
    const formContainer = document.getElementById("input-neurons");
    features.forEach((feature, index) => {
        const label = document.createElement("label");
        label.innerText = feature;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `feature-${index}`;
        checkbox.dataset.index = index;
        checkbox.addEventListener('change', clearPrediction);

        label.appendChild(checkbox);
        formContainer.appendChild(label);
        formContainer.appendChild(document.createElement("br"));
    });
}

function setupBrainControls() {
    document.getElementById('reset-brain').addEventListener('click', handleResetBrain);
    // document.getElementById('export-brain').addEventListener('click', handleExportBrain);
    // document.getElementById('import-brain').addEventListener('click', handleImportBrain);
    document.getElementById('predict-button').addEventListener('click', predict);
    document.getElementById('clear-button').addEventListener('click', handleClearForm);
}

function setupFeedbackButtons() {
    const feedbackDiv = document.getElementById("feedback");
    feedbackDiv.innerHTML = options.map((option, index) => `
        <button id="option-${index}-button">It was a ${option}</button>
    `).join('');

    options.forEach((_, index) => {
        document.getElementById(`option-${index}-button`).addEventListener("click", () => updateWeights(index));
    });
}

// UI Event Handlers
function clearPrediction() {
    document.getElementById("result").innerText = "";
    document.getElementById("feedback").style.display = "none";
}

function handleResetBrain() {
    initializeRandomBrain();
    saveBrain();
    drawBrain();
}

function handleExportBrain() {
    const brainData = {
        features,
        options,
        weights,
        biases
    };
    document.getElementById('brain-json').value = JSON.stringify(brainData, null, 2);
}

function handleImportBrain() {
    try {
        const brainData = JSON.parse(document.getElementById('brain-json').value);
        if (!validateBrainData(brainData)) {
            alert('Cannot import: Features or options do not match the current configuration');
            return;
        }
        importBrain(brainData);
        document.getElementById('brain-json').value = '';
    } catch (e) {
        alert('Invalid brain JSON format');
    }
}

function validateBrainData(brainData) {
    return JSON.stringify(brainData.features) === JSON.stringify(features) &&
           JSON.stringify(brainData.options) === JSON.stringify(options);
}

function handleClearForm() {
    document.getElementById("neuron-form").reset();
    clearPrediction();
}

function updatePredictionStats(predictedIndex, correctIndex) {
    predictions++;
    if (predictedIndex === correctIndex) {
        correctPredictions++;
    }
    correctPredictionsRatio = (correctPredictions / predictions) * 100;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);