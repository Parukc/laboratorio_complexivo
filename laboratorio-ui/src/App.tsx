import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PublicLabPage from "./pages/PublicLabPage";
import LoginPage from "./pages/LoginPage";

import AdminHomePage from "./pages/AdminHomePage";
import AdminLabTestsPage from "./pages/AdminLabTestsPage";
import AdminLabOrdersPage from "./pages/AdminLabOrdersPage";

import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Laboratorio UI
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/acerca">Acerca</Button>
            <Button color="inherit" component={Link} to="/lista">Lista órdenes</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acerca" element={<AboutPage />} />
        <Route path="/lista" element={<PublicLabPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminHomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/pruebas"
          element={
            <RequireAuth>
              <AdminLabTestsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/ordenes"
          element={
            <RequireAuth>
              <AdminLabOrdersPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}