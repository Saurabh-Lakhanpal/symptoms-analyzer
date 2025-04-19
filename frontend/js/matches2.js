// matches2.js

async function fetchMatches(selectedSymptom_ids) {
    const matchesUrl = `${window.baseUrl}/api.01/matches?symptom_ids=${selectedSymptom_ids.join(',')}`;
    console.log("API call constructed:", matchesUrl);

    try {
        const response = await fetch(matchesUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Matches API Response:", data.matches); // Debugging log
        return data.matches;
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
}

function populateRelatedSymptoms(matches) {
    console.log("Matches Data for UI Rendering:", matches); // Debugging log

    const relatedSymptoms1 = document.getElementById('related-symptoms-1');
    const relatedSymptoms2 = document.getElementById('related-symptoms-2');
    const relatedSymptoms3 = document.getElementById('related-symptoms-3');

    relatedSymptoms1.innerHTML = "Related Symptoms:";
    relatedSymptoms2.innerHTML = "Related Symptoms:";
    relatedSymptoms3.innerHTML = "Related Symptoms:";

    function createCheckbox(symptom) {
        return `
            <input type="checkbox" class="related-checkbox"
                id="${symptom.symptom_id}" data-symptom-name="${symptom.s_name}"
                ${selectedSymptom_ids.includes(symptom.symptom_id) ? 'checked' : ''}>
            <label for="${symptom.symptom_id}">${symptom.s_name}</label>
        `;
    }

    if (matches[0] && matches[0].symptoms.length > 0) {
        relatedSymptoms1.innerHTML += `<br>${matches[0].symptoms.map(createCheckbox).join(' ')}`;
    }

    if (matches[1] && matches[1].symptoms.length > 0) {
        relatedSymptoms2.innerHTML += `<br>${matches[1].symptoms.map(createCheckbox).join(' ')}`;
    }

    if (matches[2] && matches[2].symptoms.length > 0) {
        relatedSymptoms3.innerHTML += `<br>${matches[2].symptoms.map(createCheckbox).join(' ')}`;
    }

    document.querySelectorAll('.related-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const symptom_id = event.target.id;
            const symptom_name = event.target.getAttribute('data-symptom-name');
    
            if (event.target.checked) {
                if (!selectedSymptom_ids.includes(symptom_id)) {
                    addSelectedSymptom(symptom_name, symptom_id);
                }
            } else {
                // 🟢 If unchecking a related symptom, remove it from the left list
                removeSelectedSymptom(symptom_name, symptom_id);
            }
        });
    });
}

function populateDiseaseData(matches) {
    console.log("Rendering Disease Data:", matches); // Debugging log

    const diseaseDescription1 = document.getElementById('disease-description-1');
    const diseaseDescription2 = document.getElementById('disease-description-2');
    const diseaseDescription3 = document.getElementById('disease-description-3');

    const symptomsBox1 = document.getElementById('symptoms-box-1');
    const symptomsBox2 = document.getElementById('symptoms-box-2');
    const symptomsBox3 = document.getElementById('symptoms-box-3');

    if (matches[0]) {
        diseaseDescription1.innerHTML = `<div style="font-size: 12px; font-weight: bold; text-align: center;">Match: ${matches[0].probability}</div>`;
        symptomsBox1.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; text-align: center;">${matches[0].d_name}</div>
            <br> <!-- Add spacing -->
            <div style="font-size: 18px; text-align: center;">${matches[0].description.join(', ')}</div>
        `;
    }

    if (matches[1]) {
        diseaseDescription2.innerHTML = `<div style="font-size: 12px; font-weight: bold; text-align: center;">Match: ${matches[1].probability}</div>`;
        symptomsBox2.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; text-align: center;">${matches[1].d_name}</div>
            <br> <!-- Add spacing -->
            <div style="font-size: 18px; text-align: center;">${matches[1].description.join(', ')}</div>
        `;
    }

    if (matches[2]) {
        diseaseDescription3.innerHTML = `<div style="font-size: 12px; font-weight: bold; text-align: center;">Match: ${matches[2].probability}</div>`;
        symptomsBox3.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; text-align: center;">${matches[2].d_name}</div>
            <br> <!-- Add spacing -->
            <div style="font-size: 18px; text-align: center;">${matches[2].description.join(', ')}</div>
        `;
    }
}

// Function to handle the "Analyze" button click
document.getElementById('cta').addEventListener('click', async () => {
    if (selectedSymptom_ids.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    console.log("Current Selected Symptoms:", selectedSymptom_ids);
    const matches = await fetchMatches(selectedSymptom_ids);
    populateRelatedSymptoms(matches);
    populateDiseaseData(matches);
});