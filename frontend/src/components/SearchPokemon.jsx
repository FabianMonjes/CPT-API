import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { Search } from "lucide-react"; // Puedes usar Heroicons, FontAwesome o cualquier ícono SVG también

export default function SearchPokemon() {
    const [query, setQuery] = useState("");
    const [searchText, setSearchText] = useState('');
    const { data, loading, fetchData } = useApi('http://localhost:3000/pokemon/cards/');


    useEffect(() => {
      if (query.length >= 3) {
        fetchData({ name:query });
      }
    }, [query]);

    const handleSelectCard = (card) => {
      console.log(`Seleccionaste: ${card.name} - #${card.number}`);
    };

    const handleChange = (e) => {
        const name = e.target.value;
        setQuery(name);
    };

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
        {data && data.length > 0 && (
          <ul className="mt-4 bg-white/10 rounded-lg p-4 text-white">
            {data.map((card) => (
              <li
                key={card.id}
                className="py-2 px-4 hover:bg-purple-500 rounded-lg cursor-pointer transition duration-200"
                onClick={() => handleSelectCard(card)}
              >
                {card.name} - #{card.number}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </>
);
}
