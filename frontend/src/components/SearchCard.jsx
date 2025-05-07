import { useState } from "react";
import { Search, X } from "lucide-react";

const SearchCard = ({ detalle }) => {
  const [showZoom, setShowZoom] = useState(false);

  if (!detalle) return null;

  const {
    nombre,
    numero,
    imagen,
    valor_actual,
    rareza,
    set,
    set_series,
    url_tcgplayer,
    precios_ediciones = {},
  } = detalle;

  return (
    <>
      <div className="flex flex-col items-center mt-6 bg-white/5 rounded-lg p-6 w-full max-w-3xl mx-auto shadow-lg border border-purple-400">
        <h2 className="text-2xl text-purple-300 font-semibold mb-4 text-center animate-typewriter">
          {nombre} - #{numero}
        </h2>

        {/* Ficha TCG: Rareza, Set y Serie */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white mb-6 w-full">
          <div className="bg-purple-700/20 rounded-lg p-3 text-center border border-purple-500">
            <p className="text-purple-300 font-semibold mb-1">Rareza</p>
            <p>{rareza || "N/A"}</p>
          </div>
          <div className="bg-purple-700/20 rounded-lg p-3 text-center border border-purple-500">
            <p className="text-purple-300 font-semibold mb-1">Set</p>
            <p>{set || "N/A"}</p>
          </div>
          <div className="bg-purple-700/20 rounded-lg p-3 text-center border border-purple-500">
            <p className="text-purple-300 font-semibold mb-1">Serie</p>
            <p>{set_series || "N/A"}</p>
          </div>
        </div>

        {/* Imagen con overlay */}
        <div
          className="relative group w-full md:w-1/3 flex justify-center mb-6 cursor-pointer"
          onClick={() => setShowZoom(true)}
        >
          <img
            src={imagen}
            alt={nombre}
            className="w-64 h-auto rounded-lg border-4 border-purple-500 shadow-[0_0_20px_5px_rgba(168,85,247,0.6)] animate-card"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
            <div className="bg-purple-600/80 p-2 rounded-full">
              <Search size={28} color="white" />
            </div>
          </div>
        </div>

        {/* Precios por edición */}
        {precios_ediciones && Object.keys(precios_ediciones).length > 0 && (
          <div className="w-full">
            <h3 className="text-md text-purple-300 font-semibold mb-3 text-center">
              Valores por edición (USD)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(precios_ediciones).map(([edicion, { valor }]) => {
                const isDestacado =
                  valor_actual && parseFloat(valor_actual).toFixed(2) === parseFloat(valor).toFixed(2);

                return (
                  <div
                    key={edicion}
                    className={`p-4 rounded-md text-white text-center shadow border ${
                      isDestacado
                        ? "border-yellow-400 bg-yellow-500/10"
                        : "bg-purple-900/40 border-purple-800"
                    }`}
                  >
                    <h4 className="text-purple-300 font-semibold mb-1">{edicion}</h4>
                    <p className={`text-lg font-bold animate-num ${isDestacado ? "text-yellow-300" : ""}`}>
                      {valor ? `$${valor}` : "N/A"}
                    </p>
                    {isDestacado && <p className="text-xs mt-1 text-yellow-300">⭐ Valor destacado</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón TCGPlayer */}
        {url_tcgplayer && (
          <a
            href={url_tcgplayer}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all"
          >
            Ver en TCGPlayer
          </a>
        )}
      </div>

      {/* Modal Zoom */}
      {showZoom && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="relative">
            <img
              src={imagen}
              alt={`Zoom de ${nombre}`}
              className="w-[90vw] max-w-md rounded-lg border-4 border-purple-500 shadow-xl"
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-2 right-2 bg-purple-700 hover:bg-purple-600 text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchCard;
