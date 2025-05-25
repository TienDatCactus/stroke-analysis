#!/usr/bin/env python
"""
Script to retrain the stroke prediction model using the latest scikit-learn version.
This will help eliminate version warnings when loading the model.

Usage:
  python retrain_model.py [--input train_data.xlsx] [--output model_path.pkl]
"""

import argparse
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import logging
import warnings

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('model_retraining')

def load_and_preprocess_data(data_path):
    """
    Load and preprocess the training data.
    
    Args:
        data_path: Path to the Excel file containing training data
        
    Returns:
        X_train, X_test, y_train, y_test: Processed training and test datasets
    """
    logger.info(f"Loading training data from {data_path}")
    try:
        # Load data
        df = pd.read_excel(data_path)
        logger.info(f"Data loaded successfully with {df.shape[0]} rows and {df.shape[1]} columns")
        
        # Suppress pandas FutureWarning about downcasting behavior
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=FutureWarning)
            df.replace(['#NULL!', 'NULL', 'NA'], 0, inplace=True)
        
        # Drop unnecessary columns (same as in predict.py)
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
        
        # Get list of columns actually in the dataframe
        columns_to_drop_existing = [col for col in columns_to_drop if col in df.columns]
        df = df.drop(columns=columns_to_drop_existing, errors='ignore')
        
        # Clean data
        df_cleaned = df.fillna(0)
        df_cleaned.columns = df_cleaned.columns.str.lower()
        
        # Drop any identifier columns
        id_columns = ['end', 'no.']
        id_columns_existing = [col for col in id_columns if col in df_cleaned.columns]
        
        # Extract features (X) and target (y)
        numerical_data = df_cleaned.drop(columns=id_columns_existing, errors='ignore').select_dtypes(include=['number'])
        
        # Check if 'stroke' is in columns
        if 'stroke' not in numerical_data.columns:
            logger.error("'stroke' column not found in dataset")
            raise ValueError("'stroke' column not found in the dataset. This column is required for training.")
        
        # Extract features and target
        X = numerical_data.drop(columns=['stroke'])
        y = numerical_data['stroke']
        
        # Convert target to binary (0 for stroke, 1 for no stroke)
        y = (y != 0).astype(int)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        logger.info(f"Data preprocessing complete. Training set: {X_train.shape[0]} samples with {X_train.shape[1]} features")
        
        return X_train, X_test, y_train, y_test
        
    except Exception as e:
        logger.error(f"Error during data processing: {str(e)}")
        raise

def train_model(X_train, y_train):
    """
    Train a new Random Forest classifier.
    
    Args:
        X_train: Training features
        y_train: Training target
    
    Returns:
        Trained model
    """
    logger.info("Training new Random Forest model...")
    
    # Use the same parameters as original model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10
    )
    
    model.fit(X_train, y_train)
    logger.info("Model training complete")
    
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the trained model.
    
    Args:
        model: Trained model
        X_test: Test features
        y_test: Test target
    """
    logger.info("Evaluating model performance...")
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    logger.info(f"Model accuracy: {accuracy:.4f}")
    
    logger.info("Classification report:")
    report = classification_report(y_test, y_pred, target_names=['Stroke', 'No Stroke'])
    logger.info(f"\n{report}")

def save_model(model, output_path):
    """
    Save the trained model to disk.
    
    Args:
        model: Trained model
        output_path: Path to save the model
    """
    logger.info(f"Saving model to {output_path}")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the model
    joblib.dump(model, output_path)
    logger.info("Model saved successfully")

def main():
    parser = argparse.ArgumentParser(description='Retrain stroke prediction model')
    parser.add_argument('--input', type=str, default='public/examples/training_data.xlsx',
                        help='Path to training data Excel file')
    parser.add_argument('--output', type=str, default='src/middleware/random_forest_model.pkl',
                        help='Path to save trained model')
    
    args = parser.parse_args()
    
    try:
        # Load and preprocess data
        X_train, X_test, y_train, y_test = load_and_preprocess_data(args.input)
        
        # Train the model
        model = train_model(X_train, y_train)
        
        # Evaluate the model
        evaluate_model(model, X_test, y_test)
        
        # Save the model
        save_model(model, args.output)
        
        logger.info("Model retraining completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during model retraining: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return 1
        
    return 0

if __name__ == "__main__":
    exit(main())
