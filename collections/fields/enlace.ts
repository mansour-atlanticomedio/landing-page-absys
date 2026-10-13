import type { Field } from "payload";
import { ANCLAS, ENLACES_EXTERNOS_KEYS } from "@/lib/links";

interface EnlaceFieldsOptions {
    externalName?: "url" | "link";
    defaultTipo?: "interno" | "externo";
    description?: string;
}

// Campos comunes de un enlace (interno, ancla, registro o externo); `to` y `url`/`link` se
// conservan con su nombre original para no perder datos ya guardados. Ninguno es required porque
// los condicionales ocultos romperían la validación
export const enlaceFields = ({
    externalName = "url",
    defaultTipo = "interno",
    description,
}: EnlaceFieldsOptions = {}): Field[] => [
    {
        name: "tipo",
        label: "Tipo de enlace",
        type: "select",
        defaultValue: defaultTipo,
        admin: description ? { description } : undefined,
        options: [
            { label: "Página interna", value: "interno" },
            { label: "Sección de una página (ancla)", value: "ancla" },
            { label: "Enlace del registro de enlaces externos", value: "registro" },
            { label: "URL externa", value: "externo" },
        ],
    },
    {
        name: "to",
        label: "Ruta interna",
        type: "text",
        admin: { condition: (_, siblingData) => (siblingData?.tipo ?? defaultTipo) === "interno" },
    },
    {
        name: "ancla",
        label: "Sección",
        type: "select",
        options: ANCLAS.map((a) => ({ label: a.label, value: a.key })),
        admin: { condition: (_, siblingData) => siblingData?.tipo === "ancla" },
    },
    {
        name: "enlace_key",
        label: "Enlace del registro",
        type: "select",
        options: ENLACES_EXTERNOS_KEYS.map((k) => ({ label: k.label, value: k.key })),
        admin: { condition: (_, siblingData) => siblingData?.tipo === "registro" },
    },
    {
        name: externalName,
        label: "URL externa",
        type: "text",
        admin: { condition: (_, siblingData) => (siblingData?.tipo ?? defaultTipo) === "externo" },
    },
    {
        name: "nueva_pestana",
        label: "Abrir en pestaña nueva",
        type: "checkbox",
        admin: { description: "Por defecto se abre en pestaña nueva solo si es externo" },
    },
];
