export class AbsysError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly subcode?: number
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class AbsysNotFoundError extends AbsysError {}

export class AbsysUnavailableError extends AbsysError {}

export class AbsysInvalidDataError extends AbsysError {}
