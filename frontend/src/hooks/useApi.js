import { useState } from 'react';
import axios from 'axios';

const useApi = (baseUrl, method = 'GET') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const { pokemon } = params;
        if (!pokemon) {
            throw new Error("Se requiere el nombre del Pokémon");
        }

        // 🔥 Ahora construimos bien la URL
        const url = `${baseUrl}${encodeURIComponent(pokemon)}`;

        const response = await axios({
            method,
            url,
        });

        console.log("Respuesta completa:", response);

        const cartas = response.data?.resultado?.Cartas || {};
        setData({ pokemons: cartas });
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        fetchData,
    };
};

export default useApi;
