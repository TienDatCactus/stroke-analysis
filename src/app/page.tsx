"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFileContext } from "@/lib/context/FileContext";
import {
  CircleHelp,
  CloudDownload,
  HardDriveUpload,
  LoaderCircle,
  Pencil,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
  const {
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
  } = useFileContext();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] z-30">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1 className="italic text-6xl font-bold font-mono">
            Stroke Analysis
          </h1>
          <p className="my-0 text-muted-foreground">
            Analyze your stroke rates in a few clicks
          </p>
        </div>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by input a{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              [sample].xlsx file
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            <i>Or</i> type those on your own.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Dialog>
            <DialogTrigger className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer sm:w-auto">
              <CloudDownload />
              Drop your file here
            </DialogTrigger>
            <DialogContent className="max-w-md lg:max-w-xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins">
                  Upload File
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div
                  className={`border-2 border-dashed  rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
                    isDragging
                      ? " border-primary  bg-primary/10"
                      : "border-muted-foreground/20"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                  />
                  <div className="flex flex-col items-center gap-4">
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <HardDriveUpload
                        size={40}
                        className={` ${
                          isDragging ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium mb-1">
                        {file
                          ? file.name
                          : "Drop your file here or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accepts Excel files (.xlsx, .xls)
                      </p>
                    </div>
                    {!file && (
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={openFileDialog}
                      >
                        Select File
                      </Button>
                    )}
                    {file && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center *:text-muted-foreground justify-between *:text-xs my-2">
                  <p>Supported format: .XLS, .XLSX</p>
                  <p>Maximum size: 25mb</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                  <div className="">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/excel.svg"
                        alt="Excel file icon"
                        width={30}
                        height={30}
                      />
                      <h1 className="text-base ">Table example</h1>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      You can download the attached example and use them as a
                      starting point for your own file.
                    </p>
                  </div>
                  <a href="/examples/example.xlsx" download>
                    <Button variant={"outline"}>Download</Button>
                  </a>
                </div>
              </div>
              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-1 items-center *:text-muted-foreground *:text-sm">
                  <CircleHelp size={18} />
                  <p>Help Center</p>
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant={"ghost"} type="reset">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button>Next</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center dark:hover:bg-primary hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] cursor-pointer">
            <Pencil />
            Type your data
          </Button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4">
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="mailto:tiendatntd204@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Email me →
        </a>
      </footer>
    </div>
  );
}
