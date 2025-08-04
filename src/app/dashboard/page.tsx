"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAnalysis, { AnalysisResult } from "@/lib/hooks/useAnalysis";
import withAuth from "@/lib/hooks/useWithAuth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeftIcon, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function CollapsibleTable() {
  const data = useAnalysis();

  const [detailId, setDetailId] = useState<{ timestamp: string } | null>(null);
  const [currentTab, setCurrentTab] = useState("attempts");
  const [detailData, setDetailData] = useState<{
    timestamp: string;
    results: AnalysisResult[];
  }>();
  useEffect(() => {
    if (detailId) {
      const detail = data.find((item) => item.timestamp === detailId.timestamp);
      setDetailData(detail);
    }
  }, [detailId, data]);
  const handleShowDetail = (timestamp: string) => {
    setDetailId({ timestamp });
    setCurrentTab(`detail-${timestamp}`);
  };

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="cursor-pointer">
          <Button>
            <ArrowLeftIcon />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="hfull flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="attempts">Attempts</TabsTrigger>
              {detailId && (
                <TabsTrigger value={`detail-${detailId.timestamp}`}>
                  Detail
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="attempts" className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#Attempts</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!data &&
                    data.length > 0 &&
                    data?.map((item) => (
                      <TableRow key={item?.timestamp}>
                        <TableCell>
                          {new Date(item.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{item.results.length}</TableCell>
                        <TableCell>dat</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShowDetail(item.timestamp)}
                          >
                            <ChevronRight />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            {detailId && (
              <TabsContent
                className="max-h-[500px] overflow-y-scroll"
                value={`detail-${detailId.timestamp}`}
              >
                <Table className="max-h-[500px] overflow-y-scroll">
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>BMI</TableHead>
                      <TableHead className="text-center">Prediction</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  {!!detailData &&
                    detailData.results.length > 0 &&
                    detailData.results.map((item) => (
                      <Collapsible asChild key={item?.["No."]}>
                        <TableBody>
                          <TableRow>
                            <TableCell>{item["No."]}</TableCell>
                            <TableCell>{item.Age}</TableCell>
                            <TableCell>
                              {item.Sex === 1 ? "Male" : "Female"}
                            </TableCell>
                            <TableCell>{item.BMI}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.prediction === "Stroke"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.prediction}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown />
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={6}>
                                <div className="p-6 bg-gray-50 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Basic Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Patient No:
                                          </span>
                                          <span className="font-medium">
                                            {item["No."]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Age:
                                          </span>
                                          <span className="font-medium">
                                            {item.Age}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Sex:
                                          </span>
                                          <span className="font-medium">
                                            {item.Sex === 1 ? "Male" : "Female"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            ICD Code:
                                          </span>
                                          <span className="font-medium">
                                            {item["ICD code"]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            BMI:
                                          </span>
                                          <span className="font-medium">
                                            {item.BMI}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Prediction:
                                          </span>
                                          <span
                                            className={`font-semibold px-2 py-1 rounded text-xs ${
                                              item.prediction === "Stroke"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                          >
                                            {item.prediction}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Vital Signs */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Vital Signs & Admission
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Admission SBP:
                                          </span>
                                          <span className="font-medium">
                                            {item.admissionSBP} mmHg
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Admission DBP:
                                          </span>
                                          <span className="font-medium">
                                            {item.admissionDBP} mmHg
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            NIHSS Score:
                                          </span>
                                          <span className="font-medium">
                                            {item["NIHSS score"]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Admission Window:
                                          </span>
                                          <span className="font-medium">
                                            {item["Admission window time"]} hrs
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Hospital Days:
                                          </span>
                                          <span className="font-medium">
                                            {item["Days in hospital"]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            mRS Score:
                                          </span>
                                          <span className="font-medium">
                                            {item.mRS}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Risk Factors */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Risk Factors
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Hypertension:
                                          </span>
                                          <span className="font-medium">
                                            {item.Hypertension === 1
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Diabetes:
                                          </span>
                                          <span className="font-medium">
                                            {item.Diabetes === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            AF/Flutter:
                                          </span>
                                          <span className="font-medium">
                                            {item[
                                              "Atrial fibrillation or atrial flutter"
                                            ] === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Smoking:
                                          </span>
                                          <span className="font-medium">
                                            {item.Smoking === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Obesity:
                                          </span>
                                          <span className="font-medium">
                                            {item.Obesity === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Hypercholesterolemia:
                                          </span>
                                          <span className="font-medium">
                                            {item.Hypercholesterolemia === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Laboratory Values */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Laboratory Values
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Platelets:
                                          </span>
                                          <span className="font-medium">
                                            {item.Platelets}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            INR:
                                          </span>
                                          <span className="font-medium">
                                            {item.INR}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Cholesterol:
                                          </span>
                                          <span className="font-medium">
                                            {item.Cholesterol}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            HDL:
                                          </span>
                                          <span className="font-medium">
                                            {item.HDLC}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            LDL:
                                          </span>
                                          <span className="font-medium">
                                            {item.LDLC}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Blood Glucose:
                                          </span>
                                          <span className="font-medium">
                                            {item["Blood glucose on admission"]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Treatment */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Treatment
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Antithrombotic:
                                          </span>
                                          <span className="font-medium">
                                            {item.antithrombotic === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            DAPT:
                                          </span>
                                          <span className="font-medium">
                                            {item.DAPT === 1 ? "Yes" : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Anticoagulant:
                                          </span>
                                          <span className="font-medium">
                                            {item.anticoagulant === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Statin:
                                          </span>
                                          <span className="font-medium">
                                            {item.Statin === "1" ? "Yes" : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            HTN Treatment:
                                          </span>
                                          <span className="font-medium">
                                            {item[
                                              "hypertension medication treatment"
                                            ] === 1
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            TOAST Classification:
                                          </span>
                                          <span className="font-medium">
                                            {item["TOAST Classification"]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Outcomes */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 border-b pb-2">
                                        Outcomes
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Discharge mRS:
                                          </span>
                                          <span className="font-medium">
                                            {item["discharged mRS"]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            30-day mRS:
                                          </span>
                                          <span className="font-medium">
                                            {item["mRS 30 day"]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            90-day mRS:
                                          </span>
                                          <span className="font-medium">
                                            {item["mRS 90 day "]}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            30-day Recurrence:
                                          </span>
                                          <span className="font-medium">
                                            {item[
                                              "stroke recurrence within 30 days"
                                            ] === "1"
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            90-day Recurrence:
                                          </span>
                                          <span className="font-medium">
                                            {item[
                                              "stroke recurrence within 90 days"
                                            ] === 1
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Hemorrhagic Transform:
                                          </span>
                                          <span className="font-medium">
                                            {item[
                                              "hemorrhagic transformation"
                                            ] === 1
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </TableBody>
                      </Collapsible>
                    ))}
                </Table>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CollapsibleTable);
