-- Drop tables if they exist
DROP TABLE IF EXISTS disease_symptom_tb;
DROP TABLE IF EXISTS diseases_tb;
DROP TABLE IF EXISTS symptoms_tb;

-- Create the diseases_tb table
CREATE TABLE diseases_tb (
    disease_id VARCHAR(8) PRIMARY KEY,
    d_name VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL
);

-- Create the symptoms_tb table
CREATE TABLE symptoms_tb (
    symptom_id VARCHAR(8) PRIMARY KEY,
    s_name VARCHAR(255) NOT NULL
);

-- Create the disease_symptom_tb table
CREATE TABLE disease_symptom_tb (
    disease_id VARCHAR(8) NOT NULL,
    d_name VARCHAR(255) NOT NULL,
    symptom_id VARCHAR(8) NOT NULL,
    s_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (disease_id) REFERENCES diseases_tb(disease_id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms_tb(symptom_id)
);

