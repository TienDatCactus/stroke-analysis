/**
 * Types for stroke prediction API responses
 */

export interface PredictionResult {
  index: number;
  prediction: string;
}

export type ErrorCode =
  | "MISSING_COLUMNS"
  | "INVALID_DATA_TYPE"
  | "FILE_FORMAT_ERROR"
  | "MODEL_ERROR"
  | "PYTHON_ERROR"
  | "UNKNOWN_ERROR";

export interface PredictionResponse {
  success: boolean;
  predictions: string[];
  results?: PredictionResult[];
  error?: string;
  errorCode?: ErrorCode;
  missingColumns?: string[]; // If error is due to missing columns
  dataTypeIssues?: {
    column: string;
    expectedType: string;
    receivedType: string;
  }[]; // If error is due to invalid data types
}

export type StrokeAnalysisData = {
  strokeCount: number;
  noStrokeCount: number;
  totalCount: number;
  strokePercentage: number;
  noStrokePercentage: number;
};
