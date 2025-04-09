from flask import Flask, jsonify, request
from flask_cors import CORS

# Flask Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Sample symptoms data
symptoms_data = {
    "symptoms": [
        {"symptomID": "C0008031", "Sname": "Pain Chest"},
        {"symptomID": "C0392680", "Sname": "Shortness of Breath"},
        {"symptomID": "C0012833", "Sname": "Dizziness"},
        {"symptomID": "C0004093", "Sname": "Asthenia"},
        {"symptomID": "C0085639", "Sname": "Fall"},
        {"symptomID": "C0039070", "Sname": "Syncope"},
        {"symptomID": "C0042571", "Sname": "Vertigo"},
        {"symptomID": "C0038990", "Sname": "Sweating Increased"},
        {"symptomID": "C0030252", "Sname": "Palpitation"},
        {"symptomID": "C0027497", "Sname": "Nausea"},
        {"symptomID": "C0002962", "Sname": "Angina Pectoris"},
        {"symptomID": "C0438716", "Sname": "Pressure Chest"},
        {"symptomID": "C0032617", "Sname": "Polyuria"},
        {"symptomID": "C0085602", "Sname": "Polydypsia"},
        {"symptomID": "C0085619", "Sname": "Orthopnea"},
        {"symptomID": "C0034642", "Sname": "Rale"},
        {"symptomID": "C0241526", "Sname": "Unresponsiveness"},
        {"symptomID": "C0856054", "Sname": "Mental Status Changes"},
        {"symptomID": "C0042963", "Sname": "Vomiting"},
        {"symptomID": "C0553668", "Sname": "Labored Breathing"},
        {"symptomID": "C0424000", "Sname": "Feeling Suicidal"},
        {"symptomID": "C0438696", "Sname": "Suicidal"},
        {"symptomID": "C0233762", "Sname": "Hallucinations Auditory"},
        {"symptomID": "C0150041", "Sname": "Feeling Hopeless"},
        {"symptomID": "C0424109", "Sname": "Weepiness"},
        {"symptomID": "C0917801", "Sname": "Sleeplessness"},
        {"symptomID": "C0424230", "Sname": "Motor Retardation"},
        {"symptomID": "C0022107", "Sname": "Irritable Mood"},
        {"symptomID": "C0312422", "Sname": "Blackout"}
    ]
}

# Sample matches data
matches_data = {
    "matches": [
        {
            "Dname": "Hypertensive Disease",
            "Sname": ["Pain Chest", "Shortness of Breath", "Dizziness", "Asthenia", "Fall", "Syncope", "Vertigo", "Sweating Increased", "Palpitation", "Nausea", "Angina Pectoris", "Pressure Chest"],
            "frequency": 3363
        },
        {
            "Dname": "Diabetes",
            "Sname": ["Polyuria", "Polydypsia", "Shortness of Breath", "Pain Chest", "Asthenia", "Nausea", "Orthopnea", "Rale", "Sweating Increased", "Unresponsiveness", "Mental Status Changes", "Vertigo", "Vomiting", "Labored Breathing"],
            "frequency": 1421
        },
        {
            "Dname": "Depression",
            "Sname": ["Feeling Suicidal", "Suicidal", "Hallucinations Auditory", "Feeling Hopeless", "Weepiness", "Sleeplessness", "Motor Retardation", "Irritable Mood", "Blackout"],
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
        if any(symptom in selected_symptoms for symptom in match["Sname"])
    ]

    return jsonify({"matches": filtered_matches})

if __name__ == '__main__':
    app.run(debug=True)
