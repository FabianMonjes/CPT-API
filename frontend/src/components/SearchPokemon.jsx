import { useState } from "react";
import { Search } from "lucide-react"; // Puedes usar Heroicons, FontAwesome o cualquier ícono SVG también

export default function SearchPokemon() {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        console.log("Buscando:", value); // Aquí va el POST al backend más adelante
    };

return (
    <div className="flex justify-center items-center py-10">
        <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busca tu carta"
              value={query}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
      </div>
    </div>
  );
}
