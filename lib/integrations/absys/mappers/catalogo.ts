const ABSYS_BASE = "cata";
const DOC_FIELDS = "245, 100, 020";
const DEFAULT_PAGE_SIZE = 12;

export interface CatalogSearchParams {
  search: string;
  page?: number | string;
  limit?: number | string;
  detalle?: boolean;
}

export const toCatalogQuery = ({ search, page, limit, detalle }: CatalogSearchParams) => {
  const pagePosition = Math.max(1, parseInt(String(page), 10) || 1);
  const maxRecords = Math.max(1, parseInt(String(limit), 10) || DEFAULT_PAGE_SIZE);

  return {
    base: ABSYS_BASE,
    search,
    ...(detalle ? { _description: "1" } : { _doc_fields: DOC_FIELDS }),
    _start_position: String((pagePosition - 1) * maxRecords + 1),
    _max_records: String(maxRecords),
  };
};
