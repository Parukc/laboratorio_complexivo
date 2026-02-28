import { useEffect, useState } from "react";
import {Container,Paper,Typography,Button,Stack,Table,TableHead,TableRow,TableCell,TableBody,} from "@mui/material";
import { listLabOrdersPublicApi } from "../api/lab_orders.api";
import type { LabOrder } from "../api/lab_orders.api";

export default function PublicLabPage() {
  const [items, setItems] = useState<LabOrder[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listLabOrdersPublicApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar la lista. ¿Backend encendido?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de órdenes de laboratorio (público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prueba</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Creado</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
