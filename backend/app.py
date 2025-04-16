from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model  # Import for loading the model

# PostgreSQL Database Setup
db_params = {
    'dbname': 'disease_symptom_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}
connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
engine = create_engine(connection_string)
metadata = MetaData()
metadata.reflect(bind=engine)  # Automatically load table metadata

# Map the tables
Symptoms = Table('symptoms_tb', metadata, autoload_with=engine)
Diseases = Table('diseases_tb', metadata, autoload_with=engine)
DiseaseSymptom = Table('disease_symptom_tb', metadata, autoload_with=engine)

# Flask Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load scaler globally
with open(r'C:\Users\Saurabh Lakhanpal\OneDrive\DA-UofT\UofTSubmissions\Module-23-24-Challenge-Project 4\symptoms-analyzer\backend\models\scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Load binary_features globally
with open(r'C:\Users\Saurabh Lakhanpal\OneDrive\DA-UofT\UofTSubmissions\Module-23-24-Challenge-Project 4\symptoms-analyzer\backend\models\binary_features.pkl', 'rb') as f:
    binary_features = pickle.load(f)

# Load the trained model globally
model = load_model(r'C:\Users\Saurabh Lakhanpal\OneDrive\DA-UofT\UofTSubmissions\Module-23-24-Challenge-Project 4\symptoms-analyzer\backend\models\disease_prediction_model.h5')

# Dynamically recreate disease_symptom_hotcoded
session = Session(engine)
try:
    # Query symptom_disease_tb for disease-symptom mapping
    symptom_disease_data = session.query(DiseaseSymptom).all()

    # Convert to DataFrame
    symptom_disease_df = pd.DataFrame([
        {"disease_id": item.disease_id, "symptom_id": item.symptom_id}
        for item in symptom_disease_data
    ])

    # One-hot encode symptoms and group by disease_id
    binary_features = pd.get_dummies(symptom_disease_df['symptom_id'])
    disease_symptom_hotcoded = pd.concat(
        [symptom_disease_df['disease_id'], binary_features],
        axis=1
    ).groupby('disease_id').sum().reset_index()
finally:
    session.close()

# Error Handlers
@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({"error": "Bad Request", "message": str(error)}), 400

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Not Found", "message": str(error)}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500

#=============== API PAGE =========================================================
@app.route("/")
def welcome():
    return (
        f"<h2>Available Routes:</h2>"
        f"<ul>"
        f"<li><a href='/api.01/symptoms'>/api.01/symptoms</a> - Get all symptoms</li>"
        f"<li><a href='/api.01/diseases'>/api.01/diseases</a> - Get all diseases</li>"
        f"<li><a href='/api.01/matches?symptom_ids=C0085593,C0746619,C0030193,C0004093,C0004604'>"
        f"/api.01/matches</a> - Get matching diseases based on selected symptoms (example query included)</li>"
        f"</ul>"
    )

#=============== GET ALL SYMPTOMS =================================================
@app.route('/api.01/symptoms', methods=['GET'])
def get_symptoms():
    session = Session(engine)
    try:
        # Query all symptoms
        results = session.query(Symptoms).all()

        if not results:
            return jsonify({"error": "No symptoms found"}), 404

        # Format the response
        symptoms = [
            {"symptom_id": symptom.symptom_id, "s_name": symptom.s_name}
            for symptom in results
        ]
    except Exception as e:
        return jsonify({"error": "Database Error", "message": str(e)}), 500
    finally:
        session.close()

    return jsonify({"symptoms": symptoms}), 200

#=============== GET ALL DISEASES =================================================
@app.route('/api.01/diseases', methods=['GET'])
def get_diseases():
    session = Session(engine)
    try:
        # Query all diseases
        results = session.query(Diseases).all()

        if not results:
            return jsonify({"error": "No diseases found"}), 404

        # Format the response
        diseases = [
            {"disease_id": disease.disease_id, "d_name": disease.d_name, "description": disease.description}
            for disease in results
        ]
    except Exception as e:
        return jsonify({"error": "Database Error", "message": str(e)}), 500
    finally:
        session.close()

    return jsonify({"diseases": diseases}), 200

#=============== GET ALL MATCHES =================================================
@app.route('/api.01/matches', methods=['GET'])
def matches():
    session = Session(engine)  # Create a new session for each request
    try:
        # Extract selectedSymptom_ids from query parameters
        selectedSymptom_ids = request.args.get('symptom_ids')
        if not selectedSymptom_ids:
            return jsonify({"error": "No symptoms provided", "message": "Provide symptoms as a comma-separated list in the query string"}), 400

        # Parse the symptom IDs from the query string
        selectedSymptom_ids = selectedSymptom_ids.split(',')

        # Lookup symptom names for the selected symptom IDs
        symptom_names = []
        for symptom_id in selectedSymptom_ids:
            result = session.query(Symptoms).filter_by(symptom_id=symptom_id).first()
            if result:
                symptom_names.append(result.s_name)

        # Prepare the test input for the model
        test_input = pd.DataFrame([{symptom_id: 1 for symptom_id in selectedSymptom_ids}], columns=binary_features).fillna(0)
        test_input_scaled = scaler.transform(test_input)

        # Predict using the trained model
        probabilities = model.predict(test_input_scaled)
        top_indices = np.argsort(probabilities[0])[-3:][::-1]  # Top 3 probabilities

        # Retrieve disease details for top predictions
        matches_response = []
        for index in top_indices:
            # Get the disease ID based on prediction index
            disease_id = disease_symptom_hotcoded.iloc[index]['disease_id']

            # Lookup disease details from the database
            disease_result = session.query(Diseases).filter_by(disease_id=disease_id).first()
            if disease_result:
                # Lookup associated symptoms for this disease
                associated_symptoms = session.query(DiseaseSymptom).filter_by(disease_id=disease_id).all()
                symptom_list = [symptom.s_name for symptom in associated_symptoms]

                # Build match entry
                matches_response.append({
                    "d_name": disease_result.d_name,
                    "description": disease_result.Description,  # Include disease description
                    "s_name": symptom_list,
                    "probability": f"{probabilities[0][index] * 100:.2f}%"
                })

    except Exception as e:
        return jsonify({"error": "Error generating matches", "message": str(e)}), 500
    finally:
        session.close()  # Always close the session

    return jsonify({"matches": matches_response}), 200


if __name__ == '__main__':
    app.run(debug=True)
