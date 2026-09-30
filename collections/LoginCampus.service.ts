import type { Access, CollectionConfig, Endpoint, PayloadHandler } from "payload";
import { decryptCampusToken } from "@/lib/integrations/campus/token";

export const LOGIN_CAMPUS_SLUG = "loginCampus_service";

// Endpoint temporal para comprobar que desciframos los tokens del campus. No debe llegar a producción
export const handleDecryptTest: PayloadHandler = async (req) => {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ success: false, message: "No disponible" }, { status: 404 });
  }

  // El token puede venir en el body ({ token }), en la query (?token=) o en la ruta;
  // en la ruta hay que mandarlo con encodeURIComponent porque un "/" sin escapar se interpreta
  // como segmento de ruta y parte el token en dos ("Route not found"). La query no tiene ese
  // problema con "/", así que es la forma más cómoda de pegar un token en crudo
  let token = "";
  try {
    const body = typeof req.json === "function" ? await req.json() : null;
    token = body?.token ?? "";
  } catch {
    token = "";
  }
  if (!token) {
    token = (req.query?.token as string) ?? "";
  }
  if (!token) {
    const { id } = (req.routeParams ?? {}) as { id?: string };
    token = id ? decodeURIComponent(id) : "";
  }

  if (!token) {
    return Response.json({ success: false, message: "Falta el token" }, { status: 400 });
  }

  try {
    const result = decryptCampusToken(token);
    if (!result) {
      return Response.json({ success: false, message: "Token inválido o clave incorrecta" }, { status: 400 });
    }
    return Response.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    req.payload.logger.error((error as Error).message);
    return Response.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};

export const decryptTestEndpoints: Endpoint[] = [
  { path: "/loginCampus/login/password", method: "post", handler: handleDecryptTest },
  { path: "/loginCampus/login/password/:id", method: "post", handler: handleDecryptTest },
];

const isAdmin: Access = ({ req: { user } }) => user?.collection === "users";

// Un lector solo puede leer su propio documento; los admins, todos
const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.collection === "users") return true;
  return { id: { equals: user.id } };
};

export const LoginCampusService: CollectionConfig = {
  slug: LOGIN_CAMPUS_SLUG,
  labels: { singular: "Lector del campus", plural: "Lectores del campus" },
  auth: {
    tokenExpiration: 1800,
    cookies: {
      secure: process.env.NODE_ENV === "production",
      // Lax y no Strict: la sesión se crea en una redirección que empieza en el campus, y con Strict el navegador no mandaría la cookie en ese mismo viaje
      sameSite: "Lax",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "absysId", label: "Número de lector (Absys)", type: "text", index: true },
    { name: "dni", label: "DNI", type: "text", unique: true, index: true },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellidos", label: "Apellidos", type: "text" },
    { name: "numeroCarnet", label: "Número de carnet", type: "text", unique: true, index: true },
    {
      name: "colectivo",
      label: "Colectivo",
      type: "select",
      required: true,
      defaultValue: "ALUMN",
      // Mismos códigos que lib/integrations/absys/mappers/lector.ts (Colectivo) — se derivan del
      // dominio del correo del campus (deriveCampusIdentity), no se piden en ningún formulario
      options: [
        { label: "Estudiante", value: "ALUMN" },
        { label: "Profesor", value: "PROFE" },
        { label: "Personal", value: "ADULT" },
        { label: "Invitado", value: "INVIT" },
        { label: "Básico", value: "ANONI" },
      ],
    },
    { name: "maxPrestamos", label: "Máximo de préstamos", type: "number" },
    { name: "diasPrestamo", label: "Días de préstamo", type: "number" },
    { name: "isOfflineData", label: "Datos sin conexión", type: "checkbox", defaultValue: false },
  ],
  endpoints: [
    { path: "/login/password", method: "post", handler: handleDecryptTest },
    { path: "/login/password/:id", method: "post", handler: handleDecryptTest },
  ],
};
