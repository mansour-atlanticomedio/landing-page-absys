import { randomBytes } from "node:crypto";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { createLocalReq, getFieldsToSign, jwtSign } from "payload";
import { addSessionToUser, generateExpiredPayloadCookie, generatePayloadCookie } from "payload/shared";
import { LOGIN_CAMPUS_SLUG } from "@/collections/LoginCampus.service";
import type { Colectivo, Lector } from "@/lib/integrations/absys";
import { getClient } from "@/lib/payload";

export interface CampusSession {
  id: string | number;
  email: string;
  nombre?: string;
  apellidos?: string;
  absysId?: string;
  colectivo?: Colectivo;
  sid?: string;
}

const getCampusCollection = async () => {
  const payload = await getClient();
  return { payload, collection: (payload.collections as any)[LOGIN_CAMPUS_SLUG] as { config: any } };
};

const findRawUser = async (payload: any, req: any, where: Record<string, unknown>) =>
  (await payload.db.findOne({ collection: LOGIN_CAMPUS_SLUG, where, req })) as any;

export const getSession = async (requestHeaders?: Headers): Promise<CampusSession | null> => {
  const payload = await getClient();
  const { user } = (await payload.auth({ headers: requestHeaders ?? (await getHeaders()) })) as any;
  if (!user || user.collection !== LOGIN_CAMPUS_SLUG) return null;

  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre ?? undefined,
    apellidos: user.apellidos ?? undefined,
    absysId: user.absysId ?? undefined,
    colectivo: user.colectivo ?? undefined,
    sid: user._sid,
  };
};

// Para Server Components de páginas privadas: sin sesión, manda al login del campus y vuelve a `next`
export const requireSession = async (next: string): Promise<CampusSession> => {
  const session = await getSession();
  if (!session) redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  return session;
};

// Crea (o actualiza) el lector en Payload y le abre una sesión sin contraseña, porque la identidad ya la validó el campus.
// `rol` (derivado del dominio del correo, ver deriveCampusIdentity) se guarda aparte en vez de derivarlo del lector,
// porque se recalcula en cada login y debe quedar sincronizado aunque el lector en Absys no haya cambiado
export const createCampusSession = async (email: string, lector: Lector | null, rol?: Colectivo): Promise<string> => {
  const { payload, collection } = await getCampusCollection();
  const req = await createLocalReq({}, payload);

  const datosCampus = {
    ...(lector ? { absysId: lector.id, nombre: lector.nombre, apellidos: lector.apellidos } : {}),
    ...(rol ? { colectivo: rol } : {}),
  };

  const existing = await findRawUser(payload, req, { email: { equals: email } });
  if (!existing) {
    await payload.create({
      collection: LOGIN_CAMPUS_SLUG as never,
      // Contraseña aleatoria que nadie conoce: Payload la exige, pero estos lectores solo entran por el campus
      data: { email, password: randomBytes(32).toString("hex"), ...datosCampus } as never,
      overrideAccess: true,
      req,
    });
  } else if (Object.keys(datosCampus).length > 0) {
    await payload.update({
      collection: LOGIN_CAMPUS_SLUG as never,
      id: existing.id,
      data: datosCampus as never,
      overrideAccess: true,
      req,
    });
  }

  const user = await findRawUser(payload, req, { email: { equals: email } });
  const { sid } = await addSessionToUser({ collectionConfig: collection.config, payload, req, user });

  const { token } = await jwtSign({
    fieldsToSign: getFieldsToSign({ collectionConfig: collection.config, email, sid, user }),
    secret: payload.secret,
    tokenExpiration: collection.config.auth.tokenExpiration,
  });

  return generatePayloadCookie({
    collectionAuthConfig: collection.config.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
    returnCookieAsObject: false,
  }) as string;
};

// Sincroniza en el usuario de Payload la copia de nombre/apellidos/número de lector de Absys
// (tras el alta automática o tras editar el perfil), para tener algo que mostrar si Absys cae
export const linkAbsysLector = async (session: CampusSession, lector: Lector) => {
  const payload = await getClient();
  await payload.update({
    collection: LOGIN_CAMPUS_SLUG as never,
    id: session.id,
    data: { absysId: lector.id, nombre: lector.nombre, apellidos: lector.apellidos } as never,
    overrideAccess: true,
  });
};

// Revoca la sesión actual en la BD (no solo borra la cookie) y devuelve la cookie caducada
export const destroyCampusSession = async (requestHeaders: Headers): Promise<string> => {
  const { payload, collection } = await getCampusCollection();
  const session = await getSession(requestHeaders);

  if (session?.sid) {
    const req = await createLocalReq({}, payload);
    const user = await findRawUser(payload, req, { id: { equals: session.id } });
    if (user) {
      user.sessions = (user.sessions ?? []).filter((s: { id: string }) => s.id !== session.sid);
      await payload.db.updateOne({ collection: LOGIN_CAMPUS_SLUG, id: user.id, data: user, req, returning: false });
    }
  }

  return generateExpiredPayloadCookie({
    collectionAuthConfig: collection.config.auth,
    cookiePrefix: payload.config.cookiePrefix,
    returnCookieAsObject: false,
  }) as string;
};
