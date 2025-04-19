// Function to fetch matching diseases based on selected symptoms
async function fetchMatches(selectedSymptom_ids) {
    // Construct API call using selectedSymptom_ids
    const matchesUrl = `${window.baseUrl}/api.01/matches?symptom_ids=${selectedSymptom_ids.join(',')}`;

    try {
        // Send a GET request to the API to fetch matches
        const response = await fetch(matchesUrl);
        if (!response.ok) {
            // Throw an error if the HTTP response status is not OK
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response JSON data
        const data = await response.json();
        return data.matches; // Return the matches from the response
    } catch (error) {
        return []; // Return an empty array if there's an error
    }
}

// Function to populate the Related Symptoms sections with checkboxes
function populateRelatedSymptoms(matches) {
    // Get the HTML elements for the related symptoms sections
    const relatedSymptoms1 = document.getElementById('related-symptoms-1');
    const relatedSymptoms2 = document.getElementById('related-symptoms-2');
    const relatedSymptoms3 = document.getElementById('related-symptoms-3');

    // Get the HTML elements for the disease descriptions
    const symptomsBox1 = document.getElementById('symptoms-box-1');
    const symptomsBox2 = document.getElementById('symptoms-box-2');
    const symptomsBox3 = document.getElementById('symptoms-box-3');

    // Clear previous content in the related symptoms sections
    relatedSymptoms1.innerHTML = "Related Symptoms: ";
    relatedSymptoms2.innerHTML = "Related Symptoms: ";
    relatedSymptoms3.innerHTML = "Related Symptoms: ";

    // Clear previous content in the disease descriptions
    symptomsBox1.innerHTML = "";
    symptomsBox2.innerHTML = "";
    symptomsBox3.innerHTML = "";

    // Helper function to create a checkbox for a symptom
    function createCheckbox(symptom) {
        return `
            <input 
                type="checkbox" 
                class="symptom-checkbox" 
                id="${symptom.symptom_id}" 
                data-symptom="${symptom.s_name}" 
                data-symptom-id="${symptom.symptom_id}" 
                ${selectedSymptom_ids.includes(symptom.symptom_id) ? 'checked' : ''}
            >
            <label for="${symptom.symptom_id}">${symptom.s_name}</label>
        `;
    }

    // Populate first set of related symptoms if matches[0] exists
    if (matches[0]) {
        const list1 = matches[0].symptoms.map(createCheckbox).join(' ');
        relatedSymptoms1.innerHTML += `<br>${list1}`;
        document.getElementById('disease-description-1').textContent = matches[0].probability; // Populate probability
        symptomsBox1.innerHTML = `<strong>${matches[0].d_name}</strong> ${matches[0].description[0]}`; // Populate disease description
    }

    // Populate second set of related symptoms if matches[1] exists
    if (matches[1]) {
        const list2 = matches[1].symptoms.map(createCheckbox).join(' ');
        relatedSymptoms2.innerHTML += `<br>${list2}`;
        document.getElementById('disease-description-2').textContent = matches[1].probability; // Populate probability
        symptomsBox2.innerHTML = `<strong>${matches[1].d_name}</strong> ${matches[1].description[0]}`; // Populate disease description
    }

    // Populate third set of related symptoms if matches[2] exists
    if (matches[2]) {
        const list3 = matches[2].symptoms.map(createCheckbox).join(' ');
        relatedSymptoms3.innerHTML += `<br>${list3}`;
        document.getElementById('disease-description-3').textContent = matches[2].probability; // Populate probability
        symptomsBox3.innerHTML = `<strong>${matches[2].d_name}</strong> ${matches[2].description[0]}`; // Populate disease description
    }

    // After populating symptoms, set up checkbox synchronization
    setupCheckboxSynchronization();
}

// Function to synchronize symptom selection across all sections
function synchronizeCheckboxes(symptomName, symptom_id, isChecked) {
    // Update the selected symptoms list based on the checkbox status
    if (isChecked) {
        if (!selectedSymptoms.includes(symptomName)) {
            selectedSymptoms.push(symptomName);
        }
        if (!selectedSymptom_ids.includes(symptom_id)) {
            selectedSymptom_ids.push(symptom_id);
        }
    } else {
        selectedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomName);
        selectedSymptom_ids = selectedSymptom_ids.filter(id => id !== symptom_id);
    }

    // Update all related checkboxes to match the status
    document.querySelectorAll(`.symptom-checkbox[data-symptom-id="${symptom_id}"]`).forEach(checkbox => {
        checkbox.checked = isChecked;
    });

    // Update the "Selected Symptoms" UI
    updateSelectedSymptomsUI();
}

// Event listener for dynamically managing checkbox interactions
function setupCheckboxSynchronization() {
    // Add event listeners to all checkboxes in related symptoms sections and selected symptoms list
    document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const symptomName = event.target.getAttribute('data-symptom');
            const symptom_id = event.target.getAttribute('data-symptom-id');
            const isChecked = event.target.checked;

            // Synchronize the checkbox state across all sections
            synchronizeCheckboxes(symptomName, symptom_id, isChecked);
        });
    });
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedSymptomsUI() {
    const selectedSymptomsDiv = document.getElementById('selected-symptoms');

    if (selectedSymptoms.length === 0) {
        selectedSymptomsDiv.innerHTML = "Selected Symptoms";
    } else {
        selectedSymptomsDiv.innerHTML = selectedSymptoms.map((symptom, index) => `
            <div class="selected-symptom">
                <button class="remove-symptom" data-symptom="${symptom}" data-symptom-id="${selectedSymptom_ids[index]}">x</button>
                ${symptom}
            </div>
        `).join('');
    }

    // Add event listeners to "X" buttons for symptom removal
    document.querySelectorAll('.remove-symptom').forEach(button => {
        button.addEventListener('click', (event) => {
            const symptomToRemove = event.target.getAttribute('data-symptom');
            const symptom_idToRemove = event.target.getAttribute('data-symptom-id');
            
            // Remove the symptom from all places
            synchronizeCheckboxes(symptomToRemove, symptom_idToRemove, false);
        });
    });
}

// Function to handle the "Analyze" button click
async function analyzeSymptoms() {
    const analyzeButton = document.getElementById('cta');
    analyzeButton.addEventListener('click', async () => {
        if (selectedSymptom_ids.length === 0) {
            alert("Please select at least one symptom to analyze.");
            return;
        }

        const matches = await fetchMatches(selectedSymptom_ids);
        populateRelatedSymptoms(matches);
    });
}

// Initialize the functionality by setting up event listeners
analyzeSymptoms();
