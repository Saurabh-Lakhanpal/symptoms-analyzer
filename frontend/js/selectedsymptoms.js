// selectedSymptoms.js

// Global variables to track selected symptoms
let selectedSymptoms = [];
let selectedSymptom_ids = [];

// Function to add a symptom to the selected list
function addSelectedSymptom(symptomName, symptom_id) {
    if (!selectedSymptom_ids.includes(symptom_id)) {
        selectedSymptoms.push(symptomName);
        selectedSymptom_ids.push(symptom_id);
    }

    updateSelectedSymptomsUI();
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName, symptom_id) {
    selectedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomName);
    selectedSymptom_ids = selectedSymptom_ids.filter(id => id !== symptom_id);

    updateSelectedSymptomsUI();
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedFromMatches(matches) {
    matches.forEach(match => {
        match.symptoms.forEach(symptom => {
            const symptom_id = symptom.symptom_id;
            const symptom_name = symptom.s_name;
            const checkbox = document.getElementById(symptom_id);

            // If checkbox is checked AND symptom isn't already in the list, add it
            if (checkbox && checkbox.checked && !selectedSymptom_ids.includes(symptom_id)) {
                addSelectedSymptom(symptom_name, symptom_id);
            }
        });
    });

    console.log("Updated Selected Symptoms:", selectedSymptoms);
}

// Modify the analyze button click to include updating selected symptoms
document.getElementById('cta').addEventListener('click', async () => {
    if (selectedSymptom_ids.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    const matches = await fetchMatches(selectedSymptom_ids);
    populateRelatedSymptoms(matches);

    // After analysis, update selected symptoms based on checked boxes in matches
    updateSelectedFromMatches(matches);
});

