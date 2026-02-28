import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { loginApi } from "../api/auth.api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      setMsg({ type: "error", text: "Sesión expirada. Vuelve a iniciar sesión." });
    }
  }, [searchParams]);

  const doLogin = async () => {
    try {
      const data = await loginApi(username, password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setMsg({ type: "success", text: "Login OK. Redirigiendo a Admin..." });
      navigate("/admin");
    } catch {
      setMsg({ type: "error", text: "Login falló. Revisa credenciales y backend." });
    }
  };

  const clear = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setMsg({ type: "success", text: "Tokens eliminados (logout local)." });
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login (JWT)</Typography>

        <Stack spacing={2}>
          {msg && <Alert severity={msg.type}>{msg.text}</Alert>}

          <TextField label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button variant="contained" onClick={doLogin}>Ingresar</Button>
          <Button variant="outlined" onClick={clear}>Eliminar tokens</Button>
        </Stack>
      </Paper>
    </Container>
  );
}