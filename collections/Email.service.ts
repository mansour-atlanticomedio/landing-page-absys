import path from "node:path"
import type { CollectionConfig, Payload } from "payload"

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://www.atlanticomedio.es/biblioteca"
const CONTACT_PHONE = "+34 828 019 019"
const CONTACT_EMAIL = "biblioteca@atlanticomedio.es"

// Plantilla base con la identidad visual de la Biblioteca: cabecera blanca con el escudo de la UNAM y
// filete turquesa, texto en la paleta navy/gris del sitio. La comparten todos los correos
// (PIN, bienvenida, préstamos, sugerencias y aviso de contacto)
const LOGO_CID = "unam-logo"

// El logo va incrustado en el correo (cid) y no enlazado por URL: se ve igual en desarrollo y no
// depende de que el sitio sea público ni de que el cliente de correo bloquee imágenes remotas
const emailAttachments = () => [
  {
    filename: "unam-logo.png",
    path: path.join(process.cwd(), "public", "logos", "unam-color-logo.png"),
    cid: LOGO_CID,
  },
]

type EmailMessage = Parameters<Payload["sendEmail"]>[0]

const sendBrandedEmail = (payload: Payload, message: EmailMessage) =>
  payload.sendEmail({ ...message, attachments: emailAttachments() })

const emailLayout = (title: string, bodyHtml: string) => `
<div style="font-family: 'Open Sans', Arial, sans-serif; background-color: #F2F4F7; padding: 32px 16px; color: #333333;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #E0E0E0;">
    <div style="background-color: #ffffff; padding: 20px 32px; border-bottom: 4px solid #3BACBD;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
          <td style="padding-right: 16px; vertical-align: middle;">
            <img src="cid:${LOGO_CID}" alt="Universidad del Atlántico Medio" width="52" height="55" style="display: block; border: 0;" />
          </td>
          <td style="vertical-align: middle; border-left: 2px solid #3BACBD; padding-left: 16px;">
            <p style="margin: 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #2D3E50;">Universidad del Atlántico Medio</p>
            <p style="margin: 2px 0 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 13px; font-weight: 400; color: #595959;">Biblioteca</p>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding: 32px;">
      <h1 style="margin: 0 0 16px; font-family: 'Montserrat', Arial, sans-serif; font-size: 22px; color: #2D3E50;">
        ${title}
      </h1>
      ${bodyHtml}
    </div>
    <div style="background-color: #F2F4F7; padding: 20px 32px; font-size: 12px; line-height: 1.5; color: #595959;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #2D3E50;">Biblioteca de la Universidad del Atlántico Medio</p>
      <p style="margin: 0 0 4px;">Edificio EMU de Usos Múltiples · Carretera de Quilmes, 37 · Las Palmas de Gran Canaria</p>
      <p style="margin: 0 0 12px;">${CONTACT_PHONE} · <a href="mailto:${CONTACT_EMAIL}" style="color: #3BACBD;">${CONTACT_EMAIL}</a></p>
      <p style="margin: 0; padding-top: 12px; border-top: 1px solid #E0E0E0; font-size: 11px; color: #8A8A8A;">
        Este mensaje se ha generado automáticamente desde la web de la Biblioteca. Si necesitas ayuda, escríbenos a la dirección indicada.
      </p>
    </div>
  </div>
</div>
`

const ctaButton = (label: string, href: string) => `
  <a href="${href}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #3BACBD; color: #ffffff; font-family: 'Montserrat', Arial, sans-serif; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 6px;">
    ${label}
  </a>
`

// ---------------------------------------------------------------------------
// 1. Correo de PIN (verificación / recuperación de acceso)
// ---------------------------------------------------------------------------

/** Genera un PIN numérico de `length` dígitos (por defecto 6). El caller es responsable de guardarlo/caducarlo. */
export const generatePin = (length = 6): string => {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return String(Math.floor(min + Math.random() * (max - min + 1)))
}

interface SendPinEmailParams {
  to: string
  pin: string
  name?: string
  expirationMinutes?: number
}

export const sendPinEmail = async (payload: Payload, { to, pin, name, expirationMinutes = 10 }: SendPinEmailParams) => {
  const greeting = name ? `Hola ${name},` : "Hola,"

  const body = `
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">${greeting}</p>
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">
      Este es tu código de verificación para acceder a tu cuenta de la Biblioteca:
    </p>
    <div style="margin: 0 0 16px; padding: 16px; background-color: #F2F4F7; border-radius: 6px; text-align: center;">
      <span style="font-family: 'Montserrat', Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2D3E50;">
        ${pin}
      </span>
    </div>
    <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #595959;">
      Este código caduca en ${expirationMinutes} minutos. Si no has solicitado este código, puedes ignorar este correo.
    </p>
  `

  await sendBrandedEmail(payload, {
    to,
    subject: "Tu código de verificación — Biblioteca UNAM",
    html: emailLayout("Código de verificación", body),
  })
}

