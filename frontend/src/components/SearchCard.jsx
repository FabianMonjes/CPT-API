import { useState } from 'react';
const [zoomOpen, setZoomOpen] = useState(false);

const SearchCard = ({ detalle }) => {
        if (!detalle) return null;
    
        const {
            nombre,
            numero,
            imagen,
            valor_actual,
            valor_minimo,
            valor_reversa,
            valor_maximo
        } = detalle;
        return (
        <div className="flex flex-col items-center mt-6 bg-gradient-to-br from-purple-900/30 via-purple-800/30 to-purple-900/30 rounded-xl p-6 w-full max-w-3xl mx-auto shadow-2xl border border-purple-500/30 backdrop-blur-md">
            <h2 className="text-2xl text-purple-200 font-bold mb-4 drop-shadow-lg">
            {nombre}
            </h2>
            <div className="flex flex-col md:flex-row w-full gap-6 items-center md:items-start">
            {/* Imagen a la izquierda */}
            <div className="w-80 h-auto flex justify-center neon-glow transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
                <img
                    src={imagen}
                    alt={nombre}
                    className="w-full h-auto rounded-lg border-4 border-purple-500 shadow-[0_0_25px_8px_rgba(168,85,247,0.6)]"
                />
            </div>
            {/* Valores a la derecha */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
                {[
                { label: "Actual", value: valor_actual },
                { label: "Mínimo", value: valor_minimo },
                { label: "Reversa", value: valor_reversa },
                { label: "Máximo", value: valor_maximo }
                ].map((item, idx) => (
                <div
                    key={idx}
                    className="bg-purple-900/50 p-4 rounded-xl text-white text-center shadow-lg border border-purple-500/30 hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-sm text-purple-300">{item.label}</p>
                    <p className="text-lg font-bold text-purple-100">${item.value}</p>
                </div>
                ))}
            </div>
            </div>
        </div>
        );
    };
    
    export default SearchCard;
  