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
    prenom: z.string().min(3, {
        message: "Le prénom doit contenir au moins 3 caractères.",
    }),
    nom: z.string().min(3, {
        message: "Le nom doit contenir au moins 3 caractères.",
    }),
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
    password: z.string().min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
    }),
    newsletter: z.boolean().default(false),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "Vous devez accepter les conditions d'utilisation.",
    }),
});

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Initialisation du formulaire avec React Hook Form et Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prenom: "",
            nom: "",
            email: "",
            password: "",
            newsletter: false,
            termsAccepted: false
        },
    });

    // Fonction de soumission du formulaire
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            // Utilisation du client better-auth pour l'inscription
            await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: `${values.prenom} ${values.nom}`,
                // Les données supplémentaires peuvent être gérées côté serveur
                // ou stockées dans une base de données après l'inscription
            }, {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    toast.success("Compte créé avec succès");
                    router.push("/start");
                },
                onError: (error) => {
                    console.error(error);
                    if (error.error?.message === "User already exists") {
                        toast.error("Cet email est déjà utilisé");
                    } else {
                        toast.error("Une erreur est survenue lors de la création du compte");
                    }
                }
            });

            // Attendre un peu pour montrer le chargement
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de la création du compte");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col mx-auto w-full max-w-lg min-h-screen bg-[#3643BA] text-white p-4">
            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="pt-6">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9EFF00]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3643BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                <div className="mt-6 mb-8">
                    <h1 className="text-2xl font-bold uppercase">INSCRIPTION</h1>
                    <p className="text-sm mt-1">L&apos;aventure commence maintenant</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            id="prenom"
                            placeholder="Prénom"
                            className="w-full p-3 bg-[#3643BA] text-white border border-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={isLoading}
                            {...form.register("prenom")}
                        />
                        {form.formState.errors.prenom && (
                            <p className="text-red-300 text-xs mt-1">{form.formState.errors.prenom.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            id="nom"
                            placeholder="Nom"
                            className="w-full p-3 bg-[#3643BA] text-white border border-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white"
                            disabled={isLoading}
                            {...form.register("nom")}
                        />
                        {form.formState.errors.nom && (
                            <p className="text-red-300 text-xs mt-1">{form.formState.errors.nom.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            id="email"
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
                            id="password"
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

                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="newsletter"
                            className="mt-1"
                            disabled={isLoading}
                            {...form.register("newsletter")}
                        />
                        <label htmlFor="newsletter" className="text-xs">
                            J&apos;accepte de m&apos;inscrire à la newsletter et recevoir les communications de WayGo
                        </label>
                    </div>

                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            className="mt-1"
                            disabled={isLoading}
                            {...form.register("termsAccepted")}
                        />
                        <label htmlFor="termsAccepted" className="text-xs">
                            J&apos;accepte la politique de confidentialité et les conditions d&apos;utilisation de WayGo
                        </label>
                        {form.formState.errors.termsAccepted && (
                            <p className="text-red-300 text-xs mt-1">{form.formState.errors.termsAccepted.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-white text-[#3643BA] font-bold rounded-md text-xs leading-6 tracking-[0.12px] uppercase"
                        disabled={isLoading}
                    >
                        {isLoading ? "CHARGEMENT..." : "INSCRIPTION"}
                    </button>
                </form>
            </div>
        </div>
    );
}   
