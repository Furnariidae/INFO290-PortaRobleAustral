import { faChevronLeft, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./nuevo.css";

const NuevoAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [nombre_usuario, setNombre_usuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Sesión cerrada');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evitar que la página se recargue

    let hasError = false;

    // Si no hay errores, continuar con el envío
    if (!hasError) {
      const adminPayload = {
        username: nombre,
        correo: correo,
        password: password,
        nickname: nombre_usuario,
      }
      console.log(adminPayload);

      try {
        const response = /* adminEditado  ?
          await fetch(`${apiUrl}/admin/${adminEditado.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(adminPayload)
          }) : */
          await fetch(`${apiUrl}/admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(adminPayload)
          });

        if (response.ok) {
          const data = await response.json();
          console.log( /* adminEditado ? "Admin editado exitosamente" : */ "Admin creado exitosamente", data);
          navigate(-1);
        } else {
          console.error( /*  adminEditado ? "Error al editar a el admin" : */ "Error al crear a el admin", response.statusText);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    }
  };

  return (
    <div className="nuevo">
      <div className="header">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="back-button"
          onClick={() => navigate(-1)}
        />
        <h1>Crear Administrador</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <label htmlFor="nombre" className="label">Nombre:</label>
          <TextField
            required
            id="nombre"
            name="nombre"
            label="Ingrese el nombre ..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <label htmlFor="correo" className="label">Email:</label>
          <TextField
            required
            type="email"
            id="correo"
            name="correo"
            label="Ingrese el correo ..."
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <label htmlFor="nombre_usuario" className="label">Nombre de usuario:</label>
          <TextField
            required
            id="nombre_usuario"
            name="nombre_usuario"
            label="Ingrese el nombre de usuario ..."
            value={nombre_usuario}
            onChange={(e) => setNombre_usuario(e.target.value)}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <label htmlFor="password" className="label">Contraseña:</label>
          <TextField
            required
            type="password"
            id="password"
            name="password"
            label="Ingrese la contraseña ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                inputProps: {
                  minLength: 8,
                },
              },
            }}
            error={password.length > 0 && password.length < 8}
            helperText={password.length > 0 && password.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : ""}
          />
        </div>

        <button type="submit" className="save-button">Guardar</button>
      </form>
    </div>
  );
};

export default NuevoAdmin;
