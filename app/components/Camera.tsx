'use client'
import React, { useRef, } from 'react';

interface CameraProps {
    onPhotoTaken: (photoUrl: string) => void;
    onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoTaken, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);


    React.useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;

            }
        } catch (err) {
            console.error("Erreur d'accès à la caméra:", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());

        }
    };

    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);
            const photoUrl = canvas.toDataURL('image/jpeg');
            stopCamera();
            onPhotoTaken(photoUrl);
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md rounded-lg"
                />
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={takePhoto}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Capturer
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Camera;