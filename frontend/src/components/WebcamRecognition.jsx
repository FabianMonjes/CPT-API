import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw, Search } from "lucide-react";
import SearchCard from "./SearchCard.jsx";
import axios from "axios";

const API_BASE = "http://localhost:8009/";

export default function WebcamRecognition() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [textoExtraido, setTextoExtraido] = useState("");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      setError(null);
    } catch (err) {
      const name = err?.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError("Permiso de cámara denegado. Permite el acceso a la cámara en la configuración del navegador.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No se encontró ninguna cámara en este dispositivo.");
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        setError("La cámara está siendo usada por otra aplicación. Ciérrala e inténtalo de nuevo.");
      } else {
        setError("No se pudo acceder a la cámara. Verifica que hayas concedido los permisos necesarios.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setCapturedImage(null);
    setCandidates([]);
    setDetalle(null);
    setTextoExtraido("");
    setError(null);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.92));
    setCandidates([]);
    setDetalle(null);
    setTextoExtraido("");
    setError(null);
  }, []);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setCandidates([]);
    setDetalle(null);
    setTextoExtraido("");
    setError(null);
  }, []);

  const recognizeCard = useCallback(async () => {
    if (!capturedImage) return;

    setLoading(true);
    setError(null);

    try {
      const fetchRes = await fetch(capturedImage);
      const blob = await fetchRes.blob();

      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      const result = await axios.post(`${API_BASE}ReconocimientoCarta`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resultado = result.data?.resultado || {};
      setTextoExtraido(resultado.texto_extraido || "");

      if (resultado.Cartas) {
        setCandidates(Object.values(resultado.Cartas));
      } else {
        setCandidates([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Error al reconocer la carta. Intenta con una imagen más clara y bien iluminada."
      );
    } finally {
      setLoading(false);
    }
  }, [capturedImage]);

  const handleSelectCard = useCallback(async (card) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}BusquedaPokemonDetalle/${encodeURIComponent(
        card.nombre_carta
      )}/${encodeURIComponent(card.numero)}`;
      const response = await axios.get(url);
      const resultado = response.data?.resultado || {};
      setDetalle(resultado.Dato || null);
      setCandidates([]);
    } catch {
      setError("Error al obtener los detalles de la carta.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-2">
        Reconocimiento por Cámara
      </h2>
      <p className="text-center text-gray-300 mb-6">
        Apunta la cámara hacia el nombre de tu carta Pokémon para identificarla
        automáticamente.
      </p>

      {/* Camera / Capture Area */}
      <div
        className="relative w-full rounded-xl overflow-hidden border-2 border-purple-500 bg-black mb-4"
        style={{ minHeight: "260px" }}
      >
        {!isActive && !capturedImage && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Camera size={64} className="mb-4 opacity-40" />
            <p className="text-lg">La cámara está inactiva</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full rounded-xl ${
            isActive && !capturedImage ? "block" : "hidden"
          }`}
        />

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captura de carta"
            className="w-full rounded-xl"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center mb-4">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-all font-semibold"
          >
            <Camera size={20} />
            Iniciar Cámara
          </button>
        ) : (
          <>
            {!capturedImage ? (
              <button
                onClick={captureImage}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-all font-semibold"
              >
                <Camera size={20} />
                Capturar Imagen
              </button>
            ) : (
              <button
                onClick={resetCapture}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-full transition-all font-semibold"
              >
                <RotateCcw size={20} />
                Nueva Captura
              </button>
            )}
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-all font-semibold"
            >
              <X size={20} />
              Detener
            </button>
          </>
        )}

        {capturedImage && !detalle && (
          <button
            onClick={recognizeCard}
            disabled={loading}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={20} />
            {loading ? "Reconociendo..." : "Reconocer Carta"}
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center mb-4">
          <p className="text-xl text-gray-400 animate-pulse">Procesando...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full bg-red-900/30 border border-red-500 text-red-300 rounded-lg p-4 mb-4 text-center">
          {error}
        </div>
      )}

      {/* Extracted text badge */}
      {textoExtraido && (
        <div className="w-full bg-purple-900/20 border border-purple-700 rounded-lg p-3 mb-4 text-center">
          <p className="text-purple-300 text-sm">
            Texto detectado:{" "}
            <span className="font-bold text-white">{textoExtraido}</span>
          </p>
        </div>
      )}

      {/* Candidate cards list */}
      {candidates.length > 0 && (
        <>
          <h5 className="text-xl font-bold text-center text-purple-400 mb-3">
            Cartas encontradas
          </h5>
          <div className="flex justify-center w-full mb-4">
            <ul className="bg-white/10 rounded-lg p-2 text-white max-h-[150px] overflow-y-auto flex flex-col items-center w-full">
              {candidates.map((card, index) => (
                <li
                  key={`${card.nombre_carta}-${card.numero}-${index}`}
                  className="py-1 px-3 hover:bg-purple-500 rounded-lg cursor-pointer transition duration-200 w-full text-center"
                  onClick={() => handleSelectCard(card)}
                >
                  {card.nombre_carta} - #{card.numero}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Card detail */}
      {detalle && <SearchCard detalle={detalle} />}
    </div>
  );
}
