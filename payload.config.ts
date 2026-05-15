import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Hero } from "./collections/Hero";
import { Home } from "./app/globals/Home";
import { Speakers } from "./collections/Speakers";
import { Statistics } from "./collections/Statistics";
import { About } from "./collections/About";
import { Features } from "./collections/Features";
import { Timeline, TimeStamp } from "./collections/Timeline";
import { Socials } from "./collections/Socials";
import { CTA } from "./collections/CTA";
import { FAQ } from "./collections/FAQ";
import { Contact } from "./app/globals/Contact";
import { Contact as ContactSection } from "./collections/Contact"

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
    Features,
    Timeline,
    TimeStamp,
    Socials,
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
});
