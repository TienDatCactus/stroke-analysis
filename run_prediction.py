import sys
import os
import importlib.util

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
predict_path = os.path.join(current_dir, 'src', 'middleware', 'predict.py')

# Check if the file exists
if not os.path.exists(predict_path):
    print(f"Error: Predict module not found at {predict_path}")
    sys.exit(1)

# Import the predict module dynamically
try:
    spec = importlib.util.spec_from_file_location("predict", predict_path)
    if spec is None:
        print(f"Error: Could not create spec for module at {predict_path}")
        sys.exit(1)
        
    predict = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(predict)
    print("Successfully imported predict module")
except Exception as e:
    print(f"Error importing predict module: {str(e)}")
    sys.exit(1)

# Now we have access to the predict_new_data function
predict_new_data = predict.predict_new_data

# Path to your Excel file containing the data to predict
data_path = "public/examples/example.xlsx"

# Path to your trained model (though this is hardcoded in the predict function)
model_path = "src/middleware/random_forest_model.pkl"

# Run the prediction
predictions = predict_new_data(data_path, model_path)

# Print the predictions
print("Predictions:")
print(predictions)
