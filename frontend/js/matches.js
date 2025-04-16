// matches.js

// Function to fetch matching diseases based on selected symptoms
async function fetchMatches(selectedSymptom_ids) {
    const matchesUrl = `${window.baseUrl}/api.01/matches?symptoms=${selectedSymptom_ids.join(',')}`; 
    try {
        const response = await fetch(matchesUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.matches; 
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
}

// Function to populate the Related Symptoms sections with checkboxes in comma-separated format
function populateRelatedSymptoms(matches) {
    const relatedSymptoms1 = document.getElementById('related-symptoms-1');
    const relatedSymptoms2 = document.getElementById('related-symptoms-2');
    const relatedSymptoms3 = document.getElementById('related-symptoms-3');

    // Clear previous content
    relatedSymptoms1.innerHTML = "Related Symptoms: ";
    relatedSymptoms2.innerHTML = "Related Symptoms: ";
    relatedSymptoms3.innerHTML = "Related Symptoms: ";

    // Helper function to create checkbox followed by the symptom name
    function createCheckbox(symptomName) {
        return `
            <input 
                type="checkbox" 
                class="symptom-checkbox" 
                id="${symptomName}" 
                data-symptom="${symptomName}" 
                ${selectedSymptom_ids.includes(symptomName) ? 'checked' : ''}
            >
            <label for="${symptomName}">${symptomName}</label>
        `;
    }

    // Populate first set of related symptoms
    if (matches[0]) {
        const list1 = matches[0].s_name.map(createCheckbox).join(' '); 
        relatedSymptoms1.innerHTML += `<br>${list1}`;
    }

    // Populate second set of related symptoms
    if (matches[1]) {
        const list2 = matches[1].s_name.map(createCheckbox).join(' '); 
        relatedSymptoms2.innerHTML += `<br>${list2}`;
    }

    // Populate third set of related symptoms
    if (matches[2]) {
        const list3 = matches[2].s_name.map(createCheckbox).join(' '); 
        relatedSymptoms3.innerHTML += `<br>${list3}`;
    }

    // Add event listeners for checkboxes to handle changes
    document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const symptomName = event.target.getAttribute('data-symptom');
            if (event.target.checked) {
                addSelectedSymptom(symptomName);
            } else {
                removeSelectedSymptom(symptomName);
            }
        });
    });
}

// Function to add a symptom to the selected list
function addSelectedSymptom(symptomName) {
    if (!selectedSymptom_ids.includes(symptomName)) {
        selectedSymptom_ids.push(symptomName); 
        updateSelectedSymptom_idsUI(); 
    }
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName) {
    selectedSymptom_ids = selectedSymptom_ids.filter(symptom => symptom !== symptomName);
    updateSelectedSymptom_idsUI(); 
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedSymptom_idsUI() {
    const selectedSymptom_idsDiv = document.getElementById('selected-symptoms');
    
    if (selectedSymptom_ids.length === 0) {
        // If no symptoms are selected, show the default text
        selectedSymptom_idsDiv.innerHTML = "Selected Symptoms";
    } else {
        // Display the selected symptoms with "X" buttons
        selectedSymptom_idsDiv.innerHTML = selectedSymptom_ids.map(symptom => `
            <div class="selected-symptom">
                <button class="remove-symptom" data-symptom="${symptom}">x</button>
                ${symptom}
            </div>
        `).join('');
    }

    // Add event listeners for "X" buttons to remove symptoms and uncheck checkboxes
    document.querySelectorAll('.remove-symptom').forEach(button => {
        button.addEventListener('click', (event) => {
            const symptomToRemove = event.target.getAttribute('data-symptom');
            removeSelectedSymptom(symptomToRemove); 
            
            // Uncheck the associated checkbox if it exists
            const checkbox = document.getElementById(symptomToRemove);
            if (checkbox) {
                checkbox.checked = false;
            }
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

// Initialize the functionality
analyzeSymptoms();

