# Symptom Analyzer

> A Machine Learning Model for Predicting Diseases Based on Symptoms.

> [Link to the Webapp]

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Dataset](#dataset)
- [License](#license)
- [Project Team](#project-team)
- [Project Presentation](#project-presentation)

---

### Overview
This project aims to build a machine learning model that predicts potential diseases based on a set of symptoms provided by the user. By leveraging the DiseaseSymptom Knowledge Base (DSKB) dataset, we will create a predictive tool that uses supervised learning algorithms to make disease predictions with a high degree of accuracy.

The main purpose of this project is to provide users with a more accurate and reliable disease prediction tool compared to generic online searches (e.g., Google). By offering evidence-based predictions, the model aims to reduce patient anxiety caused by inaccurate or overly broad search results, thereby improving user confidence and promoting better health outcomes.

![Web Application]()

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
│   ├── model_iterations
│   │   ├── model_iteration_1.ipynb
│   │   └── model_iteration_2.ipynb
│   └── wireframe.png
└── README.md
```

---

### Dataset
- **Source:** [DiseaseSymptom Knowledge Base (DSKB)](https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html)
- **Description:** The DSKB dataset contains relationships between diseases and symptoms. This structured data provides a rich source of labeled data for supervised learning.
- **Size:** Over 149 different diseases and 407 different symptoms, ranked.
- **Mock hot-coded data:** 5000 rows 38 mock patients for each disease.

---

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

### Project Team
- [Evan Gowans]()
- [Melanie Liao]()
- [Saurabh Lakhanpal](https://www.linkedin.com/in/lakhanpal-saurabh/)

---

### Project Presentation
