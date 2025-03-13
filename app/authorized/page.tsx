// pages/register.tsx
"use client"
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";


export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { } = await authClient.signUp.email({
            email,      // L’email de l’utilisateur
            password,   // Le mot de passe (minimum 8 caractères par défaut)
            name,       // Le nom ou pseudonyme de l’utilisateur
            callbackURL: "/dashboard", // URL de redirection après inscription et vérification
        }, {
            onSuccess: () => {
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        });
    };

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sinscrire</button>
        </form>
    );
}
