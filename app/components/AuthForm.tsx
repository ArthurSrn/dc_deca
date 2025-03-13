'use client';

import Link from 'next/link';

type AuthFormProps = {
    defaultView?: 'login' | 'register';
};

const AuthForm: React.FC<AuthFormProps> = () => {


    return (
        <div className="flex flex-col mx-auto w-full max-w-lg h-screen bg-[#3643BA] text-white p-4">
            <div className="flex-1 flex flex-col justify-center pb-28 space-y-4">
                <h1 className="text-xl font-bold mb-2 tracking-[0.5px]">BONJOUR !</h1>
                <p className="text-xs font-normal">Application qui fera prendre plaisir à bouger</p>

                <Link href="/auth/login" className="w-full">
                    <button
                        type="button"
                        className="w-full p-3 bg-white text-[#3643BA] font-bold rounded-md text-xs leading-6 tracking-[0.12px] uppercase"
                    >
                        CONNEXION
                    </button>
                </Link>

                <Link href="/auth/register" className="w-full">
                    <button
                        type="button"
                        className="w-full p-3 bg-white text-[#3643BA] font-bold rounded-md text-xs leading-6 tracking-[0.12px] uppercase"
                    >
                        INSCRIPTION
                    </button>
                </Link>
            </div>
        </div>

    );
};

export default AuthForm; 