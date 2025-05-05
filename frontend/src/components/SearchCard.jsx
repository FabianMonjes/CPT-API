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
            <h2 className="text-2xl text-purple-300 font-semibold mb-2 text-center animate-typewriter">
                {nombre} - #{numero}
            </h2>

            <p className="text-sm text-gray-400 mb-4 text-center italic">
            {rareza} · {set} · {set_series}
            </p>

            <div className="flex flex-col md:flex-row w-full gap-6 items-center">
            {/* Imagen con overlay */}
            <div
                className="relative group w-full md:w-1/3 flex justify-center"
                onClick={() => setShowZoom(true)}
            >
                <img
                src={imagen}
                alt={nombre}
                className="w-64 h-auto rounded-lg border-4 border-purple-500 shadow-[0_0_20px_5px_rgba(168,85,247,0.6)] animate-card"
                />
                {/* Overlay con ícono */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <div className="bg-purple-600/80 p-2 rounded-full">
                    <Search size={28} color="white" />
                </div>
                </div>
            </div>

            {/* Valor principal */}
            <div className="flex flex-col items-center justify-center w-full md:w-2/3">
                <div className="bg-purple-800/30 p-5 rounded-lg text-white text-center w-full">
                <p className="text-sm text-purple-300">Valor destacado (USD)</p>
                <p className="text-lg font-bold animate-num">${valor_actual}</p>
                </div>

                {url_tcgplayer && (
                <a
                    href={url_tcgplayer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all"
                >
                    Ver en TCGPlayer
                </a>
                )}
            </div>
            </div>

            {/* Precios por edición */}
            {precios_ediciones && Object.keys(precios_ediciones).length > 1 && (
            <div className="mt-6 w-full">
                <h3 className="text-md text-purple-300 font-semibold mb-2 text-center">
                Precios por edición:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(precios_ediciones).map(([edicion, { valor }]) => (
                    <div
                    key={edicion}
                    className="bg-purple-900/40 p-4 rounded-md text-white text-center shadow"
                    >
                    <h4 className="text-purple-300 font-semibold mb-1">{edicion}</h4>
                    <p className="text-lg font-bold">
                        {valor ? `$${valor}` : "N/A"}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>

        {/* Modal */}
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
