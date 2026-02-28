import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listLabTestsApi, createLabTestApi, deleteLabTestApi } from "../api/lab_tests.api";
import type { LabTest } from "../types/labTest";
import { toArray } from "../types/drf";

function trim(s: string): string {
  return s.trim();
}

export default function LabTestsScreen() {
  const [items, setItems] = useState<LabTest[]>([]);
  const [test_name, setTest_name] = useState("");
  const [sample_type, setSample_type] = useState("");
  const [price, setPrice] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listLabTestsApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar pruebas. ¿Login? ¿Token?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const name = trim(test_name);
      const sample = trim(sample_type);
      if (!name) return setErrorMessage("Nombre de prueba requerido");
      if (!sample) return setErrorMessage("Tipo de muestra requerido");

      const created = await createLabTestApi({
        test_name: name,
        sample_type: sample,
        price: String(Number(price) || 0),
        is_available: true,
      });

      setItems((prev) => [created, ...prev]);
      setTest_name("");
      setSample_type("");
      setPrice("0");
    } catch {
      setErrorMessage("No se pudo crear prueba.");
    }
  };

  const removeItem = async (id: number): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteLabTestApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar prueba.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pruebas de laboratorio</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Nombre de prueba</Text>
      <TextInput
        value={test_name}
        onChangeText={setTest_name}
        placeholder="Traumatologo"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de muestra</Text>
      <TextInput
        value={sample_type}
        onChangeText={setSample_type}
        placeholder="Sangre"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="0"
        placeholderTextColor="#8b949e"
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.test_name}</Text>
              <Text style={styles.rowSub}>{item.sample_type} — {item.price}</Text>
            </View>
            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
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
  del: { color: "#ff7b72", fontWeight: "700" },
});
