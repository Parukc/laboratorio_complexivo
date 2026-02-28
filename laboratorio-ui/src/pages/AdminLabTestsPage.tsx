import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel, Switch
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  type LabTest,
  listLabTestsApi,
  createLabTestApi,
  updateLabTestApi,
  deleteLabTestApi,
} from "../api/lab_tests.api";

export default function AdminLabTestsPage() {
  const [items, setItems] = useState<LabTest[]>([]);
  const [test_name, setTest_name] = useState("");
  const [sample_type, setSample_type] = useState("");
  const [price, setPrice] = useState("0");
  const [is_available, setIs_available] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const getApiErrorMessage = (err: unknown, defaultMsg = "Error al conectar con el backend."): string => {
    const ax = err as { response?: { status?: number; data?: unknown } };
    const status = ax?.response?.status;
    const data = ax?.response?.data as Record<string, unknown> | undefined;
    let backendMsg = "";
    if (data && typeof data === "object") {
      const d = data.detail;
      if (typeof d === "string") backendMsg = d;
      else if (Array.isArray(d) && d[0]) backendMsg = String(d[0]);
      else if (Array.isArray(data.test_name) && data.test_name[0]) backendMsg = String(data.test_name[0]);
      else if (Array.isArray(data.sample_type) && data.sample_type[0]) backendMsg = String(data.sample_type[0]);
    }
    if (status === 403) return "El usuario debe ser staff. En Django admin: Usuarios → tu usuario → marcar 'Staff'.";
    if (status === 401) return "Sesión expirada o no autenticado. Vuelve a iniciar sesión.";
    if (backendMsg) return backendMsg;
    if (status === 500) return "Error 500 en el servidor. Revisa la consola donde corre laboratorio_api (Django) para ver el traceback.";
    if (status) return `Error ${status}. ${defaultMsg}`;
    return defaultMsg;
  };

  const load = async () => {
    try {
      setError("");
      const data = await listLabTestsApi();
      setItems(data.results);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setError("");
      if (!test_name.trim()) return setError("Nombre de prueba requerido");
      if (!sample_type.trim()) return setError("Tipo de muestra requerido");

      const payload = {
        test_name: test_name.trim(),
        sample_type: sample_type.trim(),
        price: String(Number(price) || 0),
        is_available,
      };

      if (editId) await updateLabTestApi(editId, payload);
      else await createLabTestApi(payload);

      setEditId(null);
      setTest_name("");
      setSample_type("");
      setPrice("0");
      setIs_available(true);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "No se pudo guardar prueba. Revisa backend y que el usuario sea staff."));
    }
  };

  const startEdit = (t: LabTest) => {
    setEditId(t.id);
    setTest_name(t.test_name);
    setSample_type(t.sample_type);
    setPrice(String(t.price));
    setIs_available(t.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteLabTestApi(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Pruebas de laboratorio</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
          <TextField
            label="Nombre de prueba"
            value={test_name}
            onChange={(e) => setTest_name(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Tipo de muestra"
            value={sample_type}
            onChange={(e) => setSample_type(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ width: 120 }}
          />
          <FormControlLabel
            control={<Switch checked={is_available} onChange={(e) => setIs_available(e.target.checked)} />}
            label="Disponible"
          />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setEditId(null); setTest_name(""); setSample_type(""); setPrice("0"); setIs_available(true); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prueba</TableCell>
              <TableCell>Tipo muestra</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.test_name}</TableCell>
                <TableCell>{t.sample_type}</TableCell>
                <TableCell>{t.price}</TableCell>
                <TableCell>{t.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(t)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
