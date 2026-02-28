import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

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

export async function listLabOrdersPublicApi() {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab_orders/");
  return data;
}

export async function listLabOrdersAdminApi() {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab_orders/");
  return data;
}

export async function createLabOrderApi(payload: Omit<LabOrder, "id" | "created_at" | "lab_tests_name">) {
  const { data } = await http.post<LabOrder>("/api/lab_orders/", payload);
  return data;
}

export async function updateLabOrderApi(id: number, payload: Partial<LabOrder>) {
  const { data } = await http.put<LabOrder>(`/api/lab_orders/${id}/`, payload);
  return data;
}

export async function deleteLabOrderApi(id: number) {
  await http.delete(`/api/lab_orders/${id}/`);
}
