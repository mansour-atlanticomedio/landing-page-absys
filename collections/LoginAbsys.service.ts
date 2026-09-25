import type { CollectionConfig, PayloadHandler } from "payload";
import { absys, AbsysInvalidDataError, type Lector } from "@/lib/integrations/absys";

const REQUIRED_FIELDS = ["leapel", "lenomb", "lepass", "lecolp", "ledi11"] as const;

// TODO(contrato-front): normalizar en issue aparte
const toLegacyLector = (lector: Lector) => ({
  lenomb: lector.nombre,
  leapel: lector.apellidos,
  lefubi: lector.ultimoUso,
  lenlec: lector.id,
});

export const handleLoginLector: PayloadHandler = async (req) => {
  try {
    const { credentials } = req.routeParams as { credentials: string };
    const searchParams = Buffer.from(credentials || '', 'base64').toString('utf-8');
    const params = new URLSearchParams(searchParams);

    const { lenlec, lepass } = Object.fromEntries(params);

    const lector = await absys.findLectorByExternalId(lenlec);

    if (!lector) return jsonError('Usuario invalido', 404)

    // TODO(F01): lepass siempre llega enmascarado desde Absys (ADR-0005), esta comparación nunca acierta
    if (lector.lepassLegacy !== lepass) return jsonError('Contraseña incorrecta', 401)

    return jsonOk(toLegacyLector(lector));

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
 
    // TODO(contrato-front): normalizar en issue aparte
    const lector = await absys.createLector({
      nombre: body.lenomb,
      apellidos: body.leapel,
      password: body.lepass,
      colectivo: body.lecolp,
      direccion: body.ledi11,
      email: body.lemail,
      telefono: body.letfn1,
    });
 
    return jsonOk({ lenlec: lector.id }, 201);
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

    let absysProfile: Record<string, unknown> | null = null;
    let isOfflineData = false;

    if (req.user.id) {
      try {
        const lector = await absys.findLectorByExternalId(String(req.user.id));
        if (lector) {
          absysProfile = { ...toLegacyLector(lector), lemail: lector.email };
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