export type LabOrderStatus = "created" | "processing" | "cancelled";

export type LabOrder = {
  id: number;
  test_id: number;
  lab_tests_name?: string;
  patient_name: string;
  status: LabOrderStatus;
  result_summary: string;
  created_at: string;
};
