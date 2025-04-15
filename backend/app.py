from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.orm import Session
from collections import OrderedDict

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
        f"</ul>"
    )

#=============== GET ALL SYMPTOMS =================================================
# Route: Get all symptoms
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
# Route: Get all diseases
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
# Route: Get matches based on selected symptoms
@app.route('/api.01/matches', methods=['GET'])
def get_matches():
    session = Session(engine)
    try:
        # Capture selected symptoms from query parameters
        selected_symptoms = request.args.get('symptoms', "").split(',')
        
        if not selected_symptoms or selected_symptoms == ['']:
            return jsonify({"error": "No symptoms provided"}), 400

        # Join tables to fetch matches for selected symptoms
        matches_query = session.query(DiseaseSymptom, Diseases).join(
            Diseases,
            DiseaseSymptom.c.disease_id == Diseases.c.disease_id
        ).filter(DiseaseSymptom.c.s_name.in_(selected_symptoms)).all()

        if not matches_query:
            return jsonify({"error": "No matches found"}), 404

        # Aggregate matches
        matches = {}
        for row in matches_query:
            disease = row[1]
            symptom = row[0]
            if disease.d_name not in matches:
                matches[disease.d_name] = {
                    "d_name": disease.d_name,
                    "s_name": [],
                    "frequency": 0
                }
            matches[disease.d_name]["s_name"].append(symptom.s_name)
            matches[disease.d_name]["frequency"] += 1

        # Calculate probabilities
        total_frequency = sum(match["frequency"] for match in matches.values())
        matches_json = [
            {
                "d_name": match["d_name"],
                "s_name": match["s_name"],
                "probability": f"{(match['frequency'] / total_frequency) * 100:.2f}%"
            }
            for match in matches.values()
        ]
    except Exception as e:
        return jsonify({"error": "Database Error", "message": str(e)}), 500
    finally:
        session.close()

    return jsonify({"matches": matches_json}), 200

if __name__ == '__main__':
    app.run(debug=True)
