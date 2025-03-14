'use client';

import Link from "next/link";
import ParcoursDebutants from "../components/ParcoursDebutants";
import ParcoursProximite from "../components/ParcoursProximite";
import { useState, ChangeEvent } from "react";

export default function Home() {
    const [inputValue, setInputValue] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.length > 0 && !showMessage) {
            setShowMessage(true);
        } else if (e.target.value.length === 0) {
            setShowMessage(false);
        }
    };

    return (
        <div className="relative h-screen w-full max-w-lg mx-auto bg-[#3643BA] flex flex-col text-white">
            <nav className="w-full bg-[#3643BA]] text-white p-4 flex justify-between items-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
                    <path d="M8.43465 9.77556C10.8579 9.77556 12.8224 7.81108 12.8224 5.38778C12.8224 2.96448 10.8579 1 8.43465 1C6.01134 1 4.04688 2.96448 4.04688 5.38778C4.04688 7.81108 6.01134 9.77556 8.43465 9.77556Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                    <path d="M16.6078 21V17.1091C16.6078 14.9459 14.8536 13.1917 12.6905 13.1917H4.91733C2.75422 13.1917 1 14.9459 1 17.1091V21" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                </svg>
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-normal">
                        ACCUEIL
                    </Link>
                </div>

                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.91211 0.259399V3.50545" stroke="white" strokeWidth="1.5" />
                        <path d="M9.91211 16.4946V19.7406" stroke="white" strokeWidth="1.5" />
                        <path d="M2.90625 2.92041L5.38504 5.3992" stroke="white" strokeWidth="1.5" />
                        <path d="M17.1934 2.92041L14.7146 5.3992" stroke="white" strokeWidth="1.5" />
                        <circle cx="10.0004" cy="9.99998" r="6.49455" stroke="white" strokeWidth="1.5" />
                        <path d="M0 9.99994L3.50554 9.99994" stroke="white" strokeWidth="1.5" />
                        <path d="M16.4941 9.99994L19.9997 9.99994" stroke="white" strokeWidth="1.5" />
                        <path d="M5.38672 14.6332L2.90792 17.112" stroke="white" strokeWidth="1.5" />
                        <path d="M14.7148 14.6332L17.1936 17.112" stroke="white" strokeWidth="1.5" />
                    </svg>
                </div>
            </nav>
            <section className="flex-1 px-3 max-h-[450px]">
                <div className="min-h-[450px] bg-center bg-no-repeat mx-auto flex justify-start items-center"
                    style={{ backgroundImage: "url('/home.png')" }}>
                    <div className="flex flex-col mb-36 gap-6 w-full">
                        <h1 className="text-2xl font-bold tracking-[1px]">
                            DEMANDER TON PARCOURS <br />
                            PERSONNALISER À BOB !
                        </h1>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Demande ton parcours du jour..."
                                className="max-w-[450px] p-2 rounded-md bg-white text-black w-full"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            {showMessage && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-95 rounded-md">
                                    <p className="text-[#3643BA] font-medium text-center px-4">
                                        La fonctionnalité Bob arrivera bientôt !
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white w-full py-4">
                {/* Section Parcours Découverte */}
                <div className="mb-6 mt-4">
                    <h2 className="text-xl text-[#3643BA] font-bold tracking-[1px] px-4 mb-2">
                        PARCOURS DÉCOUVERTE
                    </h2>
                    <ParcoursDebutants />
                    <div className="px-4 mt-4 max-w-[280px] flex justify-center items-center mx-auto">
                        <Link
                            href="/allparcours"
                            className="w-full px-3 py-3 bg-[#3643BA] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                        >
                            <span className="mr-2 text-base">VOIR TOUS LES PARCOURS</span>

                        </Link>
                    </div>
                </div>

                {/* Section Parcours Près de Chez Vous */}
                <div className="mt-12">
                    <h2 className="text-xl text-[#3643BA] font-bold tracking-[1px] px-4 mb-2">
                        DES CHALLENGES POUR TOI
                    </h2>
                    <p className="text-[#131316] px-4 text-base font-normal leading-[22px] tracking-[0.16px] mb-2">
                        Viens te dépasser tout en s&apos;amusant et  <br />découvre des lieux atypiques
                    </p>
                    <ParcoursProximite />
                </div>
            </section >
        </div >
    )
}
