import AuthErrorCard from "@/components/auth/AuthErrorCard";

const MENSAJES: Record<string, { titulo: string; texto: string }> = {
  invalido: {
    titulo: "No hemos podido verificar tu acceso",
    texto: "El enlace desde el campus no es válido. Vuelve a entrar a la biblioteca desde el campus virtual.",
  },
  caducado: {
    titulo: "El enlace ha caducado",
    texto: "Por seguridad, el acceso desde el campus solo es válido durante unos minutos. Vuelve a intentarlo.",
  },
  absys: {
    titulo: "El sistema de la biblioteca no responde",
    texto: "No hemos podido comprobar tu ficha de lector. Inténtalo de nuevo en unos minutos.",
  },
  config: {
    titulo: "El acceso desde el campus no está disponible",
    texto: "Estamos terminando de configurar el inicio de sesión. Si necesitas ayuda, contacta con la biblioteca.",
  },
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams;
  const mensaje = MENSAJES[motivo ?? ""] ?? MENSAJES.invalido;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted">
      <AuthErrorCard titulo={mensaje.titulo} texto={mensaje.texto} />
    </div>
  );
}
