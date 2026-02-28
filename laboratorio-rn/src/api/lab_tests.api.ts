import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { LabTest } from "../types/labTest";

export async function listLabTestsApi(): Promise<Paginated<LabTest>> {
  const { data } = await http.get<Paginated<LabTest>>("/api/lab_tests/");
  return data;
}

export async function createLabTestApi(payload: Omit<LabTest, "id">): Promise<LabTest> {
  const { data } = await http.post<LabTest>("/api/lab_tests/", payload);
  return data;
}

export async function updateLabTestApi(id: number, payload: Partial<LabTest>): Promise<LabTest> {
  const { data } = await http.put<LabTest>(`/api/lab_tests/${id}/`, payload);
  return data;
}

export async function deleteLabTestApi(id: number): Promise<void> {
  await http.delete(`/api/lab_tests/${id}/`);
}
