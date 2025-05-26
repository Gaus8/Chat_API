import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Token() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/perfil`, { withCredentials: true })
            .then(res => {
                setUsuario(res.data.usuario);
            })
            .catch(() => {
                navigate('/login');
            });
    }, [navigate]);

    return usuario;
}

