'use client'
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
interface CameraProps {
    onClose: () => void;
}

export default function Camera({ onClose }: CameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        // Demander l'accès à la caméra
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.play();
                        setStream(mediaStream);
                        setIsCameraReady(true);
                    }
                })
                .catch(err => {
                    console.error("Erreur lors de l'accès à la caméra:", err);
                });
        }

        // Nettoyer les ressources lors du démontage du composant
        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    const takePhoto = () => {
        if (videoRef.current && isCameraReady) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                setPhoto(dataUrl);
            }
        }
    };

    const savePhoto = () => {
        // Ici, vous pouvez implémenter la logique pour sauvegarder la photo
        // Par exemple, l'envoyer à un serveur ou la stocker localement
        console.log("Photo sauvegardée:", photo);
        stopCamera();
        onClose(); // Fermer la caméra après avoir sauvegardé
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 bg-black text-white">
                <button onClick={handleClose} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold">Prendre un selfie</h2>
                <div className="w-6"></div> {/* Pour équilibrer l'en-tête */}
            </div>

            <div className="flex-grow relative">
                {!photo ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                    />
                ) : (
                    <Image
                        src={photo}
                        alt="Photo prise"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="p-4 bg-black flex justify-center">
                {!photo ? (
                    <button
                        onClick={takePhoto}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
                        disabled={!isCameraReady}
                    >
                        <div className="w-12 h-12 rounded-full bg-white"></div>
                    </button>
                ) : (
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setPhoto(null)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Reprendre
                        </button>
                        <button
                            onClick={savePhoto}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                            Sauvegarder
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}