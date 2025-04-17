from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import os

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
with open('backend/models/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Load binary_features globally
with open('backend/models/binary_features.pkl', 'rb') as f:
    binary_features = pickle.load(f)

# Load the trained model globally
model = load_model('backend/models/disease_prediction_model.h5')

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
    session = Session(engine)
    try:
        # Step 1: Extract selectedSymptom_ids from query parameters
        selectedSymptom_ids = request.args.get('symptom_ids')
        if not selectedSymptom_ids:
            return jsonify({"error": "No symptoms provided", "message": "Provide symptoms as a comma-separated list in the query string"}), 400

        selectedSymptom_ids = selectedSymptom_ids.split(',')
        print("Selected Symptom IDs:", selectedSymptom_ids)

        # Step 2: Query symptom names from the database
        symptom_names = []
        for symptom_id in selectedSymptom_ids:
            result = session.query(Symptoms).filter_by(symptom_id=symptom_id).first()
            if result:
                symptom_names.append(result.s_name)
            else:
                print(f"Symptom ID {symptom_id} not found.")
        print("Symptom Names:", symptom_names)

        # Step 3: Query the database table symptom_disease_tb and create symptom_disease_df
        input = pd.DataFrame([{symptom_id: 1 for symptom_id in selectedSymptom_ids}], columns=binary_features).fillna(0)
        print("Test Input DataFrame:\n", input.head())

        # Step 4: balance it, scale it, one hot code it
        input_scaled = scaler.transform(input)
        print("Scaled Test Input:\n", input_scaled)

        # Step 5: Predict disease probabilities from the model 
        probabilities = model.predict(input_scaled)
        print("Predicted Probabilities:", probabilities)

        # Step 6: Get top 3 indices based on predicted probabilities
        top_indices = np.argsort(probabilities[0])[-3:][::-1]
        print("Top Indices:", top_indices)
        print("Disease Symptom Hotcoded Shape:", disease_symptom_hotcoded.shape)

        # Step 7: Fetch matching diseases and their details
        matches_response = []
        for index in top_indices:
            if index >= len(disease_symptom_hotcoded):
                print(f"Index {index} is out of bounds for disease_symptom_hotcoded.")
                continue

            # Safely access rows and disease_id
            row = disease_symptom_hotcoded.iloc[index]
            if isinstance(row, pd.DataFrame):
                row = row.squeeze()
            print("Accessed Row:", row)
            disease_id = row['disease_id']
            print(f"Disease ID at index {index}: {disease_id}")

            # Query disease details
            disease_result = session.query(Diseases).filter_by(disease_id=disease_id).first()
            if disease_result:
                associated_symptoms = session.query(DiseaseSymptom).filter_by(disease_id=disease_id).all()
                symptom_list = [session.query(Symptoms).filter_by(symptom_id=s.symptom_id).first().s_name for s in associated_symptoms]
                print(f"Associated Symptoms for Disease ID {disease_id}: {symptom_list}")

                # Build match entry
                matches_response.append({
                    "d_name": disease_result.d_name,
                    "description": [disease_result.description],
                    "s_name": symptom_list,
                    "probability": f"{probabilities[0][index] * 100:.2f}%"
                })

        # Step 8: Handle case where no matches are found
        if not matches_response:
            return jsonify({"error": "No matches found", "message": "No diseases match the provided symptoms."}), 404

    except Exception as e:
        print("Error encountered:", str(e))
        return jsonify({"error": "Error generating matches", "message": str(e)}), 500
    finally:
        session.close()

    # Step 9: Return successful matches response
    return jsonify({"matches": matches_response}), 200


if __name__ == '__main__':
    app.run(debug=True)