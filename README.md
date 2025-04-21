# Symptom Analyzer

> A Machine Learning Model for Predicting Diseases Based on Symptoms.

![webapp](https://github.com/user-attachments/assets/4b78eb60-a55a-4352-afa0-3e20a83164d4)

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Dataset](#dataset)
- [Requirements](#requirements)
- [Project Team](#project-team)
- [Project Presentation](#project-presentation)

---

### Overview
This project aims to build a machine learning model that predicts potential diseases based on a set of symptoms provided by the user. By leveraging the DiseaseSymptom Knowledge Base (DSKB) dataset, we will create a predictive tool that uses supervised learning algorithms to make disease predictions with a high degree of accuracy.

The main purpose of this project is to provide users with a more accurate and reliable disease prediction tool compared to generic online searches (e.g., Google). By offering evidence-based predictions, the model aims to reduce patient anxiety caused by inaccurate or overly broad search results, thereby improving user confidence and promoting better health outcomes.

---

## Technologies Used

1. **Machine Learning Library:** Scikit-learn, pickle and tensorflow (Python) to build a dense neural network designed for multiclass classification. It has three hidden layers with ReLU activation, batch normalization, and dropout for regularization, and uses softmax for the output layer with Adam optimization.
2. **Data Manipulation & Storage:** Pandas, numpy, sqlalchemy, SQL
3. **Backend & API Development:** Flask, CORS.
4. **Frontend Interface:** HTML/CSS/JavaScript
5. **File Formats & Data Storage:** HDF5, pkl and csv
6. **Version Control:** GitHub
7. **Collaboration Tool:** Google collab

---

### Features

- Search for disease symptoms among a list of 407 symptoms.
- Analyze the symptoms using a Machine Learning Neural network model to get top 3 disease matches with probability %.
- Get related symptoms for matched diseases, further select from them and re-analyze.

---

### Getting Started

- Clone this repository.
- Execute requitments.txt
- Run etl.ipynb.
- Run mock_training_data.ipynb.
- Load the model.ipynb in google collab.(Dont run already)
- Copy disease_symptom_data.csv to google collab sample_data folder.
- Copy disease_symptom_hotcoded_train.csv to google collab sample_data folder.
- Run model.ipynb.
- Copy the saved models into the backend/model directory
- Run app.py in a python terminal.
- Open/preview index.html in your browser.

---

### Directory Structure

```
symptoms-analyzer
├── backend
│   ├── models
│   │   ├── binary_features.pkl
│   │   ├── disease_prediction_model.h5
│   │   └── scaler.pkl
│   ├── app.py
│   ├── etl.ipynb
│   ├── mock_training_data.ipynb
│   ├── model.ipynb
│   └── schema.sql
├── frontend
│   ├── assets
│   │   ├── logo.svg
│   │   └── background.svg
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── config.js
│   │   ├── matches.js
│   │   └── search.js
│   └── index.html
├── resources
│   ├── data
│   │   ├── disease_description.txt
│   │   ├── disease_symptom_data.csv
│   │   └── disease_symptom_hotcoded_train.csv
│   ├── dummy_json
│   │   ├── dummy_diseases.json
│   │   ├── dummy_matches.json
│   │   └── dummy_symptoms.json
│   ├── images
│   │   ├── webapp.png
│   │   └── wireframe.png
│   ├── model_iterations
│   │   ├── model_iteration_1.ipynb
│   │   └── model_iteration_2.ipynb
│   └── requirements.txt
└── README.md
```

---

### Dataset
- **Source:** [DiseaseSymptom Knowledge Base (DSKB)](https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html)
- **Description:** The DSKB dataset contains relationships between diseases and symptoms. This structured data provides a rich source of labeled data for supervised learning.
- **Size:** Over 149 different diseases and 407 different symptoms, ranked.
- **Mock hot-coded data:** 5000 rows 38 mock patients for each disease.

---

### Requirements

```
Flask version: 3.0.3
Flask-CORS version: 5.0.1
SQLAlchemy version: 2.0.34
Scikit-learn version: 1.5.1
Pandas version: 2.2.2
NumPy version: 1.26.4
Pickle format version: 4.0
python 3.12.3
tensorflow 2.19.0
Requests version: 2.32.3
pgAdmin4 8.13
psycopg2 2.9.10
node js
```

---

### Project Team
- [Evan Gowans](https://www.linkedin.com/in/evan-gowans/)
- [Melanie Liao](https://www.linkedin.com/in/melanie-liao-998832165/)
- [Saurabh Lakhanpal](https://www.linkedin.com/in/lakhanpal-saurabh/)

---

### Project Presentation
![Presentation Link](symptoms-analyzer/resources/Project 4 Slides.pdf)


