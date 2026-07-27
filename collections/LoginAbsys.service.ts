import type { CollectionConfig, PayloadHandler } from "payload";

class AbsysError extends Error {}

const getAbsysHeaders = (): Headers => {
  const user = process.env.NEXT_ABSYS_USERNAME;
  const pass = Buffer.from(process.env.NEXT_ABSYS_PASSWORD || "", "base64").toString("utf-8");

  if (!user || !pass) {
    throw new AbsysError("Credenciales de ABSYS no configuradas");
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  return new Headers({
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    Accept: "*/*",
    "Cache-Control": "no-cache",
    Cookie: "Path=/",
  });
};

const fetchAbsys = async (params: URLSearchParams): Promise<any> => {
  const baseUrl = process.env.NEXT_ABSYS_API;
  if (!baseUrl) throw new AbsysError("NEXT_ABSYS_API no configurada");

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: "GET",
    headers: getAbsysHeaders(),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AbsysError(`Absys API Error: ${response.statusText} - ${JSON.stringify(data)}`);
  }

  return data;
};

const jsonOk = (data: unknown, status = 200) =>
  Response.json({ success: true, data }, { status });

const jsonError = (message: string, status = 500) =>
  Response.json({ success: false, message }, { status });

export const handleCreateLector: PayloadHandler = async (req) => {
  try {
    const body = await req.json?.();
    if (!body || !body.email || !body.dni || !body.password) {
      return jsonError("Campos obligatorios incompletos (email, dni, password)", 400);
    }

    const existingUser = await req.payload.find({
      collection: "lectores",
      where: {
        or: [
          { email: { equals: body.email } },
          { dni: { equals: body.dni } },
        ],
      },
    });

    if (existingUser.docs.length > 0) {
      return jsonError("El DNI o Email ya se encuentra registrado", 409);
    }

    const colectivo = body.colectivo || "ALUMN";
    const maxPrestamos = colectivo === "PDI" ? 10 : 3;
    const diasPrestamo = colectivo === "PDI" ? 30 : 15;

    let lenlec = "0";
    let isOfflineData = false;

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("operation", "search");
      searchParams.set("table", "lector");
      searchParams.set("search", body.dni);

      const searchRes = await fetchAbsys(searchParams);
      if (searchRes?.response?.lector?.lenlec) {
        lenlec = String(searchRes.response.lector.lenlec);
      } else {
        const addParams = new URLSearchParams();
        addParams.set("operation", "add");
        addParams.set("table", "lector");
        addParams.set("lenlec", "0");
        addParams.set("leapel", body.apellidos || "");
        addParams.set("lenomb", body.nombre || "");
        addParams.set("lepass", body.password);
        addParams.set("lecolp", colectivo);
        addParams.set("lecobi", body.bibliotecaOrigen || "BIEURO");
        addParams.set("lecart", "1");
        addParams.set("lecosu", body.sucursal || "MADRID");

        const addRes = await fetchAbsys(addParams);
        if (addRes?.response?.lenlec) {
          lenlec = String(addRes.response.lenlec);
        }
      }
    } catch (err) {
      req.payload.logger.error(err);
      isOfflineData = true;
    }

    const newLector = await req.payload.create({
      collection: "lectores",
      data: {
        email: body.email,
        password: body.password,
        dni: body.dni,
        nombre: body.nombre,
        apellidos: body.apellidos,
        numeroCarnet: lenlec,
        colectivo,
        maxPrestamos,
        diasPrestamo,
        isOfflineData,
      },
    });

    return jsonOk(newLector, 201);
  } catch (error) {
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

    if (req.user.numeroCarnet) {
      try {
        const params = new URLSearchParams();
        params.set("operation", "search");
        params.set("table", "lector");
        params.set("lenlec", String(req.user.numeroCarnet));

        const res = await fetchAbsys(params);
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

export const Lectores: CollectionConfig = {
  slug: "lectores",
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
    { path: "/registro", method: "post", handler: handleCreateLector },
    { path: "/me", method: "get", handler: handleGetLectorMe },
  ],
};