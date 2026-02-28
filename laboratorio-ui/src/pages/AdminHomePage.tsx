import { Container, Paper, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminHomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Panel Admin Laboratorio</Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" component={Link} to="/admin/pruebas">CRUD Pruebas de laboratorio</Button>
          <Button variant="contained" component={Link} to="/admin/ordenes">CRUD Órdenes de laboratorio</Button>
        </Stack>
      </Paper>
    </Container>
  );
}