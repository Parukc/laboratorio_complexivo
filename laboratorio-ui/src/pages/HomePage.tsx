import { Container, Paper, Typography, Stack } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ScienceIcon />
          <Typography variant="h5">Laboratorio UI</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API de laboratorio (laboratorio_api, DRF paginado).
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Lista órdenes (público) → Login → Admin → CRUD Pruebas / Órdenes de laboratorio.
        </Typography>
      </Paper>
    </Container>
  );
}