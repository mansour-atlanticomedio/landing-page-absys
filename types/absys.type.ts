
export interface AbsysInterface {
    code: number,
    subcode2: number,
    count: number,
    description: string,
    subcode: number,
    collection?: {
        xmlns: string,
        record: RecordInterface | RecordInterface[]
    },
    version: string,
}

export interface RecordInterface {
    leader: string,
    datafield: TagProps[],
    titn: number,
    index: number,
    controfield: TagProps[]
}

export type TagProps = {
    tag: string,
    content?: string,
    ind2?: string | number,
    ind1?: string | number,
  subfield?: {
      code: string,
      content: string,
      titn?: number
    }[]
}

export interface BookInterface {
    id?: string,
    title: string,
    author: string,
    year?: string,
    isbn: string,
    synopsis?: string,
    editorial?: string,
    published?: string,
    language?: string,
    tags?: string[] | null,
    available?: boolean,
    location?: string,
    signature?: string,
    authorBio?: string,
}

export type AbsysBoolean = "0" | "1";

export type AbsysCode = 0 | 1 | 2 | 3 | 4;

export interface AbsysDescribedField {
  content: string;
  description: string;
}

export type AbsysField = string | AbsysDescribedField;

export interface AbsysResponseMeta {
  code: AbsysCode;
  subcode?: number;
  subcode2?: number;
  description: string;
  count?: string;
  version?: string;
  table?: string;
}

export type AbsysApiResponse<T extends object = object> = {
  response: AbsysResponseMeta & T;
};

export interface AbsysLector {
  lenlec: string;
  lefsad?: string;
  leusad?: string;
  lefsmd?: string;
  leusmd?: string;
  lecobi?: AbsysField;
  lecosu?: AbsysField;
  lebasi?: AbsysBoolean;
  leapel: string;
  letitu?: string;
  leinic?: string;
  lenomb: string;
  ledi11?: string;
  ledi12?: string;
  ledi13?: string;
  ledi21?: string;
  ledi22?: string;
  ledi23?: string;
  letfn1?: string;
  letfn2?: string;
  letmov?: string;
  lemail?: string;
  leemac?: AbsysBoolean;
  lecolp: string;
  leadul?: AbsysBoolean;
  lecol1?: string;
  lecol2?: string;
  lecol3?: string;
  lefult?: string;
  lefreg?: string;
  lefren?: string;
  lefcad?: string;
  leddni?: string;
  lediso?: string;
  lencar?: string;
  lepass?: string;
  learpd?: string;
  learps?: string;
  learpt?: string;
  learre?: string;
  lecart?: string;
  lemess?: string;
  lefact?: string;
  lepaga?: string;
  lensus?: string;
  lefubi?: string;
  lenpac?: string;
  lenpan?: string;
  lencon?: string;
  lefuco?: string;
  lealia?: string;
  index?: string;
  expired?: AbsysBoolean;
  suspended?: AbsysBoolean;
  loan_return_date_exceeded?: AbsysBoolean;
  pending_debt?: AbsysBoolean;
  photo?: string;
  count_secondary?: string;
  presta?: AbsysPresta | AbsysPresta[];
}

export interface AbsysPresta {
  prbarc: string;
  prfsad?: string;
  prusad?: string;
  prfsmd?: string;
  prusmd?: string;
  prppsq?: string;
  prprsu?: string;
  prclas?: "D" | "S" | "T" | "V";
  prorpr?: string;
  prcosu?: AbsysField;
  prcocp?: string;
  prcocl?: string;
  prnlec?: string;
  prcolp?: string;
  prfpre?: string;
  prfdev?: string;
  prfult?: string;
  prnren?: string;
  index?: string;
  lent?: AbsysBoolean;
  reserved?: AbsysBoolean;
  available?: AbsysBoolean;
  renewable?: AbsysBoolean;
}

export type AbsysSearchLectorResponse = AbsysApiResponse<{
  lector?: AbsysLector;
}>;

export type AbsysAddLectorResponse = AbsysApiResponse<{
  lenlec?: number;
}>;

export type AbsysModifyLectorResponse = AbsysApiResponse;

export type AbsysDeleteLectorResponse = AbsysApiResponse;

export type AbsysCirculationResponse = AbsysApiResponse<{
  presta?: AbsysPresta;
  prbarc?: string;
}>;

export interface AbsysAddLectorPayload {
  lenlec?: string;
  leapel: string;
  lenomb: string;
  lepass?: string;
  lecolp: string;
  lecobi: string;
  lecart: string;
  ledi11: string;
  lecosu?: string;
  lecocf?: string;
  leacpd?: AbsysBoolean;
  lefepd?: string;
  lemail?: string;
  letfn1?: string;
  letfn2?: string;
  letmov?: string;
  ledi12?: string;
  ledi13?: string;
  leddni?: string;
}

export interface AbsysSearchLectorPayload {
  lenlec: string;
  lepass?: string;
  _description?: AbsysBoolean;
  _secondary?: AbsysBoolean;
  _sql_fields?: string;
}

export interface AbsysModifyLectorPayload {
  lenlec: string;
  lepass?: string;
  leapel?: string;
  lenomb?: string;
  lemail?: string;
  letfn1?: string;
  ledi11?: string;
  _sql_fields?: string;
}

export interface AbsysSuccess<T extends object = object> {
  ok: true;
  data: AbsysResponseMeta & T;
}

export interface AbsysFailure {
  ok: false;
  code: AbsysCode;
  subcode?: number;
  message: string;
}

export type AbsysResult<T extends object = object> = AbsysSuccess<T> | AbsysFailure;

export function parseAbsysResponse<T extends object = object>(
  raw: AbsysApiResponse<T>
): AbsysResult<T> {
  const { response } = raw;
  if (response.code !== 0) {
    return {
      ok: false,
      code: response.code,
      subcode: response.subcode,
      message: response.description,
    };
  }
  return { ok: true, data: response };
}

export async function fetchAbsys<T extends object = object>(
  url: string | URL
): Promise<AbsysResult<T>> {
  const res = await fetch(url.toString());
  const raw: AbsysApiResponse<T> = await res.json();
  return parseAbsysResponse<T>(raw);
}