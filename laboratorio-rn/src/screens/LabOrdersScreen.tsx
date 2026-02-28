import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listLabTestsApi } from "../api/lab_tests.api";
import {
  listLabOrdersApi,
  createLabOrderApi,
  deleteLabOrderApi,
} from "../api/lab_orders.api";

import type { LabTest } from "../types/labTest";
import type { LabOrder } from "../types/labOrder";
import type { LabOrderStatus } from "../types/labOrder";
import { toArray } from "../types/drf";

const STATUS_OPTIONS: LabOrderStatus[] = ["created", "processing", "cancelled"];

export default function LabOrdersScreen() {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);

  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [patient_name, setPatient_name] = useState("");
  const [status, setStatus] = useState<LabOrderStatus>("created");
  const [result_summary, setResult_summary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const testById = useMemo(() => {
    const map = new Map<number, LabTest>();
    tests.forEach((t) => map.set(t.id, t));
    return map;
  }, [tests]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [ordersData, testsData] = await Promise.all([
        listLabOrdersApi(),
        listLabTestsApi(),
      ]);

      const ordersList = toArray(ordersData);
      const testsList = toArray(testsData);

      setOrders(ordersList);
      setTests(testsList);

      if (selectedTestId === null && testsList.length) setSelectedTestId(testsList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar. ¿Token? ¿Backend encendido?");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createOrder = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedTestId === null) return setErrorMessage("Seleccione una prueba");
      if (!patient_name.trim()) return setErrorMessage("Nombre del paciente requerido");
      if (!result_summary.trim()) return setErrorMessage("Resumen del resultado requerido");

      const created = await createLabOrderApi({
        test_id: selectedTestId,
        patient_name: patient_name.trim(),
        status,
        result_summary: result_summary.trim(),
      });

      setOrders((prev) => [created, ...prev]);
      setPatient_name("");
      setResult_summary("");
      setStatus("created");
    } catch {
      setErrorMessage("No se pudo crear orden.");
    }
  };

  const removeOrder = async (id: number): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteLabOrderApi(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar orden.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Órdenes de laboratorio</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Prueba</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedTestId ?? ""}
          onValueChange={(value) => setSelectedTestId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {tests.map((t) => (
            <Picker.Item key={t.id} label={t.test_name} value={t.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Paciente</Text>
      <TextInput
        placeholder="Nombre del paciente"
        placeholderTextColor="#8b949e"
        value={patient_name}
        onChangeText={setPatient_name}
        style={styles.input}
      />

      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value as LabOrderStatus)}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {STATUS_OPTIONS.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Resumen resultado</Text>
      <TextInput
        placeholder="Resumen"
        placeholderTextColor="#8b949e"
        value={result_summary}
        onChangeText={setResult_summary}
        style={styles.input}
      />

      <Pressable onPress={createOrder} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear orden</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const t = testById.get(item.test_id);
          const testLabel = t ? t.test_name : `Prueba #${item.test_id}`;
          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{testLabel}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{item.patient_name}</Text>
                <Text style={styles.rowSub}>{item.status} — {item.result_summary}</Text>
              </View>
              <Pressable onPress={() => removeOrder(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});
