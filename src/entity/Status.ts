export class Status {
  public readonly status: string = '';
  constructor(status: string) {
    this.status = status;
  }
  adaptHex (hex: string): string {
    return hex.length > 1 ? hex :  `0${hex}`
  }
}
