import { buildConfig } from "payload";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { es } from '@payloadcms/translations/languages/es';
import { en } from '@payloadcms/translations/languages/en';
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { importExportPlugin } from "@payloadcms/plugin-import-export";

import { Home } from "./globals/Home.ts";
import { Library as LibraryGlobal } from "./globals/Library.ts";
import { Contact } from "./globals/Contact.ts";
import { Services } from "./globals/Services.ts";
import { Repositories } from "./globals/Repositories.ts";
import { Investigation } from "./globals/Investigation.ts";
import { Formation } from "./globals/Formation.ts";
import { Layout } from "./globals/Layout.ts";
import { AboutUs } from "./globals/AboutUs.ts";
import { ElectronicResources } from "./globals/ElectronicResources.ts";
import { SolicitudCompra } from "./globals/SolicitudCompra.ts";
import { QuienesSomos } from "./globals/QuienesSomos.ts";
import { HorariosContacto } from "./globals/HorariosContacto.ts";

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
import { Email } from "./collections/Email.service.ts";
import { NewsCollection } from "./collections/News.ts";
import { BlogsCollection } from "./collections/Blogs.ts";
import { PartnersCollection } from "./collections/Partners.ts";
import { Input } from "./collections/Input.ts";
import { HeroCarrusel } from "./collections/HeroCarrusel.ts";
import { Header } from "./collections/Header.ts";
import { Footer } from "./collections/Footer.ts";
import { ElectronicResourcesAccess } from "./collections/ElectronicResourcesAccess.ts";
import { Schedule } from "./collections/Schedule.ts";
import { Pages } from "./collections/Pages.ts";


import { AbsysService } from "./collections/Absys.service.ts";
import { BookCoverService } from "./collections/BookCovers.service.ts";
import { AuthorService } from "./collections/Author.service.ts";
import { LoginAbsysService } from "./collections/LoginAbsys.service.ts";
import { decryptTestEndpoints, LoginCampusService } from "./collections/LoginCampus.service.ts";
import { Login } from "./collections/Login.ts";
import { adminOnly } from "./lib/access.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  routes: {
    admin: '/admin'
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' – Biblioteca UNAM – Administración',
      defaultOGImageType: 'off',
      icons: [{ rel: 'icon', type: 'image/png', url: '/biblioteca/logos/unam-color-logo.png' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminLogo',
        Icon: '/components/admin/AdminIcon',
      },
      beforeDashboard: ['/components/admin/DashboardWelcome'],
      afterNavLinks: ['/components/admin/NavHelp'],
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { name: 'mobile', label: 'Móvil', width: 375, height: 667 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Escritorio', width: 1440, height: 900 },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Hero,
    Header,
    HeroCarrusel,
    Speakers,
    Statistics,
    About,
    Features,
    Timeline,
    Input,
    CTA,
    FAQ,
    Email,
    BlogsCollection,
    PartnersCollection,
    NewsCollection,
    Footer,
    Login,
    AbsysService,
    BookCoverService,
    AuthorService,
    LoginAbsysService,
    ElectronicResourcesAccess,
    Schedule,
    LoginCampusService,
    Pages
  ],
  globals: [
    Home,
    LibraryGlobal,
    Layout,
    Services,
    Investigation,
    Repositories,
    Formation,
    Contact,
    AboutUs,
    ElectronicResources,
    QuienesSomos,
    HorariosContacto,
    SolicitudCompra
  ],
  endpoints: [...decryptTestEndpoints],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  // Tope de tamaño de subida (solo hay una collection de upload: media)
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  sharp,
  plugins: [
    importExportPlugin({
      collections: [
        { slug: 'news' },
        { slug: 'blogs' },
        { slug: 'faq' },
        { slug: 'features' },
        { slug: 'electronic_resources_access' },
        { slug: 'schedule' },
        { slug: 'speakers' },
        { slug: 'partners' },
        { slug: 'pages' },
        { slug: 'media' },
      ],
      overrideExportCollection: ({ collection }) => ({
        ...collection,
        labels: { singular: 'Exportación', plural: 'Exportaciones' },
        access: { ...adminOnly },
        admin: { ...collection.admin, group: 'Usuarios y accesos' },
      }),
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        labels: { singular: 'Importación', plural: 'Importaciones' },
        access: { ...adminOnly },
        admin: { ...collection.admin, group: 'Usuarios y accesos' },
      }),
    }),
  ],
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
