/**
 * Helper functions for making API calls to the prediction endpoint
 */
import { PredictionResponse, StrokeAnalysisData } from "@/types/prediction";

/**
 * Send a file to the prediction API endpoint
 * @param file The file to analyze (Excel file)
 * @returns The prediction results
 */
export async function getPrediction(file: File): Promise<PredictionResponse> {
  try {
    // Create form data with the file
    const formData = new FormData();
    formData.append("file", file);

    // Make the API call
    const response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get prediction");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      predictions: [],
      results: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Analyze prediction data to extract statistics
 * @param predictions Array of prediction results
 * @returns Analysis data for visualization
 */
export function analyzeStrokeData(predictions: string[]): StrokeAnalysisData {
  const strokeCount = predictions.filter((p) => p === "Stroke").length;
  const noStrokeCount = predictions.filter((p) => p === "No Stroke").length;
  const totalCount = predictions.length;

  return {
    strokeCount,
    noStrokeCount,
    totalCount,
    strokePercentage: totalCount > 0 ? (strokeCount / totalCount) * 100 : 0,
    noStrokePercentage: totalCount > 0 ? (noStrokeCount / totalCount) * 100 : 0,
  };
}
