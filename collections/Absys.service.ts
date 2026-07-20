import type { CollectionConfig } from "payload";

import { PayloadHandler } from 'payload';


interface AbsysResponse {
  data: any;
  error?: string;
}

// Helper para obtener credenciales y headers
const getAbsysHeaders = () => {
  const user = process.env.NEXT_ABSYS_USERNAME;
  const pass = process.env.NEXT_ABSYS_PASSWORD;

  if (!user || !pass) {
    console.warn("Alerta: Las variables de entorno de ABSYS no están definidas o cargadas.");
  }

  const auth = Buffer.from(user + ":" + pass).toString('base64');

  const headers = new Headers();
  headers.append('Authorization', `Basic ${auth}`);

  // Hacemos un clon exacto de la petición de Postman:
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', '*/*'); // Postman usa */*
  headers.append('Cache-Control', 'no-cache');
  headers.append('User-Agent', 'PostmanRuntime/7.54.0'); // Disfrazamos el fetch de Postman

  // INYECTAMOS LA COOKIE ROTA DE BARATZ:
  headers.append('Cookie', 'Path=/');

  return headers;
};

const getPaginationParams = (req: any) => {
  const PAGE_SIZE = 12;
  const page = Math.max(1, parseInt(req.query?.page as string, 10) || 1);
  const limit = Math.max(1, parseInt(req.query?.limit as string, 10) || PAGE_SIZE);
  const startPosition = (page - 1) * limit + 1;
  return { startPosition, limit };
};

// Función genérica para ejecutar el fetch hacia Absys
const fetchAbsys = async (query: URLSearchParams): Promise<AbsysResponse> => {
  const baseUrl = process.env.NEXT_ABSYS_API;

  const response = await fetch(`${baseUrl}?${query.toString()}`, {
    method: 'GET',
    headers: getAbsysHeaders(),
    cache: 'no-store',
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Absys API Error: ${response.statusText} - ${JSON.stringify(responseData)}`);
  }

  return responseData;
};

// HANDLERS
export const handleSearch: PayloadHandler = async (req) => {
  try {
    // Sanitización: convertimos req.query en URLSearchParams
    const params = new URLSearchParams(req.query as Record<string, string>);
    params.set("operation", "search");
    params.set("base", "cata");
    params.set("search", "_")
    params.set("_doc_fields", "245, 100, 020");

    const result = await fetchAbsys(params);

    // res.status(200).json(result);
    return Response.json(
      {
        success: true,
        message: result,
      },
      { status: 200 }
    )

  } catch (error) {
    req.payload.logger.error(error);
    // res.status(500).json({ error: 'Error al comunicarse con el servicio de biblioteca.' });
    return Response.json(
      {
        success: false,
        error: "Error al comunicarse con el servicio de biblioteca.",
      },
      { status: 500 }
    )
  }
};

export const handlePaginationSearch: PayloadHandler = async (req) => {
  try {
    const { startPosition, limit } = getPaginationParams(req);

    const params = new URLSearchParams(req.query as Record<string, string>);
    params.set("operation", "search");
    params.set("base", "cata");
    params.set("search", "_");
    params.set("_doc_fields", "245, 100, 020");
    params.set("_start_position", String(startPosition));
    params.set("_max_records", String(limit));

    const result = await fetchAbsys(params);

    return Response.json(
      { success: true, message: result },
      { status: 200 }
    );
  } catch (error) {
    req.payload.logger.error(error);
    return Response.json(
      { success: false, error: "Error al comunicarse con el servicio de biblioteca." },
      { status: 500 }
    );
  }
};

export const handleResourceByName: PayloadHandler = async (req) => {
  try {
    const { name } = req.routeParams as { name: string };

    if (!name) {
      // return res.status(400).json({ error:  });
      return Response.json(
        {
          success: false,
          message: 'Nombre/ID de recurso requerido',
        },
        {
          status: 400,
        }
      )
    }

    const params = new URLSearchParams({ query: name });
    params.set("operation", "search");
    params.set("base", "cata");
    params.set("search", name)
    params.set("_description", "1");

    const result = await fetchAbsys(params);

    // res.status(200).json(result);
    return Response.json(
      {
        success: true,
        message: result,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    req.payload.logger.error(error);
    // res.status(500).json({ error: 'Error al buscar el recurso específico.' });
    return Response.json(
      {
        success: false,
        message: 'Error al buscar el recurso específico.',
      },
      {
        status: 500,
      }
    )
  }
};

export const handlePaginationResourceByName: PayloadHandler = async (req) => {
  try {
    const { name } = req.routeParams as { name: string };

    if (!name) {
      return Response.json(
        { success: false, message: 'Nombre/ID de recurso requerido' },
        { status: 400 }
      );
    }

    const { startPosition, limit } = getPaginationParams(req);

    const params = new URLSearchParams();
    params.set("operation", "search");
    params.set("base", "cata");
    params.set("search", name);
    params.set("_description", "1");
    params.set("_start_position", String(startPosition));
    params.set("_max_records", String(limit));

    const result = await fetchAbsys(params);

    return Response.json(
      { success: true, message: result },
      { status: 200 }
    );
  } catch (error) {
    req.payload.logger.error(error);
    return Response.json(
      { success: false, message: 'Error al buscar el recurso específico.' },
      { status: 500 }
    );
  }
};

export const AbsysService: CollectionConfig = {
  slug: "absys_service",
  admin: {
    hidden: true,
  },
  access: {
    read: () => true
  },
  fields: [
    {
      name: 'isbn',
      label: 'Nombre',
      type: "text",
    },
    {
      name: 'title',
      label: 'Nombre',
      type: "text",
    },
    {
      name: 'author',
      label: 'Nombre',
      type: "text",
    },
  ],
  endpoints: [
    {
      path: '/search',
      method: 'get',
      handler: handleSearch,
    },
    {
      path: '/:name',
      method: 'get',
      handler: handleResourceByName,
    },
    {
      path: '/',
      method: 'get',
      handler: handleSearch
    }
  ]
}