// ---------------------------------------------------------------------------
// 2. Correo de bienvenida (alta de lector/a en la Biblioteca)
// ---------------------------------------------------------------------------

interface SendWelcomeEmailParams {
  to: string
  name: string
}

export const sendWelcomeEmail = async (payload: Payload, { to, name }: SendWelcomeEmailParams) => {
  const body = `
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">Hola ${name},</p>
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">
      Ya formas parte de la Biblioteca de la Universidad del Atlántico Medio. Estamos aquí para apoyarte
      en tu aprendizaje, docencia o investigación con estos recursos y servicios:
    </p>
    <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #333333;">
      <li>Consultar el catálogo y comprobar la disponibilidad de libros y recursos.</li>
      <li>Solicitar préstamos y renovarlos desde tu cuenta.</li>
      <li>Acceder a recursos electrónicos como eLibro, Web of Science y Scopus.</li>
      <li>Consultar horarios, ubicación y vías de contacto con la Biblioteca.</li>
      <li>Recibir apoyo del equipo de bibliotecarios ante cualquier duda.</li>
    </ul>
    <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.6; color: #333333;">
      Puedes empezar consultando el catálogo o accediendo a tu cuenta:
    </p>
    ${ctaButton("Explorar el catálogo", `${SITE_URL}/recursos/catalogo`)}
  `

  await sendBrandedEmail(payload, {
    to,
    subject: "Bienvenido/a a la Biblioteca UNAM",
    html: emailLayout(`¡Bienvenido/a, ${name}!`, body),
  })
}

// ---------------------------------------------------------------------------
// 3. Correos de gestión de reservas / préstamos
// ---------------------------------------------------------------------------

export type LoanNotificationType = "reserved" | "ready" | "due_soon" | "overdue"

interface SendLoanNotificationEmailParams {
  to: string
  name: string
  type: LoanNotificationType
  bookTitle: string
  dueDate?: string
}

const LOAN_NOTIFICATION_COPY: Record<LoanNotificationType, (params: { name: string; bookTitle: string; dueDate?: string }) => { subject: string; title: string; message: string }> = {
  reserved: ({ name, bookTitle }) => ({
    subject: `Reserva confirmada: ${bookTitle}`,
    title: "Reserva confirmada",
    message: `Hola ${name}, hemos confirmado tu reserva de <strong>${bookTitle}</strong>. Te avisaremos en cuanto esté disponible para recoger.`,
  }),
  ready: ({ name, bookTitle }) => ({
    subject: `Ya puedes recoger: ${bookTitle}`,
    title: "Tu reserva está disponible",
    message: `Hola ${name}, <strong>${bookTitle}</strong> ya está disponible para que lo recojas en la Biblioteca. Recuerda traer tu carné o credencial.`,
  }),
  due_soon: ({ name, bookTitle, dueDate }) => ({
    subject: `Recuerda devolver: ${bookTitle}`,
    title: "Tu préstamo está a punto de vencer",
    message: `Hola ${name}, el préstamo de <strong>${bookTitle}</strong> vence el <strong>${dueDate}</strong>. Puedes renovarlo desde tu cuenta si nadie más lo ha reservado.`,
  }),
  overdue: ({ name, bookTitle, dueDate }) => ({
    subject: `Préstamo pendiente de devolución: ${bookTitle}`,
    title: "Tienes un préstamo pendiente",
    message: `Hola ${name}, el préstamo de <strong>${bookTitle}</strong> venció el <strong>${dueDate}</strong> y sigue pendiente de devolución. Te pedimos que lo devuelvas cuanto antes.`,
  }),
}

export const sendLoanNotificationEmail = async (payload: Payload, { to, name, type, bookTitle, dueDate }: SendLoanNotificationEmailParams) => {
  const copy = LOAN_NOTIFICATION_COPY[type]({ name, bookTitle, dueDate })

  const body = `
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">${copy.message}</p>
    ${ctaButton("Gestionar mi cuenta", `${SITE_URL}/login`)}
  `

  await sendBrandedEmail(payload, {
    to,
    subject: copy.subject,
    html: emailLayout(copy.title, body),
  })
}

// ---------------------------------------------------------------------------
// 4. Correos de sugerencia de libros (desiderata, /adquisiciones/solicitud-compra)
// ---------------------------------------------------------------------------

// Los datos del formulario los escribe el usuario: se escapan antes de meterlos en el HTML del correo
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

