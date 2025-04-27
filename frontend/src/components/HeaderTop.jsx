import { useState, useEffect } from "react";

const slides = [
  // {
  //   title: "Consulta en Tiempo Real",
  //   img: "pikachu_header.gif",
  //   color: "text-yellow-400",
  //   description: "Encuentra el valor actual de tus cartas Pokémon y mantente siempre informado."
  // },
  {
    title: "Tu Billetera Virtual Pokémon",
    img: "gengar_header.gif",
    color: "text-purple-400",
    description: "Guarda tus cartas digitales de forma segura y haz seguimiento de su evolución en el mercado."
  }
];

export default function HeaderTop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <section className="w-full flex justify-center py-24 bg-transparent transition-all duration-1000 ease-in-out">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center px-6">
        <div className="flex justify-center items-center">
          <img
            key={current.img} // Para forzar la transición con cambio de key
            src={current.img}
            alt={current.title}
            className="w-72 h-72 object-contain opacity-100 transition-opacity duration-[1500ms] ease-in-out"
          />
        </div>

        <div className="text-white text-center md:text-left space-y-6 bg-transparent transition-all duration-700 ease-in-out">
          <h1 className={`text-5xl md:text-6xl font-extrabold ${current.color}`}>
            {current.title}
          </h1>
          <p className="text-lg text-gray-200">{current.description}</p>
          <hr className="border-t-4 border-white/30 w-4/5 md:w-3/4 mx-auto md:mx-0 rounded-full transition-all duration-500" />
        </div>
      </div>
    </section>
  );
}
