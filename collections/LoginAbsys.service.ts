import { AbsysAddLectorPayload, AbsysAddLectorResponse } from "@/types/absys.type";
import type { CollectionConfig, PayloadHandler } from "payload";
import { absysClient, AbsysInvalidDataError } from "@/lib/integrations/absys";

const COLECTIVOS = {
  ALUMN: { lecolp: "ALUMN", lecocf: "ALIM", maxPrestamos: 3, diasPrestamo: 15 },
  PDI: { lecolp: "PDI", lecocf: "PDIM", maxPrestamos: 10, diasPrestamo: 30 },
} as const;

type Colectivo = keyof typeof COLECTIVOS;

const LECOBI = "BIEURO";
const LECOSU = "MADRID";
const LECART = "1";

function formatAbsysDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const REQUIRED_FIELDS = ["leapel", "lenomb", "lepass", "lecolp", "ledi11"] as const;

export const handleLoginLector: PayloadHandler = async (req) => {
  try {
    const { credentials } = req.routeParams as { credentials: string };
    const searchParams = Buffer.from(credentials || '', 'base64').toString('utf-8');
    const params = new URLSearchParams(searchParams);

    const { lenlec, lepass } = Object.fromEntries(params);

    const result: any = await absysClient.search({ table: "lector", lenlec });

    const response = result.response

    if (!response.lector) return jsonError('Usuario invalido', 404)

    const lector = response.lector

    if (lector.lepass !== lepass) return jsonError('Contraseña incorrecta', 401)

    const user = {
      lenomb: lector.lenomb,
      leapel: lector.leapel,
      lefubi: lector.lefubi,
      lenlec: lector.lenlec
    }

    return jsonOk(user);

  } catch (e) {
    req.payload.logger.error(e);
    return jsonError("Error interno del servidor al procesar el login", 500);
  }
}

const jsonOk = (data: unknown, status = 200) =>
  Response.json({ success: true, data }, { status });

const jsonError = (message: string, status = 500) =>
  Response.json({ success: false, message }, { status });


export const handleCreateLector: PayloadHandler = async (req) => {
  try {
    let body: Record<string, any> = {};
 
    if ((req as any).data && Object.keys((req as any).data).length > 0) {
      body = (req as any).data;
    } else {
      const contentType = req.headers.get("content-type") || "";
 
      if (contentType.includes("application/x-www-form-urlencoded")) {
        if (typeof req.formData === "function") {
          const formData = await req.formData();
          body = Object.fromEntries(formData);
        } else if (typeof req.text === "function") {
          const rawText = await req.text();
          body = Object.fromEntries(new URLSearchParams(rawText));
        }
      } else if (contentType.includes("application/json") && typeof req.json === "function") {
        body = await req.json();
      }
    }
 
    const missing = REQUIRED_FIELDS.filter((field) => !body[field]);
    if (missing.length > 0) {
      return jsonError(`Campos obligatorios incompletos: ${missing.join(", ")}`, 400);
    }
 
    const lecolpVal = body.lecolp as string;
    const colectivo: Colectivo = lecolpVal in COLECTIVOS ? (lecolpVal as Colectivo) : "ALUMN";
    const { lecolp, lecocf } = COLECTIVOS[colectivo];
 
    const payload: AbsysAddLectorPayload = {
      lenlec: "0",
      leapel: body.leapel,
      lenomb: body.lenomb,
      lepass: body.lepass,
      lecolp,
      lecobi: LECOBI,
      lecosu: LECOSU,
      lecart: LECART,
      ledi11: body.ledi11,
      lecocf,
      leacpd: "1",
      lefepd: formatAbsysDateTime(new Date()),
      lemail: body.lemail,
      letfn1: body.letfn1,
    };
 
    const result = await absysClient.add("lector", payload as unknown as Record<string, string>);
 
    return jsonOk({ lenlec: result.response.lenlec }, 201);
  } catch (error) {
    if (error instanceof AbsysInvalidDataError) {
      req.payload.logger.error(error.message);
      return jsonError(error.message || "No se ha podido crear el lector", 502);
    }
    req.payload.logger.error(error);
    return jsonError("Error interno del servidor al procesar el alta", 500);
  }
};

export const handleGetLectorMe: PayloadHandler = async (req) => {
  try {
    if (!req.user) {
      return jsonError("Acceso no autorizado", 401);
    }

    let absysProfile = null;
    let isOfflineData = false;

    if (req.user.id) {
      try {
        const res: any = await absysClient.search({ table: "lector", lenlec: String(req.user.id) });
        if (res?.response?.lector) {
          absysProfile = res.response.lector;
        }
      } catch (err) {
        req.payload.logger.error(err);
        isOfflineData = true;
      }
    }

    return jsonOk({
      lector: req.user,
      absysProfile,
      isOfflineData,
    });
  } catch (error) {
    req.payload.logger.error(error);
    return jsonError("Error al consultar la información del perfil", 500);
  }
};

export const LoginAbsysService: CollectionConfig = {
  slug: "loginAbsys_service",
  auth: {
    tokenExpiration: 1800,
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return true;
    },
  },
  fields: [
    { name: "dni", type: "text", required: true, unique: true, index: true },
    { name: "nombre", type: "text", required: true },
    { name: "apellidos", type: "text", required: true },
    { name: "numeroCarnet", type: "text", unique: true, index: true },
    {
      name: "colectivo",
      type: "select",
      required: true,
      defaultValue: "ALUMN",
      options: [
        { label: "Estudiante", value: "ALUMN" },
        { label: "PDI", value: "PDI" },
        { label: "PAS", value: "PAS" },
        { label: "Externo", value: "EXT" },
      ],
    },
    { name: "maxPrestamos", type: "number" },
    { name: "diasPrestamo", type: "number" },
    { name: "isOfflineData", type: "checkbox", defaultValue: false },
  ],
  endpoints: [
    { path: "/signin", method: "post", handler: handleCreateLector },
    { path: "/login/:credentials", method: "post", handler: handleLoginLector },
    { path: "/me", method: "get", handler: handleGetLectorMe },
  ],
};