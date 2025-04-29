import { useState, useEffect } from 'react';
import useApiFlexible from '../hooks/useApi';
import { Search } from "lucide-react";
import SearchCard from './SearchCard.jsx';


export default function SearchPokemon() {
  const [query, setQuery] = useState("");
  const { data , loading, fetchData } = useApiFlexible('http://localhost:8009/');
  const [detalle, setDetalle] = useState(null)
  // Estado para controlar el debounce
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (query.length >= 3) {
      // Limpiamos el timeout anterior si existe
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Establecemos un nuevo timeout
      const timeout = setTimeout(() => {
        fetchData({ pokemon: query });
      }, 500); // Espera 500ms después de que el usuario deje de escribir

      setDebounceTimeout(timeout); // Guardamos el timeout para limpiar en el siguiente cambio
    }

    // Limpiar el timeout cuando el componente se desmonte
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [query]);

  const handleSelectCard = async  (card) => {
    const result = await fetchData({ pokemon: card.nombre_carta, id: card.numero });
    console.log('RESPUESTA : ',result)
    setDetalle(result.Dato);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Adaptamos aquí: como `data.pokemons` ahora es un objeto, lo transformamos en array
  const pokemonsArray = data?.pokemons ? Object.values(data.pokemons) : [];

  return (
    <>
      <h1 className="text-4xl font-bold text-center text-purple-400">
        Busca tu carta Pokémon
      </h1>
      <p className="text-lg text-center text-gray-300 mb-8">
        Encuentra el valor actual de tus cartas Pokémon y mantente siempre informado.
      </p>
      <div className="flex justify-center items-center py-10">
        <div className="relative w-full max-w-3xl">
          <input
            type="text"
            placeholder="Busca tu carta"
            value={query}
            onChange={handleChange}
            className="w-full pl-14 pr-6 py-4 rounded-full bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 text-lg"
            disabled={loading}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={24} />
          </div>

          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="animate-spin w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path fill="currentColor" d="M4 12h16" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* Mejorado: Cargando... */}
      {loading && (
        <div className="text-center mt-4">
          <p className="text-xl text-gray-400 animate-pulse">Cargando...</p>
        </div>
      )}
      {/* Lista de resultados debajo del input */}
      {pokemonsArray.length > 0 && (
        <>
        <h5 className="text-4xl font-bold text-center text-purple-400 mb-3">Resultado</h5>
        <div className="flex justify-center items-center relative w-full px-4">
          <ul className="mt-0 bg-white/10 rounded-lg p-2 text-white max-h-[150px] overflow-y-auto flex flex-col items-center w-[768px]">
            {pokemonsArray.map((card, index) => (
              <li
                key={`${card.nombre_carta}-${card.numero}-${index}`}
                className="py-1 px-3 hover:bg-purple-500 rounded-lg cursor-pointer transition duration-200 w-full text-center"
                onClick={() => handleSelectCard(card)}
              >
                {card.nombre_carta} - #{card.numero}
              </li>
            ))}
          </ul>
        </div></>
      )}

      {/* Aquí mostramos el detalle de la carta seleccionada */}
      {detalle && <SearchCard detalle={detalle}/>}

    </>
  );
}
