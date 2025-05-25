#!/usr/bin/env python
# Test script for stroke prediction model

import os
import pandas as pd
import joblib
import json
import numpy as np
import warnings

print("Starting prediction test...")

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(current_dir, 'public', 'examples', 'example.xlsx')
model_path = os.path.join(current_dir, 'src', 'middleware', 'random_forest_model.pkl')

print(f"Excel file path: {excel_path}")
print(f"Model file path: {model_path}")

# Check if files exist
if not os.path.exists(excel_path):
    print(f"Error: Excel file not found at {excel_path}")
    exit(1)
    
if not os.path.exists(model_path):
    print(f"Error: Model file not found at {model_path}")
    exit(1)

try:
    # Load data
    print("Loading data...")
    new_data = pd.read_excel(excel_path)
    print(f"Data loaded with {new_data.shape[0]} rows and {new_data.shape[1]} columns")    # Process data
    print("Processing data...")
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=FutureWarning)
        new_data.replace(['#NULL!', 'NULL', 'NA'], 0, inplace=True)
    
    columns_to_drop = [
        "Dizzy", "hearing loss", "Horizontal diplopia", "Vertical diplopia", 
        "Other double vision", "Headache", "Loss of vision", "Memory disorder",
        "corresponding intracranial occlusion site ICA", 
        "corresponding intracranial occlusion site MCA", 
        "corresponding intracranial occlusion site BA", 
        "corresponding intracranial occlusion site ACA", 
        "corresponding intracranial occlusion site P2", 
        "corresponding intracranial occlusion site PCA",
        "anticoagulant vitamin K", "apixaban", "dabigatran", "rivaroxaban",
        "Statin intensity level", "diabetes medication treatment", 
        "hypertension medication treatment", "Days in hospital", 
        "stroke recurrence within 30 days", "stroke recurrence within 90 days"
    ]
    
    # Get columns that actually exist in the dataframe
    columns_to_drop_existing = [col for col in columns_to_drop if col in new_data.columns]
    print(f"Dropping {len(columns_to_drop_existing)} columns")
    
    # Drop unnecessary columns
    new_data = new_data.drop(columns=columns_to_drop_existing, errors='ignore')
    
    # Clean data
    df_cleaned = new_data.fillna(0)
    df_cleaned.columns = df_cleaned.columns.str.lower()
    
    # Drop any identifier columns
    id_columns = ['end', 'no.']
    id_columns_existing = [col for col in id_columns if col in df_cleaned.columns]
    
    # Select only numerical data
    data = df_cleaned.drop(columns=id_columns_existing, errors='ignore').select_dtypes(include=['number'])
    print(f"Using {data.shape[1]} features for prediction")
    
    # Convert to numpy array for prediction
    X_new = data.to_numpy()
      # Load model and make predictions
    print("Loading model and making predictions...")
    # Temporarily suppress scikit-learn version warnings
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=UserWarning)
        random_forest = joblib.load(model_path)
    predictions = random_forest.predict(X_new)
    
    # Convert binary predictions to human-readable labels
    # 0 for stroke, 1 for no stroke
    predictions = np.where(predictions == 0, 'Stroke', 'No Stroke')
    
    # Create a list of predictions
    result_list = []
    for idx, prediction in enumerate(predictions):
        result_list.append({
            "index": idx + 1,
            "prediction": prediction
        })
    
    print(f"Prediction completed successfully!")
    print(f"Results: {len(result_list)} predictions")
    print(json.dumps(result_list, indent=2))
    
except Exception as e:
    import traceback
    print(f"Error during prediction: {str(e)}")
    traceback.print_exc()
