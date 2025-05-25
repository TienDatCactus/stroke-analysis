"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  JSX,
} from "react";
import { PredictionResponse } from "@/types/prediction";

interface FileContextType {
  file: File | null;
  isDragging: boolean;
  fileLoading: boolean;
  predicting: boolean;
  predictionResults: PredictionResponse | null;
  setPredicting: React.Dispatch<React.SetStateAction<boolean>>;
  setPredictionResults: React.Dispatch<
    React.SetStateAction<PredictionResponse | null>
  >;
  setFileLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  openFileDialog: () => void;
  runPrediction: () => Promise<void>;
}

const FileContext = createContext<FileContextType | null>(null);

interface FileProviderProps {
  children: ReactNode;
}

export function FileProvider({ children }: FileProviderProps): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictionResults, setPredictionResults] =
    useState<PredictionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFileLoading(true);
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        // Reset prediction results when a new file is selected
        setPredictionResults(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFileLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setFileLoading(true);
      e.preventDefault();
      setIsDragging(true);
    } catch (error) {
      console.error(error);
    } finally {
      setFileLoading(false);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setFileLoading(true);
      e.preventDefault();
      setIsDragging(false);
    } catch (error) {
      console.error(error);
    } finally {
      setFileLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setFileLoading(true);
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
        // Reset prediction results when a new file is dropped
        setPredictionResults(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFileLoading(false);
    }
  };

  const openFileDialog = () => {
    try {
      setFileLoading(true);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFileLoading(false);
    }
  };

  const runPrediction = async () => {
    if (!file) {
      setPredictionResults({
        success: false,
        predictions: [],
        error: "No file selected",
      });
      return;
    }

    try {
      setPredicting(true);

      // Import the API function dynamically to avoid server-side issues
      const { getPrediction } = await import("@/lib/api");
      const results = await getPrediction(file);

      setPredictionResults(results);
    } catch (error) {
      console.error("Error running prediction:", error);
      setPredictionResults({
        success: false,
        predictions: [],
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setPredicting(false);
    }
  };

  const value = {
    file,
    isDragging,
    fileLoading,
    predicting,
    predictionResults,
    setPredicting,
    setPredictionResults,
    setFileLoading,
    setFile,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openFileDialog,
    runPrediction,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFileContext(): FileContextType {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
