"use client";

import { signIn } from "next-auth/react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-content1 p-8 rounded-2xl border border-white/5 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <p className="text-default-500 mb-8">Inicia sesión con tu cuenta de administrador.</p>
        <button 
          onClick={() => signIn("google", { callbackUrl: "/portal-secreto-itianz" })}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
}
