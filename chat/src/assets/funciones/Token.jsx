import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Token({ ruta }) {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/${ruta}`, { withCredentials: true })
            .then(res => {
                setUsuario(res.data.usuario);
            })
            .catch((error) => {
                console.error("Error de autenticación:", error?.response?.data || error.message);
                navigate('/login');
            });
    }, [ruta, navigate]);

    return usuario;
}

export default Token;