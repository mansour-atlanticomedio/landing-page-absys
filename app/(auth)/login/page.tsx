"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
import axios from "axios";

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loginImage, setLoginImage] = useState<{ url: string; alt: string } | null>(null);
  const [headerLogo, setHeaderLogo] = useState<{ url: string; alt: string } | null>(null);
  const [loginData, setLoginData] = useState<LoginData>(initialLogin);
  const [registerData, setRegisterData] = useState<RegisterData>(initialRegister);

  useEffect(() => {
    axios.get('/api/login?depth=1&limit=1')
      .then((res) => {
        const doc = res.data?.docs?.[0];
        if (doc?.imageLogin && typeof doc.imageLogin === 'object') {
          setLoginImage({ url: doc.imageLogin.url, alt: doc.imageLogin.alt || '' });
        }
      })
      .catch(() => {});

    axios.get('/api/header?depth=1&limit=1')
      .then((res) => {
        const doc = res.data?.docs?.[0];
        if (doc?.logo && typeof doc.logo === 'object') {
          setHeaderLogo({ url: doc.logo.url, alt: doc.logo.alt || '' });
        }
      })
      .catch(() => {});
  }, []);

  function switchMode(next: "login" | "register" | "reset") {
    setMode(next);
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
    params.set('lenlec', loginData.lenlec);
    params.set('lepass', loginData.lepass);

    // NOTA: En navegadores modernos se usa btoa() en vez de Buffer
    const userEncoded = btoa(params.toString());

    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/loginAbsys_service/login/${userEncoded}`);

      // Si la respuesta fue 200/201:
      setSuccessMessage("Sesión iniciada correctamente.");

      localStorage.setItem("lenlec", loginData.lenlec)
      localStorage.setItem("lepass", loginData.lepass)

      router.push("/");

    } catch (e: any) {
      // Si el servidor devolvió un error (401, 400, 500, etc.)
      if (axios.isAxiosError(e) && e.response) {
        const serverMessage = e.response.data?.message;
        setError(serverMessage || "Credenciales incorrectas o error en la solicitud.");
      } else {
        // Error de red, sin conexión o servidor caído
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
      setSuccessMessage(`Lector creado correctamente. Nº de lector: ${lenlec}`);
      setSuccessMessage(`Inicia sesion con tu numero de lector`);
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


  return (
    <div className={`h-screen w-screen bg-slate-50 flex justify-center items-center ${className}`}>
      <div className="flex-1 h-full relative hidden md:block">
        {loginImage && (
          <Image src={loginImage.url} fill alt={loginImage.alt} className="object-cover" />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center items-center h-full px-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center p-3 text-teal-400 mb-3">
            {headerLogo && (
              <Image
                src={headerLogo.url}
                width={300}
                height={100}
                alt={headerLogo.alt}
              />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Biblioteca UNAM
          </h1>
        </div>

        <Card className="w-full max-w-lg bg-white shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {mode === "login" ? "Iniciar sesión" : "Crear lector"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Accede con tu número de lector y contraseña."
                : "Introduce tus datos para crear tu carnet de lector."}
            </CardDescription>
          </CardHeader>

          {(error || successMessage) && (
            <div className="px-6">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="lenlec" className="text-slate-700 font-medium">
                    Nº de lector
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="lenlec"
                      name="lenlec"
                      placeholder="100023"
                      value={loginData.lenlec}
                      onChange={handleLoginChange}
                      className="pl-9 focus-visible:ring-teal-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lepass-login" className="text-slate-700 font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="lepass-login"
                      name="lepass"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.lepass}
                      onChange={handleLoginChange}
                      className="pl-9 focus-visible:ring-teal-600"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-6 pb-6 border-0">
                <Button
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
                    "Acceder a Mi Cuenta"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-sm text-slate-600 hover:text-teal-700"
                >
                  ¿No tienes cuenta?{" "}
                  <span className="text-teal-700 font-medium hover:underline">Crea tu carnet de lector</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-sm text-slate-600 hover:text-teal-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?{" "}
                  <span className="text-teal-700 font-medium"> </span>
                </button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lenomb" className="text-slate-700 font-medium">
                      Nombre *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="lenomb"
                        name="lenomb"
                        placeholder="Juan"
                        value={registerData.lenomb}
                        onChange={handleRegisterChange}
                        className="pl-9 focus-visible:ring-teal-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leapel" className="text-slate-700 font-medium">
                      Apellidos *
                    </Label>
                    <Input
                      id="leapel"
                      name="leapel"
                      placeholder="Pérez Gómez"
                      value={registerData.leapel}
                      onChange={handleRegisterChange}
                      className="focus-visible:ring-teal-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ledi11" className="text-slate-700 font-medium">
                    Dirección *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="ledi11"
                      name="ledi11"
                      placeholder="Carretera de Quilmes, 37"
                      value={registerData.ledi11}
                      onChange={handleRegisterChange}
                      className="pl-9 focus-visible:ring-teal-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lemail" className="text-slate-700 font-medium">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="lemail"
                        name="lemail"
                        type="email"
                        placeholder="ejemplo@atlanticomedio.es"
                        value={registerData.lemail}
                        onChange={handleRegisterChange}
                        className="pl-9 focus-visible:ring-teal-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="letfn1" className="text-slate-700 font-medium">
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="letfn1"
                        name="letfn1"
                        type="tel"
                        placeholder="+34 600 000 000"
                        value={registerData.letfn1}
                        onChange={handleRegisterChange}
                        className="pl-9 focus-visible:ring-teal-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lecolp" className="text-slate-700 font-medium">
                    Tipo de lector *
                  </Label>
                  <Select
                    value={registerData.lecolp}
                    onValueChange={(val) =>
                      setRegisterData((prev) => ({ ...prev, lecolp: val }))
                    }
                  >
                    <SelectTrigger id="lecolp" className="focus:ring-teal-600 w-full">
                      <SelectValue placeholder="Selecciona el lector" />
                    </SelectTrigger>
                    <SelectContent className="bg-white" >
                      <SelectItem value="ALUMN">Estudiante</SelectItem>
                      <SelectItem value="PDI">PDI (Docente e Investigador)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lepass-register" className="text-slate-700 font-medium">
                    Contraseña de Acceso
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="lepass-register"
                      name="lepass"
                      type="password"
                      placeholder="Si se deja vacío, se genera automáticamente"
                      value={registerData.lepass}
                      onChange={handleRegisterChange}
                      className="pl-9 focus-visible:ring-teal-600"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-0 flex flex-col gap-3 pt-4 pb-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 shadow-md transition-colors"
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
                  className="text-sm text-slate-600 hover:text-teal-700"
                >
                  ¿Ya tienes cuenta?{" "}
                  <span className="text-teal-700 font-medium">Inicia sesión</span>
                </button>
              </CardFooter>
            </form>
          )}
        </Card>
        <button
          type="button"
          onClick={() => switchMode("reset")}
          className="text-sm text-slate-400 hover:text-teal-700 mt-6 underline"
        >
          Solicitar ayuda al servicio de informatica{" "}
          <span className="text-teal-700 font-medium"> </span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;