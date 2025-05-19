"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  JSX,
} from "react";

interface FileContextType {
  file: File | null;
  isDragging: boolean;
  loading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  openFileDialog: () => void;
}

const FileContext = createContext<FileContextType | null>(null);

interface FileProviderProps {
  children: ReactNode;
}

export function FileProvider({ children }: FileProviderProps): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      setIsDragging(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      setIsDragging(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    try {
      setLoading(true);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    file,
    isDragging,
    loading,
    setFile,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openFileDialog,
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
