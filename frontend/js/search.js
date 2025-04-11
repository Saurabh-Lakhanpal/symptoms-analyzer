// search.js

// Global variable to store selected symptoms
let selectedSymptoms = [];

// Asynchronous function for fetching symptoms from the API
async function fetchSymptoms(searchTerm) {
    const searchUrl = `${window.baseUrl}/api.01/symptoms`;
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.symptoms.filter(symptom =>
            symptom.s_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } catch (error) {
        console.error("Error fetching symptoms:", error);
        return [];
    }
}

// Function to display autocomplete suggestions with checkboxes
function showSuggestions(suggestions) {
    const searchBox = document.getElementById('search');
    let suggestionBox = document.getElementById('suggestions');

    // Create suggestionBox if it doesn't exist
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.setAttribute('id', 'suggestions');
        searchBox.parentElement.appendChild(suggestionBox);
    }

    suggestionBox.style.position = 'absolute';
    suggestionBox.style.top = `${searchBox.offsetTop + searchBox.offsetHeight}px`;
    suggestionBox.style.left = `${searchBox.offsetLeft}px`;
    suggestionBox.style.width = `${searchBox.offsetWidth}px`;
    suggestionBox.style.backgroundColor = 'white';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.borderRadius = '5px';
    suggestionBox.style.zIndex = '1000';

    // Populate suggestions with checkboxes
    suggestionBox.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <input type="checkbox" id="${suggestion.symptom_id}" class="symptom-checkbox" 
                   data-symptom="${suggestion.s_name}" ${selectedSymptoms.includes(suggestion.s_name) ? 'checked' : ''}>
            <label for="${suggestion.symptom_id}">${suggestion.s_name}</label>
        </div>
    `).join('');

    // Add event listeners for checkboxes
    suggestionBox.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
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

// Function to clear existing suggestions
function clearSuggestions() {
    const existingSuggestions = document.getElementById('suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}

// Function to add a symptom to the selected list
function addSelectedSymptom(symptomName) {
    if (!selectedSymptoms.includes(symptomName)) {
        selectedSymptoms.push(symptomName); 
        updateSelectedSymptomsUI(); 
    }
}

// Function to remove a symptom from the selected list
function removeSelectedSymptom(symptomName) {
    selectedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomName);
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
        selectedSymptomsDiv.innerHTML = selectedSymptoms.map(symptom => `
            <div class="selected-symptom">
                <button class="remove-symptom" data-symptom="${symptom}">x</button>
                ${symptom}
            </div>
        `).join('');
    }

    // Add event listeners for "X" buttons to remove symptoms
    document.querySelectorAll('.remove-symptom').forEach(button => {
        button.addEventListener('click', (event) => {
            const symptomToRemove = event.target.getAttribute('data-symptom');
            removeSelectedSymptom(symptomToRemove); 
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