import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type LabTest = {
  id: number;
  test_name: string;
  sample_type: string;
  price: string;
  is_available: boolean;
};

export async function listLabTestsApi() {
  const { data } = await http.get<Paginated<LabTest>>("/api/lab_tests/");
  return data;
}

export async function createLabTestApi(payload: Omit<LabTest, "id">) {
  const { data } = await http.post<LabTest>("/api/lab_tests/", payload);
  return data;
}

export async function updateLabTestApi(id: number, payload: Partial<LabTest>) {
  const { data } = await http.put<LabTest>(`/api/lab_tests/${id}/`, payload);
  return data;
}

export async function deleteLabTestApi(id: number) {
  await http.delete(`/api/lab_tests/${id}/`);
}