export interface LibroSugeridoEmail {
  titulo: string
  autor: string
  editorial?: string
  anio?: string
  isbn?: string
  enlace?: string
}

interface SendBookSuggestionEmailParams {
  solicitante: { nombre: string; email: string; rol?: string }
  libros: LibroSugeridoEmail[]
}

const bookRow = (label: string, value?: string) =>
  value ? `<p style="margin: 0 0 4px; font-size: 13px; color: #333333;"><strong>${label}:</strong> ${escapeHtml(value)}</p>` : ""

const booksHtml = (libros: LibroSugeridoEmail[]) =>
  libros
    .map(
      (libro, i) => `
    <div style="margin: 0 0 12px; padding: 12px 16px; background-color: #F2F4F7; border-radius: 6px;">
      <p style="margin: 0 0 8px; font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; font-weight: 700; color: #2D3E50;">
        ${i + 1}. ${escapeHtml(libro.titulo)}
      </p>
      ${bookRow("Autor(es)", libro.autor)}
      ${bookRow("Editorial", libro.editorial)}
      ${bookRow("Año", libro.anio)}
      ${bookRow("ISBN", libro.isbn)}
      ${libro.enlace ? `<p style="margin: 0; font-size: 13px;"><strong>Enlace:</strong> <a href="${escapeHtml(libro.enlace)}" style="color: #3BACBD;">${escapeHtml(libro.enlace)}</a></p>` : ""}
    </div>`
    )
    .join("")

// Aviso interno a la Biblioteca. `replyTo` es el solicitante para poder contestarle directamente
export const sendBookSuggestionEmail = async (payload: Payload, { solicitante, libros }: SendBookSuggestionEmailParams) => {
  const body = `
    <p style="margin: 0 0 4px; font-size: 14px; color: #333333;"><strong>Solicitante:</strong> ${escapeHtml(solicitante.nombre)}</p>
    <p style="margin: 0 0 4px; font-size: 14px; color: #333333;"><strong>Correo:</strong> ${escapeHtml(solicitante.email)}</p>
    ${solicitante.rol ? `<p style="margin: 0 0 16px; font-size: 14px; color: #333333;"><strong>Rol:</strong> ${escapeHtml(solicitante.rol)}</p>` : '<div style="margin-bottom: 12px;"></div>'}
    ${booksHtml(libros)}
  `

  await sendBrandedEmail(payload, {
    to: process.env.SUGGESTIONS_EMAIL_TO || CONTACT_EMAIL,
    replyTo: solicitante.email,
    subject: `Sugerencia de ${libros.length === 1 ? "libro" : `${libros.length} libros`} de ${solicitante.nombre}`,
    html: emailLayout("Nueva sugerencia de libros", body),
  })
}

// Copia de confirmación para quien sugiere (el modal del formulario promete este correo)
export const sendBookSuggestionConfirmationEmail = async (payload: Payload, { solicitante, libros }: SendBookSuggestionEmailParams) => {
  const body = `
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">Hola ${escapeHtml(solicitante.nombre)},</p>
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #333333;">
      Hemos recibido tu sugerencia de adquisición. El equipo de la Biblioteca la evaluará y se pondrá en contacto contigo.
    </p>
    ${booksHtml(libros)}
  `

  await sendBrandedEmail(payload, {
    to: solicitante.email,
    subject: "Hemos recibido tu sugerencia de libro — Biblioteca UNAM",
    html: emailLayout("Sugerencia recibida", body),
  })
}

// ---------------------------------------------------------------------------
// Collection de contacto (formulario público /contacto)
// ---------------------------------------------------------------------------

export const Email: CollectionConfig = {
    slug: 'sendEmail',
    admin: {
        hidden: true
    },
    access: {
        create: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email'
        },
        {
            name: 'about',
            label: 'Asunto',
            type: 'text'
        },
        {
            name: 'message',
            label: 'Mensaje',
            type: 'richText'
        },
    ],
    hooks: {
        afterChange: [
            async ({ req: { payload }, doc }) => {
                const body = `
            <p style="margin: 0 0 8px; font-size: 14px; color: #333333;"><strong>Email:</strong> ${doc.email}</p>
            <p style="margin: 0 0 8px; font-size: 14px; color: #333333;"><strong>Nombre:</strong> ${doc.name}</p>
            <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Mensaje:</strong> ${doc.message}</p>
          `
                await sendBrandedEmail(payload, {
                    to: 'mansourlol440@gmail.com',
                    subject: `Nuevo mensaje: ${doc.about}`,
                    html: emailLayout('Nuevo mensaje de contacto', body),
                })
            },
        ],
    },
}
