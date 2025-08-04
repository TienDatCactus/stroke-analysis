import React, { useEffect } from "react";
import { toast } from "sonner";
export type AnalysisResult = {
  [key: string]: string | number | null;
  "No.": number;
  Age: number;
  Sex: number;
  "ICD code": string;
  admissionSBP: number;
  admissionDBP: number;
  "Clinical symptoms beyond the NIHSS scale": string;
  Dizzy: string;
  "hearing loss": string;
  "Horizontal diplopia": string;
  "Vertical diplopia": string;
  "Other double vision": string;
  Headache: string;
  "Loss of vision": string;
  "Memory disorder": string;
  "NIHSS score": number;
  "Paralysis of lower limbs": number;
  "Disabling neurological deficit": string;
  "Dominant hemisphere lesion": number;
  "Admission window time": number;
  "END appearance time": number | null;
  "NIHSS score increased": number | null;
  "Stroke risk factor": string;
  Hypertension: number;
  "Atrial fibrillation or atrial flutter": string;
  Diabetes: string;
  Hypercholesterolemia: string;
  Smoking: string;
  Obesity: string;
  BMI: number;
  "Coronary artery disease history": string;
  "Heart failure history": number;
  "Ischemic stroke or TIA history": number;
  "Mechanical heart valve": string;
  mRS: number;
  "Bioprosthetic heart valve": string;
  Platelets: number;
  INR: number;
  Fibrinogen: number;
  aPTTs: number;
  Cholesterol: number;
  HDLC: number;
  LDLC: number;
  Triglycerid: number;
  Ure: number;
  Creatinine: number;
  GOT: number;
  GPT: number;
  "Blood glucose on admission": number;
  "Atrial fibrillation or flutter on admission": string;
  "Echocardiogram detected abnormalities": string;
  "moderate or severe mitral stenosis": string;
  "Echocardiography detects mechanical heart valve": string;
  "echocardiography detects heart failure": string;
  "echocardiography detects cardiac chamber thrombosis": string;
  "echocardiography detects bioprosthetic heart valve": string;
  OSLER: string;
  "echocardiography detected atrial septal defect": string;
  PFO: string;
  MRI: string;
  CTA: string;
  "number of cerebral infarction locations": number;
  "MCA infarction site": number;
  "PCA infarction site": number;
  "BA infarction site": number;
  "ACA infarction site": number;
  "AICA infarction site": number;
  "PICA infarction site": number;
  "VA infarction site": number;
  "SCA infarction site": number;
  "supratentorial cerebral infarction": string;
  "temporal lobe": string;
  "Internal capsule": number;
  "caudate nucleus": number;
  "lentiform nucleus": string;
  "Insula lobe": number;
  "cortical and subcortical": string;
  "Corona radiata": string;
  "External capsule": number;
  "Frontal lobe": string;
  "parietal lobe": string;
  "putamen nucleus": string;
  "corpus callosum": string;
  "infratentorial region": string;
  cerebellum: number;
  thalamus: string;
  "medulla oblongata": number;
  pons: number;
  "brain stem": number;
  "cerebellar peduncle": number;
  "occipital lobe": string;
  "cerebellar vermis": string;
  "hemorrhagic transformation": number;
  "degree of hemorrhagic transformation": number | null;
  "corresponding intracranial stenosis": number;
  "corresponding intracranial occlusion": number;
  "corresponding intracranial occlusion site ICA": number | null;
  "corresponding intracranial occlusion site MCA": number | null;
  "corresponding intracranial occlusion site BA": number | null;
  "corresponding intracranial occlusion site ACA": number | null;
  "corresponding intracranial occlusion site P2": number | null;
  "corresponding intracranial occlusion site PCA": number | null;
  "ipsilateral extracranial stenosis": number;
  "ipsilateral extracranial occlusion": number;
  "TOAST Classification": number;
  "Reperfusion therapy": number;
  thrombolytic: number;
  "rtPA dose": string;
  DTN: number;
  "mechanical thrombectomy": string;
  DTG: number | null;
  antithrombotic: string;
  SAPT: number;
  DAPT: number;
  anticoagulant: string;
  "anticoagulant vitamin K": string;
  apixaban: string;
  dabigatran: string;
  rivaroxaban: string;
  Statin: string;
  "Statin intensity level": number;
  "diabetes medication treatment": number;
  "hypertension medication treatment": number;
  "Days in hospital": number;
  "discharged mRS": number;
  "mRS 30 day": number;
  "stroke recurrence within 30 days": string;
  "mRS 90 day ": number;
  "stroke recurrence within 90 days": number;
  lookupId: number;
  prediction: string;
};
const useAnalysis = () => {
  const [analysisData, setAnalysisData] = React.useState<
    {
      timestamp: string;
      results: AnalysisResult[];
    }[]
  >([]);

  const fetchAnalysis = async () => {
    try {
      const response = await fetch("/api/analysis", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        toast.error("Failed to fetch analysis data.");
        return;
      }
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAnalysis();
  }, []);
  return analysisData;
};

export default useAnalysis;
