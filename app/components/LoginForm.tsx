'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';

// Définition du schéma de validation
const formSchema = z.object({
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
    password: z.string().min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
    }),
    rememberMe: z.boolean().default(false),
});

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Initialisation du formulaire avec React Hook Form et Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        },
    });

    // Fonction de soumission du formulaire
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            await authClient.signIn.email({
                email: values.email,
                password: values.password,
            }, {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    toast.success("Connexion réussie");
                    router.push("/home");
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("Email ou mot de passe incorrect");
                }
            });

            // Attendre un peu pour montrer le chargement
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de la connexion");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center mx-auto w-full pb-24 max-w-lg min-h-screen bg-[#3643BA] text-white p-4">
            <div className="w-full">
                <div className="w-full mb-12">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9EFF00]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3643BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                <div className="w-full mb-8">
                    <h1 className="text-2xl font-bold uppercase">CONNEXION</h1>
                    <p className="text-sm mt-1">L&apos;aventure commence maintenant</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 bg-[#3643BA] text-white border border-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={isLoading}
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-300 text-xs mt-1">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            className="w-full p-3 bg-[#3643BA] text-white border border-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={isLoading}
                            {...form.register("password")}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                        {form.formState.errors.password && (
                            <p className="text-red-300 text-xs mt-1">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="mt-0"
                                disabled={isLoading}
                                {...form.register("rememberMe")}
                            />
                            <label htmlFor="rememberMe" className="text-xs">
                                Se souvenir de moi
                            </label>
                        </div>
                        <Link href="/auth/forgot-password" className="text-xs underline">
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 mt-6 bg-white text-[#3643BA] font-bold rounded-md text-xs leading-6 tracking-[0.12px] uppercase"
                        disabled={isLoading}
                    >
                        {isLoading ? "CHARGEMENT..." : "CONNEXION"}
                    </button>
                </form>
            </div>
        </div>
    );
}
