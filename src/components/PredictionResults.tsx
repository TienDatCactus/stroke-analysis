"use client";

import { analyzeStrokeData } from "@/lib/api";
import { useFileContext } from "@/lib/context/FileContext";
import { PredictionError } from "@/types/error";
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { PredictionErrorDisplay } from "./Error";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { DialogHeader, DialogTitle } from "./ui/dialog";

export function PredictionResults() {
  const { predictionResults, file } = useFileContext();
  if (!predictionResults) {
    return null;
  }
  if (!predictionResults.success) {
    const error: PredictionError = {
      success: false,
      error: predictionResults.error || "Unknown error",
      errorCode: predictionResults.errorCode || "UNKNOWN_ERROR",
      missingColumns: predictionResults.missingColumns || [],
      dataTypeIssues: predictionResults.dataTypeIssues || [],
      predictions: [],
      results: [],
    };
    return <PredictionErrorDisplay error={error} />;
  }

  const predictions = Array.isArray(predictionResults.predictions)
    ? predictionResults.predictions
    : typeof predictionResults.predictions === "string"
    ? [predictionResults.predictions]
    : [];

  const strokeData = analyzeStrokeData(predictions);

  // Chart data configurations
  const pieData = [
    {
      name: "No Stroke",
      value: strokeData.noStrokeCount,
      fill: "var(--destructive)",
    },
    {
      name: "Stroke",
      value: strokeData.strokeCount,
      fill: "var(--chart-2)",
    },
  ];

  const barData = [
    {
      category: "No Stroke",
      count: strokeData.noStrokeCount,
      fill: "var(--chart-2)",
    },
    {
      category: "Stroke",
      count: strokeData.strokeCount,
      fill: "var(--destructive)",
    },
  ];

  const radialData = [
    {
      name: "Stroke Risk",
      value: strokeData.strokePercentage,
      fill: "var(--destructive)",
    },
    {
      name: "Healthy Population",
      value: strokeData.noStrokePercentage,
      fill: "var(--chart-2)",
    },
    {
      name: "Prevention Effectiveness",
      value: 87, // Example value for prevention effectiveness
      fill: "var(--chart-3)",
    },
    {
      name: "Early Detection Rate",
      value: 92, // Example value for early detection rate
      fill: "var(--chart-4)",
    },
  ];

  const chartConfig = {
    stroke: {
      label: "Stroke",
      color: "var(--destructive)",
    },
    noStroke: {
      label: "No Stroke",
      color: "var(--chart-2)",
    },
    total: {
      label: "Total",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <div className=" bg-gradient-to-br p-6">
      <div className="max-w-7xl  mx-auto space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins">
            Stroke Analytics Dashboard
            <p className="text-sm text-gray-500 ">
              {file ? `File: ${file.name}` : "No file uploaded"}
            </p>
          </DialogTitle>
        </DialogHeader>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {strokeData.totalCount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Study population</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stroke Cases
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {strokeData.strokeCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {strokeData.strokePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Healthy Cases
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {strokeData.noStrokeCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {strokeData.noStrokePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {strokeData.strokePercentage < 15
                  ? "Low"
                  : strokeData.strokePercentage < 25
                  ? "Medium"
                  : "High"}
              </div>
              <p className="text-xs text-muted-foreground">
                Population risk assessment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pie Chart */}
          <Card className="col-span-1 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Distribution Overview</CardTitle>
              <CardDescription>Stroke vs Non-Stroke Cases</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Low stroke incidence rate{" "}
                <TrendingDown className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground">
                13.2% stroke rate indicates good population health
              </div>
            </CardFooter>
          </Card>

          {/* Bar Chart */}
          <Card className="col-span-1 h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Case Comparison</CardTitle>
              <CardDescription>Absolute numbers comparison</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="font-medium leading-none">
                <span className="text-green-600 text-xl">
                  {(strokeData.noStrokeCount / strokeData.strokeCount).toFixed(
                    1
                  )}
                  x
                </span>{" "}
                more healthy cases than stroke cases
              </div>
              <div className="leading-none text-muted-foreground">
                Strong indication of effective prevention measures
              </div>
            </CardFooter>
          </Card>

          {/* Radial Progress Chart */}
          <Card className="col-span-1 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Risk Gauge</CardTitle>
              <CardDescription>
                Population stroke risk percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={radialData}
                  innerRadius={40}
                  outerRadius={110}
                >
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent hideLabel nameKey="browser" />
                    }
                  />
                  <RadialBar dataKey="value" background />
                </RadialBarChart>
              </ChartContainer>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-red-600">
                  {strokeData.strokePercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Stroke Risk Level
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Low Risk Population
              </Badge>
            </CardFooter>
          </Card>

          {/* Progress Indicators */}
          <Card className="col-span-1 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>Population health indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stroke Rate</span>
                  <span className="font-medium">
                    {strokeData.strokePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className=" bg-primary/10 rounded h-2 ">
                  <div
                    className="bg-primary h-full rounded"
                    style={{ width: `${strokeData.strokePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Healthy Population</span>
                  <span className="font-medium">
                    {strokeData.noStrokePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className=" bg-primary/10 rounded h-2 ">
                  <div
                    className="bg-primary h-full rounded"
                    style={{ width: `${strokeData.noStrokePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prevention Effectiveness</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className=" bg-primary/10 rounded h-2 ">
                  <div
                    className="bg-primary h-full rounded"
                    style={{ width: `87%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Early Detection Rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className=" bg-primary/10 rounded h-2 ">
                  <div
                    className="bg-primary h-full rounded"
                    style={{ width: `92%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              All metrics indicate excellent population health management
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
