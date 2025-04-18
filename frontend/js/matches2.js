// matches2.js

// Function to fetch matching diseases based on selected symptoms
async function fetchMatches(selectedSymptom_ids) {
    // Construct API call using selectedSymptom_ids
    const matchesUrl = `${window.baseUrl}/api.01/matches?symptom_ids=${selectedSymptom_ids.join(',')}`;
    console.log("API call constructed:", matchesUrl); // Log the constructed API call

    try {
        // Send a GET request to the API to fetch matches
        const response = await fetch(matchesUrl);
        if (!response.ok) {
            // Throw an error if the HTTP response status is not OK
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response JSON data
        const data = await response.json();
        console.log("Fetched matches:", data.matches); // Log the fetched matches
        return data.matches; // Return the matches from the response
    } catch (error) {
        // Log any errors encountered during the API call
        console.error("Error fetching matches:", error);
        return []; // Return an empty array if there's an error
    }
}

// Function to populate the Related Symptoms sections with checkboxes
function populateRelatedSymptoms(matches) {
    // Get the HTML elements for the related symptoms sections
    const relatedSymptoms1 = document.getElementById('related-symptoms-1');
    const relatedSymptoms2 = document.getElementById('related-symptoms-2');
    const relatedSymptoms3 = document.getElementById('related-symptoms-3');

    // Clear previous content in the related symptoms sections
    relatedSymptoms1.innerHTML = "Related Symptoms: ";
    relatedSymptoms2.innerHTML = "Related Symptoms: ";
    relatedSymptoms3.innerHTML = "Related Symptoms: ";

    // Helper function to create a checkbox for a symptom name
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

    // Populate first set of related symptoms if matches[0] exists
    if (matches[0]) {
        const list1 = matches[0].s_name.map(createCheckbox).join(' '); // Generate checkboxes
        relatedSymptoms1.innerHTML += `<br>${list1}`; // Add them to the section
    }

    // Populate second set of related symptoms if matches[1] exists
    if (matches[1]) {
        const list2 = matches[1].s_name.map(createCheckbox).join(' '); // Generate checkboxes
        relatedSymptoms2.innerHTML += `<br>${list2}`; // Add them to the section
    }

    // Populate third set of related symptoms if matches[2] exists
    if (matches[2]) {
        const list3 = matches[2].s_name.map(createCheckbox).join(' '); // Generate checkboxes
        relatedSymptoms3.innerHTML += `<br>${list3}`; // Add them to the section
    }

    // Add event listeners to the checkboxes to handle user interactions
    document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            // Get the symptom name from the checkbox's data attribute
            const symptomName = event.target.getAttribute('data-symptom');
            if (event.target.checked) {
                // Add the symptom if the checkbox is checked
                addSelectedSymptom(symptomName);
            } else {
                // Remove the symptom if the checkbox is unchecked
                removeSelectedSymptom(symptomName);
            }
        });
    });
}
//===============================================================================
// Function to add a symptom to the selected list
function addSelectedSymptom(symptomName) {
    // Check if the symptom is not already in the selectedSymptom_ids array
    if (!selectedSymptom_ids.includes(symptomName)) {
        // Add the symptom name to the array
        selectedSymptom_ids.push(symptomName);
        console.log('Added to selectedSymptom_ids:', selectedSymptom_ids); // Log the addition
        updateSelectedSymptom_idsUI(); // Update the UI to reflect the change
    }
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName) {
    // Filter out the symptom name from the selectedSymptom_ids array
    selectedSymptom_ids = selectedSymptom_ids.filter(symptom => symptom !== symptomName);
    console.log('Removed from selectedSymptom_ids:', selectedSymptom_ids); // Log the removal
    updateSelectedSymptom_idsUI(); // Update the UI to reflect the change
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedSymptom_idsUI() {
    // Get the HTML element for displaying selected symptoms
    const selectedSymptom_idsDiv = document.getElementById('selected-symptoms');

    if (selectedSymptom_ids.length === 0) {
        // If no symptoms are selected, show the default text
        selectedSymptom_idsDiv.innerHTML = "Selected Symptoms";
    } else {
        // Display the selected symptoms with "X" buttons to remove them
        selectedSymptom_idsDiv.innerHTML = selectedSymptom_ids.map(symptom => `
            <div class="selected-symptom">
                <button class="remove-symptom" data-symptom="${symptom}">x</button>
                ${symptom}
            </div>
        `).join('');
    }

    // Add event listeners to the "X" buttons to handle user interactions
    document.querySelectorAll('.remove-symptom').forEach(button => {
        button.addEventListener('click', (event) => {
            // Get the symptom name to remove from the button's data attribute
            const symptomToRemove = event.target.getAttribute('data-symptom');
            removeSelectedSymptom(symptomToRemove);

            // Uncheck the corresponding checkbox if it exists
            const checkbox = document.getElementById(symptomToRemove);
            if (checkbox) {
                checkbox.checked = false;
            }
        });
    });
}
//==================================================================================================
// Function to handle the "Analyze" button click
async function analyzeSymptoms() {
    // Get the HTML element for the "Analyze" button
    const analyzeButton = document.getElementById('cta');
    analyzeButton.addEventListener('click', async () => {
        // Show an alert if no symptoms are selected
        if (selectedSymptom_ids.length === 0) {
            alert("Please select at least one symptom to analyze.");
            return;
        }

        // Fetch matches based on the selected symptoms
        const matches = await fetchMatches(selectedSymptom_ids);
        // Populate the related symptoms sections with the fetched matches
        populateRelatedSymptoms(matches);
    });
}

// Initialize the functionality by setting up event listeners
analyzeSymptoms();
