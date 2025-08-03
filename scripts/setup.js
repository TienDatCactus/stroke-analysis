#!/usr/bin/env node

/**
 * This script checks if Python is available and installs required packages
 * when a Next.js project is set up.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Check if Python is available
function checkPython() {
  try {
    // Try multiple Python commands
    const commands = ["python --version", "python3 --version", "py --version"];

    for (const cmd of commands) {
      try {
        console.log(`Checking for Python using: ${cmd}`);
        execSync(cmd, { stdio: "ignore" });
        return cmd.split(" ")[0]; // Return the command that worked
      } catch (err) {
        // This command didn't work, try the next one
        continue;
      }
    }

    console.log("\n❌ Python is not installed or not in the PATH");
    console.log(
      "Please install Python 3.8+ to use the stroke prediction features."
    );
    console.log(
      "You can download Python from: https://www.python.org/downloads/"
    );
    return null;
  } catch (error) {
    console.error("Error checking Python:", error);
    return null;
  }
}

// Install required Python packages
function installPackages(pythonCmd) {
  try {
    console.log("\n📦 Installing required Python packages...");

    // Check if requirements.txt exists
    const requirementsPath = path.join(process.cwd(), "requirements.txt");
    if (!fs.existsSync(requirementsPath)) {
      console.log(
        "❌ requirements.txt not found. Creating one with essential packages..."
      );

      // Create basic requirements.txt
      const requirements = [
        "numpy==1.24.3",
        "pandas==2.0.3",
        "scikit-learn==1.3.2",
        "joblib==1.3.2",
        "openpyxl==3.1.2",
        "xlrd==2.0.1",
      ];

      fs.writeFileSync(requirementsPath, requirements.join("\n"));
      console.log("✅ Created requirements.txt");
    }

    // Install packages
    console.log(
      `Running: ${pythonCmd} -m pip install --user -r requirements.txt`,
    );
    execSync(`${pythonCmd} -m pip install --user -r requirements.txt`, {
      stdio: "inherit",
    });
    console.log("✅ Python packages installed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error installing Python packages:", error.message);
    return false;
  }
}

// Check if the model file exists
function checkModelFile() {
  const modelPath = path.join(
    process.cwd(),
    "src",
    "middleware",
    "random_forest_model.pkl"
  );
  if (!fs.existsSync(modelPath)) {
    console.log("\n⚠️ Warning: Model file not found at:");
    console.log(modelPath);
    console.log(
      "You'll need to add a trained model file to use prediction features."
    );
    return false;
  }

  console.log("✅ Model file found");
  return true;
}

// Main function
function main() {
  console.log("====================================");
  console.log("🧠 Stroke Analysis Setup");
  console.log("====================================\n");

  // Check for Python
  const pythonCmd = checkPython();
  if (!pythonCmd) {
    return;
  }

  // Check if we have the model file
  checkModelFile();

  // Install packages
  const packagesInstalled = installPackages(pythonCmd);

  console.log("\n====================================");
  if (packagesInstalled) {
    console.log("✅ Setup complete! You can now run:");
    console.log("   npm run dev");
    console.log("   to start the application.");
  } else {
    console.log("⚠️ Setup completed with warnings.");
    console.log("   You may need to manually install Python packages.");
    console.log("   Run: pip install -r requirements.txt");
  }
  console.log("====================================");
}

// Run the main function
main();
