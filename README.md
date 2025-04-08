# Symptom Analyzer

### Project Title
Symptom Analyzer: A Machine Learning Model for Predicting Diseases Based on Symptoms

### Group Members
- Saurabh Lakhanpal, Evan Gowans, Melanie Liao

### Overview
This project aims to build a machine learning model that predicts potential diseases based on a set of symptoms provided by the user. By leveraging the DiseaseSymptom Knowledge Base (DSKB) dataset, we will create a predictive tool that uses supervised learning algorithms to make disease predictions with a high degree of accuracy.

The main purpose of this project is to provide users with a more accurate and reliable disease prediction tool compared to generic online searches (e.g., Google). By offering evidence-based predictions, the model aims to reduce patient anxiety caused by inaccurate or overly broad search results, thereby improving user confidence and promoting better health outcomes.

### Objectives
- Develop a classification model that accurately predicts diseases based on user-input symptoms.
- Visualize the relationship between symptoms and diseases using interactive tools.
- Provide an intuitive interface for users to input symptoms and receive predictions.
- Enhance user experience by providing reliable, data-driven predictions to reduce patient anxiety.
- Demonstrate how different data processing and storage tools (e.g., DataBricks, Parquet, SQL) can improve performance and scalability.

### Dataset
- **Source:** [DiseaseSymptom Knowledge Base (DSKB)](https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html)
- **Description:** The DSKB dataset contains relationships between diseases and symptoms. This structured data provides a rich source of labeled data for supervised learning.
- **Size:** Over 15000 records 

### Questions to Address
- Which symptoms are most strongly associated with specific diseases?
- Can we accurately predict diseases based on a limited set of symptoms?
- How well do various machine learning models (e.g., Decision Trees, Random Forest, Logistic Regression) perform in this predictive task?
- Can our model provide more accurate predictions than general online search results, thereby reducing patient anxiety?

### Technologies and Tools
1. **Machine Learning Library:** Scikit-learn (Python)
2. **Data Manipulation & Storage:** Pandas, DataBricks, Parquet, SQL (Python)
3. **Data Visualization:** Plotly (Python)
4. **Backend & API Development:** Flask (Python) with POST and GET calls
5. **Frontend Interface:** HTML/CSS/Bootstrap, JavaScript
6. **Deployment & Hosting:** Amazon AWS
7. **File Formats & Data Storage:** HDF5, Parquet
8. **Version Control:** GitHub
9. **Collaboration Tool:** GitHub Projects

### Methodology
1. **Project Ideation:** Completed (Disease prediction using symptoms).
2. **Data Fetching and Preparation:**
   - Import dataset from DSKB.
   - Clean and preprocess data (handling missing values, encoding categorical variables, etc.).
   - Store data using Parquet and SQL formats for efficient querying and scalability.
   - Use DataBricks for distributed data processing.
3. **Exploratory Data Analysis (EDA):**
   - Visualize symptom-disease relationships.
   - Identify most common symptoms for various diseases.
   - Store resulting DataFrames in SQL databases for further analysis.
4. **Model Building:**
   - Train-test split of data.
   - Build multiple models (Decision Tree, Random Forest, Logistic Regression).
   - Evaluate models using appropriate metrics (Accuracy, Precision, Recall, F1-score).
   - Export final model as an HDF5 file for deployment.
5. **Visualization:**
   - Use Plotly to create interactive visualizations of prediction results.
   - Display relationships between symptoms and diseases.
6. **Backend Development:**
   - Create Flask app (app.py) with POST and GET endpoints for interaction with the model.
7. **Frontend Development:**
   - Create a simple HTML/CSS/Bootstrap interface with JavaScript to send requests to the Flask API.
8. **Deployment:**
   - Deploy the model and API on AWS.
9. **Testing:**
   - Test the model on unseen data.
10. **Documentation & Presentation:**
   - Prepare a final report and presentation for submission.

### Milestones
- **Week 1:** Data fetching, preparation, and EDA.
- **Week 2:** Model building, testing, visualization, and presentation preparation.

### Expected Outcome
- A working disease predictor model capable of predicting diseases based on user-input symptoms.
- Interactive visualizations showcasing symptom-disease relationships.
- A tool that offers more accurate, evidence-based predictions than generic online searches, reducing patient anxiety.
- Deployed model and API hosted on AWS for user access.

### References
- DiseaseSymptomKB: [Dataset Link](https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html)
- Scikit-learn Documentation: [https://scikit-learn.org/](https://scikit-learn.org/)
- Plotl
