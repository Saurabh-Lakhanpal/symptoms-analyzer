from flask import Flask, jsonify, request
from flask_cors import CORS

# Flask Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Sample symptoms data
symptoms_data = {
    "symptoms": [
        {"symptom_id": "C0008031", "s_name": "Pain Chest"},
        {"symptom_id": "C0392680", "s_name": "Shortness of Breath"},
        {"symptom_id": "C0012833", "s_name": "Dizziness"},
        {"symptom_id": "C0004093", "s_name": "Asthenia"},
        {"symptom_id": "C0085639", "s_name": "Fall"},
        {"symptom_id": "C0039070", "s_name": "Syncope"},
        {"symptom_id": "C0042571", "s_name": "Vertigo"},
        {"symptom_id": "C0038990", "s_name": "Sweating Increased"},
        {"symptom_id": "C0030252", "s_name": "Palpitation"},
        {"symptom_id": "C0027497", "s_name": "Nausea"},
        {"symptom_id": "C0002962", "s_name": "Angina Pectoris"},
        {"symptom_id": "C0438716", "s_name": "Pressure Chest"},
        {"symptom_id": "C0032617", "s_name": "Polyuria"},
        {"symptom_id": "C0085602", "s_name": "Polydypsia"},
        {"symptom_id": "C0085619", "s_name": "Orthopnea"},
        {"symptom_id": "C0034642", "s_name": "Rale"},
        {"symptom_id": "C0241526", "s_name": "Unresponsiveness"},
        {"symptom_id": "C0856054", "s_name": "Mental Status Changes"},
        {"symptom_id": "C0042963", "s_name": "Vomiting"},
        {"symptom_id": "C0553668", "s_name": "Labored Breathing"},
        {"symptom_id": "C0424000", "s_name": "Feeling Suicidal"},
        {"symptom_id": "C0438696", "s_name": "Suicidal"},
        {"symptom_id": "C0233762", "s_name": "Hallucinations Auditory"},
        {"symptom_id": "C0150041", "s_name": "Feeling Hopeless"},
        {"symptom_id": "C0424109", "s_name": "Weepiness"},
        {"symptom_id": "C0917801", "s_name": "Sleeplessness"},
        {"symptom_id": "C0424230", "s_name": "Motor Retardation"},
        {"symptom_id": "C0022107", "s_name": "Irritable Mood"},
        {"symptom_id": "C0312422", "s_name": "Blackout"}
    ]
}

# Sample matches data
matches_data = {
    "matches": [
        {
            "d_name": "Hypertensive Disease",
            "s_name": ["Pain Chest", "Shortness of Breath", "Dizziness", "Asthenia", "Fall", "Syncope", "Vertigo", "Sweating Increased", "Palpitation", "Nausea", "Angina Pectoris", "Pressure Chest"],
            "frequency": 3363
        },
        {
            "d_name": "Diabetes",
            "s_name": ["Polyuria", "Polydypsia", "Shortness of Breath", "Pain Chest", "Asthenia", "Nausea", "Orthopnea", "Rale", "Sweating Increased", "Unresponsiveness", "Mental Status Changes", "Vertigo", "Vomiting", "Labored Breathing"],
            "frequency": 1421
        },
        {
            "d_name": "Depression",
            "s_name": ["Feeling Suicidal", "Suicidal", "Hallucinations Auditory", "Feeling Hopeless", "Weepiness", "Sleeplessness", "Motor Retardation", "Irritable Mood", "Blackout"],
            "frequency": 1337
        }
    ]
}

# Route to serve the symptoms data
@app.route('/api.01/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify(symptoms_data)

# Route to serve matches based on selected symptoms
@app.route('/api.01/matches', methods=['GET'])
def get_matches():
    # Capture selected symptoms from the query parameter
    selected_symptoms = request.args.get('symptoms', "").split(',')

    # Filter matches based on selected symptoms (basic example)
    filtered_matches = [
        match for match in matches_data["matches"]
        if any(symptom in selected_symptoms for symptom in match["s_name"])
    ]

    return jsonify({"matches": filtered_matches})

if __name__ == '__main__':
    app.run(debug=True)
