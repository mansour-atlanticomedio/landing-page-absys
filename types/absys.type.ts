
export interface AbsysInterface {
    code: number,
    subcode2: number,
    count: number,
    description: string,
    subcode: number,
    collection: {
        xmlns: string,
        record: RecordInterface[]
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
    description?: string,
    editorial?: string,
    published?: string,
    themes?: string[]
}