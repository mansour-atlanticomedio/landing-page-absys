"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BASE_PATH } from "@/lib/auth/redirects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  IdCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  EyeClosed,
} from "lucide-react";
import axios from "axios";
import { getLoginPageData } from "./actions";

interface LoginData {
  lenlec: string;
  lepass: string;
}

interface RegisterData {
  leapel: string;
  lenomb: string;
  lepass: string;
  lecolp: string;
  ledi11: string;
  lemail: string;
  letfn1: string;
}

const initialLogin: LoginData = { lenlec: "", lepass: "" };

const initialRegister: RegisterData = {
  leapel: "",
  lenomb: "",
  lepass: "",
  lecolp: "",
  ledi11: "",
  lemail: "",
  letfn1: "",
};

interface LoginPageProps {
  className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ className = "" }) => {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para almacenar la imagen dinámica traída de Payload
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>("Login");
  const [headerLogo, setHeaderLogo] = useState<{ url: string; alt: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const CAMPUS_URI = process.env.NEXT_PUBLIC_CAMPUS_URI;

  const [loginData, setLoginData] = useState<LoginData>(initialLogin);
  const [registerData, setRegisterData] = useState<RegisterData>(initialRegister);

  // 🔄 Carga de la imagen desde la colección login_page via server action (getClient)
  useEffect(() => {
    getLoginPageData()
      .then((data) => {
        if (data.loginImage?.url) {
          setImageUrl(data.loginImage.url);
          setImageAlt(data.loginImage.alt || "Login");
        }
        if (data.headerLogo?.url) {
          setHeaderLogo(data.headerLogo);
        }
      })
      .catch((err) => {
        console.error("No se pudo cargar la imagen de la colección login:", err);
      });
  }, []);

  function switchMode(next: "login" | "register" | "reset") {
    // setMode(next);
    setError(null);
    setSuccessMessage(null);
  }

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRegisterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!loginData.lenlec || !loginData.lepass) {
      setError("Introduce tu número de lector y tu contraseña.");
      return;
    }

    const params = new URLSearchParams();
    params.set("lenlec", loginData.lenlec);
    params.set("lepass", loginData.lepass);

    const userEncoded = btoa(params.toString());

    try {
      setIsLoading(true);

      await axios.post(`${API_URL}/loginAbsys_service/login/${userEncoded}`);

      setSuccessMessage("Sesión iniciada correctamente.");

      localStorage.setItem("lenlec", loginData.lenlec);
      localStorage.setItem("lepass", loginData.lepass);

      router.back();

    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response) {
        const serverMessage = e.response.data?.message;
        setError(serverMessage || "Credenciales incorrectas o error en la solicitud.");
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!registerData.leapel || !registerData.lenomb || !registerData.ledi11 || !registerData.lecolp) {
      setError("Rellena todos los campos obligatorios (*).");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/loginAbsys_service/signin`, {
        leapel: registerData.leapel,
        lenomb: registerData.lenomb,
        lecolp: registerData.lecolp,
        ledi11: registerData.ledi11,
        lepass: registerData.lepass || undefined,
        lemail: registerData.lemail || undefined,
        letfn1: registerData.letfn1 || undefined,
      });

      const lenlec = res.data?.data?.lenlec;
      setSuccessMessage(`Lector creado correctamente. Nº de lector: ${lenlec}. Inicia sesión con tu número de lector.`);
      setRegisterData(initialRegister);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response.data?.message || "No se ha podido crear el lector.");
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const mutedText = "text-[hsl(var(--muted-foreground))]";
  const helpLink = `${mutedText} hover:text-primary underline underline-offset-4 text-sm py-2 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`;
  const labelClass = "mb-2 block font-display text-sm font-medium text-primary";

  return (
    <div className={`min-h-dvh w-full bg-background md:grid md:grid-cols-[3fr_2fr] ${className}`}>
      <div className="relative hidden md:block min-h-dvh bg-primary">
        {imageUrl && (
          <Image src={imageUrl} fill sizes="60vw" priority alt="" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(211_28%_25%/0.78),hsl(187_53%_35%/0.55))]" />
      </div>

      <main className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex w-full max-w-sm flex-col items-center px-6 py-10 text-center md:px-10">
          {headerLogo ? (
            <Image
              src={headerLogo.url}
              width={180}
              height={60}
              className="h-auto w-40"
              alt={headerLogo.alt || "Universidad Atlántico Medio"}
            />
          ) : (
            <Image
              src={`${BASE_PATH}/logos/unam-color-logo.png`}
              width={180}
              height={60}
              className="h-auto w-40"
              alt="Universidad Atlántico Medio"
            />
          )}

          <h1 className="mt-10 font-display text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {mode === "login" ? "Bienvenido" : "Crear lector"}
          </h1>
          {/* <CardDescription>
              {mode === "login"
                ? "Inicia sesión en tu biblioteca"
                : "Introduce tus datos para crear tu carnet de lector."}
            </CardDescription> */}
          {mode === "login" && (
            <p className={`mt-2 text-sm md:text-base ${mutedText}`}>
              Accede con tu cuenta de la universidad
            </p>
          )}

          <div className="mt-8 w-full">
            {(error || successMessage) && (
              <div className="mb-4 space-y-3 text-left">
                {error && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {successMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2 rounded-md border border-accent/30 bg-[hsl(var(--muted))] p-3 text-sm text-primary"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    <span>{successMessage}</span>
                  </div>
                )}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col items-center">
                <div className="w-full space-y-5 text-left">
                  {/* <div className="space-y-2">
                    <Label htmlFor="lenlec" className="text-slate-700 font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lenlec"
                        name="lenlec"
                        placeholder="Introduce tu correo electrónico"
                        value={loginData.lenlec}
                        onChange={handleLoginChange}
                        className="pl-9 focus-visible:ring-teal-600"
                        required
                      />
                    </div>
                  </div> */}

                  {/* <div className="space-y-2">
                    <Label htmlFor="lepass-login" className="text-slate-700 font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lepass-login"
                        name="lepass"
                        type={ isPasswordShown ? "text" : "password"}
                        placeholder="Introduce tu contraseña"
                        value={loginData.lepass}
                        onChange={handleLoginChange}
                        className="pl-9 pr-9 focus-visible:ring-teal-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordShown((prev) => !prev)}
                        aria-label={isPasswordShown ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={isPasswordShown}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {isPasswordShown ? (
                          <EyeClosed className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div> */}
                </div>

                <div className="flex w-full flex-col items-center">
                  {/* <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 shadow-md transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Acceder"
                    )}
                  </Button> */}
                  {/* <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-sm text-slate-600 hover:text-teal-700"
                  >
                    ¿No tienes cuenta?{" "}
                    <span className="text-teal-700 font-medium hover:underline">
                      Crea tu carnet de lector
                    </span>
                  </button> */}
                  {/* <div className="flex w-full items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs uppercase text-slate-400">o</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div> */}

                  <Button
                    asChild
                    className="h-12 w-full rounded-md bg-primary font-display text-base font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                  >
                    <a
                      href={CAMPUS_URI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-3"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-white" aria-hidden="true">
                        <svg viewBox="0 0 21 21" className="h-4 w-4">
                          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                        </svg>
                      </span>
                      Iniciar sesión con Microsoft
                      <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </Button>

                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className={`mt-6 ${helpLink}`}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="lenomb" className={labelClass}>
                      Nombre *
                    </Label>
                    <Input
                      id="lenomb"
                      name="lenomb"
                      autoComplete="given-name"
                      placeholder="Juan"
                      value={registerData.lenomb}
                      onChange={handleRegisterChange}
                      className="h-12 rounded-md text-base"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="leapel" className={labelClass}>
                      Apellidos *
                    </Label>
                    <Input
                      id="leapel"
                      name="leapel"
                      autoComplete="family-name"
                      placeholder="Pérez Gómez"
                      value={registerData.leapel}
                      onChange={handleRegisterChange}
                      className="h-12 rounded-md text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ledi11" className={labelClass}>
                    Dirección *
                  </Label>
                  <Input
                    id="ledi11"
                    name="ledi11"
                    autoComplete="street-address"
                    placeholder="Carretera de Quilmes, 37"
                    value={registerData.ledi11}
                    onChange={handleRegisterChange}
                    className="h-12 rounded-md text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="lemail" className={labelClass}>
                      Correo Electrónico
                    </Label>
                    <Input
                      id="lemail"
                      name="lemail"
                      type="email"
                      autoComplete="email"
                      placeholder="ejemplo@atlanticomedio.es"
                      value={registerData.lemail}
                      onChange={handleRegisterChange}
                      className="h-12 rounded-md text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="letfn1" className={labelClass}>
                      Teléfono
                    </Label>
                    <Input
                      id="letfn1"
                      name="letfn1"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+34 600 000 000"
                      value={registerData.letfn1}
                      onChange={handleRegisterChange}
                      className="h-12 rounded-md text-base"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lecolp" className={labelClass}>
                    Tipo de lector *
                  </Label>
                  <Select
                    value={registerData.lecolp}
                    onValueChange={(val) =>
                      setRegisterData((prev) => ({ ...prev, lecolp: val }))
                    }
                  >
                    <SelectTrigger id="lecolp" className="h-12 w-full text-base">
                      <SelectValue placeholder="Selecciona el lector" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="ALUMN">Estudiante</SelectItem>
                      <SelectItem value="PDI">PDI (Docente e Investigador)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lepass-register" className={labelClass}>
                    Contraseña de Acceso
                  </Label>
                  <Input
                    id="lepass-register"
                    name="lepass"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Si se deja vacío, se genera automáticamente"
                    value={registerData.lepass}
                    onChange={handleRegisterChange}
                    className="h-12 rounded-md text-base"
                  />
                </div>

                <div className="flex flex-col items-center pt-1">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-md bg-primary font-display text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando lector...
                      </>
                    ) : (
                      "Dar de alta lector"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={`mt-6 ${helpLink}`}
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </button>
                </div>
              </form>
            )}
          </div>

          <button
            type="button"
            onClick={() => switchMode("reset")}
            className={`mt-2 ${helpLink}`}
          >
            Solicitar ayuda al servicio de informática
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
