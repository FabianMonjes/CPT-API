import { useState } from "react";
import { Search } from "lucide-react"; // Puedes usar Heroicons, FontAwesome o cualquier ícono SVG también

export default function SearchPokemon() {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        console.log("Buscando...:", value); // Aquí va el POST al backend más adelante
    };

return (
  <>
    <h1 className="text-4xl font-bold text-center text-purple-400">
      Busca tu carta Pokémon
    </h1>
    <br />
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
      </div>
    </div>
  </>
    
  );
}
