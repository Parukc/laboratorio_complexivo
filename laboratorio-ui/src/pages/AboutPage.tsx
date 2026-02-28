import { Container, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
    
export default function AboutPage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Acerca de</Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Endpoints usados:
        </Typography>

        <List dense>
          <ListItem><ListItemText primary="POST /api/auth/login/ (JWT)" /></ListItem>
          <ListItem><ListItemText primary="GET /api/lab_orders/ (listado público, paginado)" /></ListItem>
          <ListItem><ListItemText primary="CRUD /api/lab_tests/ (admin, paginado)" /></ListItem>
          <ListItem><ListItemText primary="CRUD /api/lab_orders/ (admin, paginado)" /></ListItem>
        </List>

        <Typography variant="body2" color="text.secondary">
          Base URL: VITE_API_BASE_URL.
        </Typography>
      </Paper>
    </Container>
  );
}