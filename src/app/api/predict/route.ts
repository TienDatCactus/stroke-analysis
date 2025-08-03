import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

// Helper function to check if Python is available
const isPythonAvailable = async (): Promise<JSON> => {
  return new Promise((resolve) => {
    // Try multiple possible Python command names
    const pythonCommands = ["python3", "python", "py"];
    let checkedCount = 0;

    for (const cmd of pythonCommands) {
      const process = spawn(cmd, ["--version"]);

      process.on("error", () => {
        checkedCount++;
        if (checkedCount === pythonCommands.length) {
          resolve(false); // None of the commands worked
        }
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(true); // This command worked
        } else {
          checkedCount++;
          if (checkedCount === pythonCommands.length) {
            resolve(false); // All commands failed
          }
        }
      });
    }
  });
};

// Helper function to execute Python script and get results
const executePythonScript = async (filePath: string): Promise<boolean> => {
  // Check if Python is available first
  const pythonAvailable = await isPythonAvailable();
  if (!pythonAvailable) {
    throw new Error(
      "Python is not available. Please install Python to use this feature."
    );
  }
  return new Promise((resolve, reject) => {
    // Get paths to our existing middleware files
    const pythonScript = path.resolve(
      process.cwd(),
      "src/middleware/predict.py"
    );
    const modelPath = path.resolve(
      process.cwd(),
      "src/middleware/random_forest_model.pkl"
    );

    // Try multiple possible Python command names
    const pythonCommand = process.platform === "win32" ? "python" : "python3";

    console.log(`Executing Python prediction script with file: ${filePath}`);
    console.log(`Model path: ${modelPath}`);

    // Execute the prediction script directly
    const python = spawn(pythonCommand, [
      pythonScript, // Run the script directly
      filePath, // First argument: Excel file path
      modelPath, // Second argument: Model file path
    ]);

    let dataString = "";
    let errorString = "";

    python.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorString += data.toString();
      console.error(`Python stderr: ${data.toString()}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error: ${errorString}`);
        reject(new Error(errorString || "Python script execution failed"));
      } else {
        try {
          // Parse the JSON output from the Python script
          const jsonResult = JSON.parse(dataString.trim());
          resolve(jsonResult);
        } catch (error) {
          console.error("Failed to parse Python output:", error);
          console.error("Raw output:", dataString);
          reject(new Error("Failed to parse prediction results"));
        }
      }
    });
  });
};

// Function to save uploaded file temporarily
const saveTemporaryFile = async (formData: FormData): Promise<string> => {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  const tempDir = path.join(os.tmpdir(), "stroke-analysis");

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `${Date.now()}-${file.name}`);

  // Convert file to buffer and save to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    console.log("Received prediction request");
    const formData = await req.formData();
    tempFilePath = await saveTemporaryFile(formData);
    console.log(`File saved temporarily at: ${tempFilePath}`);

    // Check if Python is available
    const pythonAvailable = await isPythonAvailable();
    if (!pythonAvailable) {
      console.warn("Python is not available. Unable to make predictions.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Python is not available on the server. Please install Python to use this feature.",
          predictions: [],
        },
        { status: 500 }
      );
    }

    // Execute Python prediction script
    const result = await executePythonScript(tempFilePath);
    console.log("Prediction completed successfully");

    // Return the complete result from our Python script
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        predictions: [],
      },
      { status: 500 }
    );
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`Temporary file deleted: ${tempFilePath}`);
      } catch (e) {
        console.error("Error deleting temporary file:", e);
      }
    }
  }
}
