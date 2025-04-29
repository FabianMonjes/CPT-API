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
    <div className="flex flex-col items-center mt-6 bg-white/5 rounded-lg p-4 w-full max-w-3xl mx-auto shadow-lg">
        <h2 className="text-xl text-purple-300 font-semibold mb-2">
        {nombre} - #{numero}
        </h2>
        <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Imagen a la izquierda */}
        <div className="flex justify-center md:justify-start w-full md:w-1/3">
            <img src={imagen} alt={nombre} className="w-48 h-auto rounded-lg border border-purple-400" />
        </div>

        {/* Valores a la derecha */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
            <div className="bg-purple-800/30 p-3 rounded-lg text-white text-center">
            <p className="text-sm text-purple-300">Actual</p>
            <p className="text-lg font-bold">${valor_actual}</p>
            </div>
            <div className="bg-purple-800/30 p-3 rounded-lg text-white text-center">
            <p className="text-sm text-purple-300">Mínimo</p>
            <p className="text-lg font-bold">${valor_minimo}</p>
            </div>
            <div className="bg-purple-800/30 p-3 rounded-lg text-white text-center">
            <p className="text-sm text-purple-300">Reversa</p>
            <p className="text-lg font-bold">${valor_reversa}</p>
            </div>
            <div className="bg-purple-800/30 p-3 rounded-lg text-white text-center">
            <p className="text-sm text-purple-300">Máximo</p>
            <p className="text-lg font-bold">${valor_maximo}</p>
            </div>
        </div>
        </div>
    </div>
    );
};

export default SearchCard;
