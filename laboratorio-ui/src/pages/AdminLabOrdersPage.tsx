import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type LabTest, listLabTestsApi } from "../api/lab_tests.api";
import {
  type LabOrder,
  type LabOrderStatus,
  listLabOrdersAdminApi,
  createLabOrderApi,
  updateLabOrderApi,
  deleteLabOrderApi,
} from "../api/lab_orders.api";

const STATUS_OPTIONS: LabOrderStatus[] = ["created", "processing", "cancelled"];

export default function AdminLabOrdersPage() {
  const [items, setItems] = useState<LabOrder[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [test_id, setTest_id] = useState<number>(0);
  const [patient_name, setPatient_name] = useState("");
  const [status, setStatus] = useState<LabOrderStatus>("created");
  const [result_summary, setResult_summary] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listLabOrdersAdminApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar órdenes. ¿Login? ¿Token admin?");
    }
  };

  const loadTests = async () => {
    try {
      const data = await listLabTestsApi();
      setTests(data.results);
      if (!test_id && data.results.length > 0) setTest_id(data.results[0].id);
    } catch {
      // no bloquea
    }
  };

  useEffect(() => {
    load();
    loadTests();
  }, []);

  const save = async () => {
    try {
      setError("");
      if (!test_id) return setError("Seleccione una prueba");
      if (!patient_name.trim()) return setError("Nombre del paciente requerido");
      if (!result_summary.trim()) return setError("Resumen del resultado requerido");

      const payload = {
        test_id: Number(test_id),
        patient_name: patient_name.trim(),
        status,
        result_summary: result_summary.trim(),
      };

      if (editId) await updateLabOrderApi(editId, payload);
      else await createLabOrderApi(payload);

      setEditId(null);
      setPatient_name("");
      setStatus("created");
      setResult_summary("");
      await load();
    } catch {
      setError("No se pudo guardar orden. ¿Token admin?");
    }
  };

  const startEdit = (o: LabOrder) => {
    setEditId(o.id);
    setTest_id(o.test_id);
    setPatient_name(o.patient_name);
    setStatus(o.status as LabOrderStatus);
    setResult_summary(o.result_summary);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteLabOrderApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar orden. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Órdenes de laboratorio</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ minWidth: 260 }}>
              <InputLabel id="test-label">Prueba</InputLabel>
              <Select
                labelId="test-label"
                label="Prueba"
                value={test_id}
                onChange={(e) => setTest_id(Number(e.target.value))}
              >
                {tests.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.test_name} (#{t.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Paciente"
              value={patient_name}
              onChange={(e) => setPatient_name(e.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(e.target.value as LabOrderStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Resumen resultado"
              value={result_summary}
              onChange={(e) => setResult_summary(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setPatient_name(""); setStatus("created"); setResult_summary(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadTests(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prueba</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.lab_tests_name ?? o.test_id}</TableCell>
                <TableCell>{o.patient_name}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>{o.result_summary}</TableCell>
                <TableCell>{o.created_at ? new Date(o.created_at).toLocaleString() : "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(o)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(o.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
