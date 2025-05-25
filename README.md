# Stroke Analysis App

A full-stack Next.js application with Python-based machine learning for stroke risk prediction.

## Features

- 📊 Upload and analyze Excel data files for stroke risk analysis
- 🧠 Machine learning-based prediction using Random Forest algorithm
- 📈 Interactive data visualization with charts
- 📱 Responsive design that works on all devices
- 🐍 Python backend integration with Next.js

## Prerequisites

Before running this application, you need to have:

1. **Node.js** (v18 or later)
2. **Python** (v3.8 or later)
3. Required Python packages (installed automatically during setup)

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd stroke-mah-dihh
npm install
```

The installation process will automatically run the setup script that checks for Python and installs required packages.

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 3. Upload data files

- Drag and drop Excel files onto the upload area, or click to select files
- The application will process the file and display prediction results
- View detailed analysis on the analysis page

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Architecture

This application combines:

- **Frontend**: Next.js with React for the user interface
- **API Layer**: Next.js API routes that interface with Python
- **Machine Learning**: Python-based stroke prediction model

### Key Components:

1. **Frontend** (`src/app/page.tsx`)

   - Main UI for file uploads and results display

2. **API Routes** (`src/app/api/predict/route.ts`)

   - Handles file uploads and calls Python prediction module

3. **Python Integration** (`src/middleware/predict`)

   - Prediction model implementation using scikit-learn

4. **Data Visualization** (`src/components/StrokeCharts.tsx`)
   - Interactive charts for data analysis

## Deployment

### Option 1: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

For this application to work on Vercel, you'll need to:

1. Add Python as a build dependency (see Vercel documentation)
2. Ensure required Python packages are installed during build

### Option 2: Self-hosted Deployment

For self-hosted deployment:

1. Build the application: `npm run build`
2. Start the application: `npm run start`
3. Ensure Python 3.8+ is installed on the host system
4. Install required Python packages: `pip install -r requirements.txt`

## Development Notes

- The prediction model is located at `src/middleware/random_forest_model.pkl`
- Excel files should conform to the expected format for prediction
- The setup script in `scripts/setup.js` checks Python prerequisites

## Model Retraining

If you encounter scikit-learn version warning messages, you can retrain the model with your current scikit-learn version:

```bash
# Retrain the model with the default training data
python retrain_model.py

# Or specify custom input and output paths
python retrain_model.py --input path/to/training_data.xlsx --output src/middleware/random_forest_model.pkl
```

This creates a model file compatible with your current scikit-learn installation, eliminating version warnings.

## License

[MIT](LICENSE)
