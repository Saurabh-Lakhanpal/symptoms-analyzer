from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.orm import Session, declarative_base
from collections import OrderedDict
import json

# Database Setup
db_params = {
    'dbname': 'disease_symptom_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
engine = create_engine(connection_string)
Base = declarative_base()
metadata = MetaData()

# Explicitly declare tables
Symptoms = Table('symptoms_tb', metadata, autoload_with=engine)
Diseases = Table('diseases_tb', metadata, autoload_with=engine)

# Flask Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Error Handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "message": str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": str(error)}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500

@app.route("/")
def welcome():
    return (
        f"<h2>Available Routes:</h2>"
        f"<ul>"
        f"<li><a href='/api.01/symptoms'>/api.01/symptoms</a> - Get all symptoms</li>"
        f"<li><a href='/api.01/diseases'>/api.01/diseases</a> - Get all diseases</li>"
        f"</ul>"
    )

@app.route("/api.01/symptoms")
def get_symptoms():
    session = Session(engine)
    try:
        results = session.query(Symptoms).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    symptoms_list = []
    for s in results:
        s_dict = OrderedDict({
            "symptom_id": s.symptom_id,
            "s_name": s.s_name
        })
        symptoms_list.append(s_dict)

    return app.response_class(
        response=json.dumps(symptoms_list, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api.01/diseases")
def get_diseases():
    session = Session(engine)
    try:
        results = session.query(Diseases).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    diseases_list = []
    for d in results:
        d_dict = OrderedDict({
            "disease_id": d.disease_id,
            "d_name": d.d_name,
            "description": d.description
        })
        diseases_list.append(d_dict)

    return app.response_class(
        response=json.dumps(diseases_list, sort_keys=False),
        mimetype='application/json'
    )

if __name__ == '__main__':
    app.run(debug=True)
