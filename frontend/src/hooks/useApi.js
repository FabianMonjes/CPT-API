import { useState } from 'react';
import axios from 'axios';

const useApiFlexible = (baseBaseUrl, method = 'GET') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
        const { pokemon, id } = params;

        if (!pokemon) {
            throw new Error("Se requiere al menos el nombre del Pokémon");
        }

        // 🛠️ Ahora construir bien el endpoint según si hay ID
        let url = '';
        if (id !== undefined && id !== null) {
            url = `${baseBaseUrl}BusquedaPokemonDetalle/${encodeURIComponent(pokemon)}/${encodeURIComponent(id)}`;
        } else {
            url = `${baseBaseUrl}BusquedaPokemon/${encodeURIComponent(pokemon)}`;
        }

        const response = await axios({
            method,
            url,
        });

        console.log("Respuesta completa (flexible 2.0):", response);

        const resultado = response.data?.resultado || {};

        if (resultado.Cartas) {
            setData({ pokemons: resultado.Cartas });
        } else if (resultado.Carta) {
            setData({ detalle: resultado });
        } else {
            setData({ resultado });
        }
        return resultado;
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

export default useApiFlexible;
