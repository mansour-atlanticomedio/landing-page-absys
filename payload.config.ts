import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Hero } from "./collections/Hero";
import { Home } from "./app/globals/Home";
import { Speakers } from "./collections/Speakers";
import { Statistics } from "./collections/Statistics";
import { About } from "./collections/About";
import { Features } from "./collections/Features";
import { Timeline } from "./collections/Timeline";
import { CTA } from "./collections/CTA";
import { FAQ } from "./collections/FAQ";
import { Contact } from "./app/globals/Contact";
import { Contact as ContactSection } from "./collections/Contact"
import { Email } from "./collections/Email";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
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
    Email,
    Features,
    Timeline,
    CTA,
    FAQ,
    ContactSection
  ],
  globals: [Home, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
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
});
