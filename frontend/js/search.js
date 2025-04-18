// search.js

// Global variable to store selected symptoms and their IDs
let selectedSymptoms = [];
let selectedSymptom_ids = [];

// Asynchronous function for fetching symptoms from the API
async function fetchSymptoms(searchTerm) {
    const searchUrl = `${window.baseUrl}/api.01/symptoms`;

    try {
        // Send a GET request to fetch data from the API
        const response = await fetch(searchUrl);
        if (!response.ok) {
            // Throw an error if the HTTP response status is not OK
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response JSON data
        const data = await response.json();

        // Filter the symptoms based on the search term
        const filteredSymptoms = data.symptoms.filter(symptom =>
            symptom.s_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Add a console log to display the filtered results
        console.log("Filtered Symptoms:", filteredSymptoms);

        return filteredSymptoms;
    } catch (error) {
        // Log any errors encountered during the API call
        console.error("Error fetching symptoms:", error);
        return []; // Return an empty array if there's an error
    }
}


// Function to display autocomplete suggestions with checkboxes
function showSuggestions(suggestions) {
    // Log the incoming suggestions to debug filtering and data handling
    console.log("Suggestions passed to showSuggestions:", suggestions);

    const searchBox = document.getElementById('search');
    let suggestionBox = document.getElementById('suggestions');

    // Create suggestionBox if it doesn't exist
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.setAttribute('id', 'suggestions');
        searchBox.parentElement.appendChild(suggestionBox);
    }

    // Style the suggestion box to position it below the search box
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.top = `${searchBox.offsetTop + searchBox.offsetHeight}px`;
    suggestionBox.style.left = `${searchBox.offsetLeft}px`;
    suggestionBox.style.width = `${searchBox.offsetWidth}px`;
    suggestionBox.style.backgroundColor = 'white';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.borderRadius = '5px';
    suggestionBox.style.zIndex = '1000';
    suggestionBox.style.maxHeight = '200';
    suggestionBox.style.overflowY = 'auto';

    // Populate suggestions with checkboxes
    suggestionBox.innerHTML = suggestions.map(suggestion => {
        // Log each suggestion before adding it to the DOM
        console.log("Creating checkbox for suggestion:", suggestion);

        return `
            <div class="suggestion-item">
                <input type="checkbox" id="${suggestion.symptom_id}" class="symptom-checkbox" 
                       data-symptom="${suggestion.s_name}" data-symptom-id="${suggestion.symptom_id}" 
                       ${selectedSymptoms.includes(suggestion.s_name) ? 'checked' : ''}>
                <label for="${suggestion.symptom_id}">${suggestion.s_name}</label>
            </div>
        `;
    }).join('');

    // Add event listeners for checkboxes
    suggestionBox.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            // Log the checkbox being interacted with
            console.log("Checkbox interaction:", {
                isChecked: event.target.checked,
                symptomName: event.target.getAttribute('data-symptom'),
                symptomID: event.target.getAttribute('data-symptom-id')
            });

            const symptomName = event.target.getAttribute('data-symptom');
            const symptom_id = event.target.getAttribute('data-symptom-id');
            if (event.target.checked) {
                // Log before adding to the global variables
                console.log("Adding to selectedSymptoms and selectedSymptom_ids:", {
                    symptomName,
                    symptom_id
                });
                addSelectedSymptom(symptomName, symptom_id);
            } else {
                // Log before removing from the global variables
                console.log("Removing from selectedSymptoms and selectedSymptom_ids:", {
                    symptomName,
                    symptom_id
                });
                removeSelectedSymptom(symptomName, symptom_id);
            }
        });
    });
}


// Function to clear existing suggestions
function clearSuggestions() {
    const existingSuggestions = document.getElementById('suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}

// Function to add a symptom to the selected list
function addSelectedSymptom(symptomName, symptom_id) {
    if (!selectedSymptoms.includes(symptomName)) {
        selectedSymptoms.push(symptomName);
    }
    if (!selectedSymptom_ids.includes(symptom_id)) {
        selectedSymptom_ids.push(symptom_id);
    }

    // Log the updated arrays
    console.log("Added Symptom Name:", symptomName);
    console.log("Added Symptom ID:", symptom_id);
    console.log("Selected Symptoms Array:", selectedSymptoms);
    console.log("Selected Symptom IDs Array:", selectedSymptom_ids);

    updateSelectedSymptomsUI();
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName, symptom_id) {
    selectedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomName);
    selectedSymptom_ids = selectedSymptom_ids.filter(id => id !== symptom_id);

    // Log the updated arrays
    console.log("Removed Symptom Name:", symptomName);
    console.log("Removed Symptom ID:", symptom_id);
    console.log("Selected Symptoms Array After Removal:", selectedSymptoms);
    console.log("Selected Symptom IDs Array After Removal:", selectedSymptom_ids);

    updateSelectedSymptomsUI();
}

// Function to update the "Selected Symptoms" section dynamically
function updateSelectedSymptomsUI() {
    const selectedSymptomsDiv = document.getElementById('selected-symptoms');

    if (selectedSymptoms.length === 0) {
        // If no symptoms are selected, show the default text
        selectedSymptomsDiv.innerHTML = "Selected Symptoms";
    } else {
        // Display the selected symptoms with "X" buttons
        selectedSymptomsDiv.innerHTML = selectedSymptoms.map((symptom, index) => `
            <div class="selected-symptom">
                <button class="remove-symptom" data-symptom="${symptom}" data-symptom-id="${selectedSymptom_ids[index]}">x</button>
                ${symptom}
            </div>
        `).join('');
    }

    // Add event listeners for "X" buttons to remove symptoms
    document.querySelectorAll('.remove-symptom').forEach(button => {
        button.addEventListener('click', (event) => {
            const symptomToRemove = event.target.getAttribute('data-symptom');
            const symptom_idToRemove = event.target.getAttribute('data-symptom-id');
            removeSelectedSymptom(symptomToRemove, symptom_idToRemove);
        });
    });
}

// Event listener for search input
document.getElementById('search').addEventListener('input', async (event) => {
    const searchTerm = event.target.value;
    if (searchTerm.length > 1) {
        const suggestions = await fetchSymptoms(searchTerm);
        showSuggestions(suggestions);
    } else {
        clearSuggestions();
    }
});

// Function to close dropdown and clear search input when clicking outside
function handleOutsideClick(event) {
    const suggestionBox = document.getElementById('suggestions');
    const searchBox = document.getElementById('search');

    if (suggestionBox && !suggestionBox.contains(event.target) && event.target !== searchBox) {
        clearSuggestions();
        searchBox.value = "";
    }
}

// Add event listener for clicks anywhere in the document
document.addEventListener('click', handleOutsideClick);
