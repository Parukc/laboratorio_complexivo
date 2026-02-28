import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { LabOrder } from "../types/labOrder";

export async function listLabOrdersApi(): Promise<Paginated<LabOrder>> {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab_orders/");
  return data;
}

export async function createLabOrderApi(payload: Omit<LabOrder, "id" | "created_at" | "lab_tests_name">): Promise<LabOrder> {
  const { data } = await http.post<LabOrder>("/api/lab_orders/", payload);
  return data;
}

export async function updateLabOrderApi(id: number, payload: Partial<LabOrder>): Promise<LabOrder> {
  const { data } = await http.put<LabOrder>(`/api/lab_orders/${id}/`, payload);
  return data;
}

export async function deleteLabOrderApi(id: number): Promise<void> {
  await http.delete(`/api/lab_orders/${id}/`);
}
