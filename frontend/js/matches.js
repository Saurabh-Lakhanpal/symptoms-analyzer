// matches.js

// Function to fetch matching diseases based on selected symptoms
async function fetchMatches(selectedSymptoms) {
    const matchesUrl = `${window.baseUrl}/api.01/matches?symptoms=${selectedSymptoms.join(',')}`; // Create API URL with selected symptoms
    try {
        const response = await fetch(matchesUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.matches; // Returns the list of matches
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
}

// Function to populate the Related Symptoms sections with checkboxes in list format
function populateRelatedSymptoms(matches) {
    const relatedSymptoms1 = document.getElementById('related-symptoms-1');
    const relatedSymptoms2 = document.getElementById('related-symptoms-2');
    const relatedSymptoms3 = document.getElementById('related-symptoms-3');

    // Clear previous content
    relatedSymptoms1.innerHTML = "Related Symptoms :<ul></ul>";
    relatedSymptoms2.innerHTML = "Related Symptoms :<ul></ul>";
    relatedSymptoms3.innerHTML = "Related Symptoms :<ul></ul>";

    // Helper function to create checkboxes dynamically within a list
    function createCheckbox(symptomName) {
        return `
            <li>
                <input 
                    type="checkbox" 
                    class="symptom-checkbox" 
                    id="${symptomName}" 
                    data-symptom="${symptomName}" 
                    ${selectedSymptoms.includes(symptomName) ? 'checked' : ''}
                >
                <label for="${symptomName}">${symptomName}</label>
            </li>
        `;
    }

    // Populate first set of related symptoms
    if (matches[0]) {
        const list1 = matches[0].Sname.map(createCheckbox).join('');
        relatedSymptoms1.querySelector('ul').innerHTML += list1;
    }

    // Populate second set of related symptoms
    if (matches[1]) {
        const list2 = matches[1].Sname.map(createCheckbox).join('');
        relatedSymptoms2.querySelector('ul').innerHTML += list2;
    }

    // Populate third set of related symptoms
    if (matches[2]) {
        const list3 = matches[2].Sname.map(createCheckbox).join('');
        relatedSymptoms3.querySelector('ul').innerHTML += list3;
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
    if (!selectedSymptoms.includes(symptomName)) {
        selectedSymptoms.push(symptomName); // Add symptom to the global array
        updateSelectedSymptomsUI(); // Update the UI
    }
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName) {
    selectedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomName);
    updateSelectedSymptomsUI(); // Update the UI
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedSymptomsUI() {
    const selectedSymptomsDiv = document.getElementById('selected-symptoms');
    
    if (selectedSymptoms.length === 0) {
        // If no symptoms are selected, show the default text
        selectedSymptomsDiv.innerHTML = "Selected Symptoms";
    } else {
        // Display the selected symptoms with "X" buttons
        selectedSymptomsDiv.innerHTML = selectedSymptoms.map(symptom => `
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
            removeSelectedSymptom(symptomToRemove); // Remove symptom from the global array
            
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
        if (selectedSymptoms.length === 0) {
            alert("Please select at least one symptom to analyze.");
            return;
        }

        const matches = await fetchMatches(selectedSymptoms); // Fetch matches using selected symptoms
        populateRelatedSymptoms(matches); // Populate the "Related Symptoms" sections
    });
}

// Initialize the functionality
analyzeSymptoms();
