import AuthErrorCard from "@/components/auth/AuthErrorCard";

// El motivo real (invalido/caducado/absys/config) solo queda en los logs del servidor
// (payload.logger.warn/error en auth/campus y auth/login) — aquí se muestra siempre un mensaje genérico
export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted">
      <AuthErrorCard
        titulo="No hemos podido verificar tu acceso"
        texto="El enlace desde el campus no es válido o ha caducado. Vuelve a entrar a la biblioteca desde el campus virtual."
      />
    </div>
  );
}
