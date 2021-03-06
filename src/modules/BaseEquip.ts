/*
 * @Author: eamiear
 * @Date: 2020-08-20 17:38:47
 * @Last Modified by: eamiear
 * @Last Modified time: 2020-12-22 14:58:27
 */
import Suiter, { SuitStatus, SuitTypes } from '../utils/suiter';
import { TypeHints } from '../utils/typeHints';
import { Converter } from '../utils/converter';
// const _Converter = Converter
export class BaseEquip {
  public readonly Suiter = {};
  public readonly SuitStatus = {};
  public readonly SuitTypes = {};
  public readonly TypeHints: typeof TypeHints;
  public readonly Converter: typeof Converter;

  public readonly deviceType: string | undefined = '';
  public readonly deviceChildType: string | undefined = '';
  public status: string = '';
  constructor(status: string, deviceType?: string, deviceChildType?: string) {
    this.Suiter = Suiter;
    this.SuitStatus = SuitStatus;
    this.SuitTypes = SuitTypes;
    this.TypeHints = TypeHints;
    this.Converter = Converter;

    this.deviceType = deviceType;
    this.deviceChildType = deviceChildType;
    this.status = status;
  }

  public getStatus () {
    return this.status
  }

  public getPrimaryStatusCode(mainDevType: string, status: string): string {
    if (!mainDevType || !status) {
      console.warn('primary device type or status can not be empty!');
      return '';
    }
    return `${mainDevType}${status}`;
  }

  public getSecondaryStatusCode(
    mainDevType: string,
    secondarySubType: string,
    status: string
  ): string {
    if (!mainDevType || !secondarySubType || !status) {
      console.warn('device type or status can not be empty!');
      return '';
    }
    return `${mainDevType}${secondarySubType}${status}`;
  }

  public getDescriptorByCode(code: string): string {
    if (!code) {
      console.warn('key code can not be empty!');
    }
    return (this.SuitStatus as any)[code];
  }

  public getMainDescriptor(mainDevType: string, code: string): string {
    return this.getDescriptorByCode(
      this.getPrimaryStatusCode(mainDevType, code)
    );
  }

  public getDescriptors(
    mainDevType: string,
    statusBitStr: string,
    separator: string = ','
  ): string {
    const descriptor: any[] = [];
    for (let i = statusBitStr.length; i > 0; i -= 2) {
      const statusBit = statusBitStr.slice(i - 2, i);
      descriptor.push(
        this.getDescriptorByCode(
          this.getPrimaryStatusCode(mainDevType, statusBit)
        )
      );
    }
    return descriptor.join(separator);
  }
}
