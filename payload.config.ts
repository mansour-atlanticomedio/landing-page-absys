import { buildConfig } from "payload";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { es } from '@payloadcms/translations/languages/es';
import { en } from '@payloadcms/translations/languages/en';
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Home } from "./globals/Home.ts";
import { Library as LibraryGlobal } from "./globals/Library.ts";
import { Contact } from "./globals/Contact.ts";
import { Repositories } from "./globals/Repositories.ts";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Hero } from "./collections/Hero.ts";
import { Speakers } from "./collections/Speakers.ts";
import { Statistics } from "./collections/Statistics.ts";
import { About } from "./collections/About.ts";
import { Features } from "./collections/Features.ts";
import { Timeline } from "./collections/Timeline.ts";
import { CTA } from "./collections/CTA.ts";
import { FAQ } from "./collections/FAQ.ts";
import { Email } from "./collections/Email.ts";
import { Library } from "./collections/Library.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  routes: {
    admin: '/admin'
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Hero,
    Speakers,
    Statistics,
    About,
    Features,
    Timeline,
    CTA,
    FAQ,
    Email,
    Library
  ],
  globals: [Home, LibraryGlobal, Repositories, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER as string,
    defaultFromName: 'Mansour Lo Lo',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false,
      tls: {
        ciphers: 'TLSv1.2',
        rejectUnauthorized: false
      }
    },
  }),
  i18n: {
    supportedLanguages: { en, es },
  }
});
