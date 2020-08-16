/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:25:00
 * @Last Modified by: eamiear
 * @Last Modified time: 2020-08-15 16:45:13
 */

import Converter, { fillLength } from './converter'
import TypeHints from './typeHints'
import Suiter, { SuitStatus, SuitTypes } from '../utils/suiter';
/**
 * @class
 * @classdesc 状态描述器<br>
 *
 * <pre>
 * 命名规则： get[设备类型名称]StatusDescriptor； 设备类型名称与SuiterMap配置表的key字段相同，<br>
 * 如led --> getLedStatusDescriptor<br>
 * </pre>
 */
class StatusDescriptor {
  public readonly Suiter = {};
  public readonly SuitStatus = {};
  public readonly SuitTypes = {};
  public readonly TypeHints = {};
  public readonly Converter = {};
  constructor() {
    this.Suiter = Suiter;
    this.SuitStatus = SuitStatus;
    this.SuitTypes = SuitTypes;
    this.TypeHints = TypeHints;
    this.Converter = Converter;
  }

  public getPrimaryStatusCode(deviceType: string, status: string): string {
    if (!deviceType || !status) {
      console.warn('primary device type or status can not be empty!');
      return '';
    }
    return `${deviceType}${status}`;
  }
  public getSecondaryStatusCode(
    deviceType: string,
    deviceChildType: string,
    status: string
  ): string {
    if (!deviceType || !deviceChildType || !status) {
      console.warn('device type or status can not be empty!');
      return '';
    }
    return `${deviceType}${deviceChildType}${status}`;
  }
  public getDescriptorByCode(code: string): string {
    if (!code) { console.warn('key code can not be empty!'); }
    return (this.SuitStatus as any)[code];
  }

  public getMainDescriptor(deviceType: string, code: string): string {
    return this.getDescriptorByCode(
      this.getPrimaryStatusCode(deviceType, code)
    );
  }
  public getDescriptors(
    deviceType: string,
    statusBitStr: string,
    separator: string = ','
  ): string {
    let descriptor: Array<any> = [];
    for (let i = statusBitStr.length; i > 0; i -= 2) {
      const statusBit = statusBitStr.slice(i - 2, i);
      descriptor.push(
        this.getDescriptorByCode(
          this.getPrimaryStatusCode(deviceType, statusBit)
        )
      );
    }
    return descriptor.join(separator);
  }
  getSwitchDescriptor (status:string, deviceType:string, deviceChildType?:string): string {
    const socketStatus = new SocketStatus(status)
    if(!deviceChildType) return this.getMainDescriptor(deviceType, socketStatus.getState())

    const TypeHints = this.TypeHints as any
    const bitlen = TypeHints.getSocketSwitchLen(deviceChildType)

    if (TypeHints.isPlugSocketSwitch(deviceChildType)) {
      const statusBitStr = fillLength(socketStatus.getPlugStatus(), bitlen)
      return this.getDescriptors(deviceType, statusBitStr)
    }
    if (TypeHints.isTouchSocketSwitch(deviceChildType)) {
      const statusBitStr = fillLength(socketStatus.getTouchStatus(), bitlen)
      return this.getDescriptors(deviceType, statusBitStr)
    }
    if (TypeHints.isNormalSocketSwitch(deviceChildType)) {
      const statusBitStr = fillLength(socketStatus.getTouchStatus(), bitlen)
      return this.getDescriptors(deviceType, statusBitStr)
    }
    if (TypeHints.isMixSocketSwitch(deviceChildType)) {
      const statusBitStr = fillLength(socketStatus.getMixupStatus(), bitlen)
      return this.getDescriptors(deviceType, statusBitStr)
    }
    if (TypeHints.isSceneSocketSwitch(deviceChildType)) {
      const statusBitStr = fillLength(socketStatus.getSceneStatus(), bitlen)
      return this.getDescriptors(deviceType, statusBitStr)
    }
    return ''
  }
  getLampDescriptor (status:string, deviceType:string, deviceChildType:string) {
    const lampStatus = new LampStatus(status)
    // if (TypeHints.isSimpleLed())
  }
  /**
   * 组合状态描述 -- 010010 --> 开/关/置反
   * @private
   * @param {string} deviceType 设备类型
   * @param {string | number} number 16进制状态码
   * @param {string | number} len 状态码长度取值
   */
  // __combineSocketStatus (deviceType, number, len) {
  //   let bitStr = Converter.toBinary(number, 16)
  //   let descriptor = []
  //   // 长度处理
  //   bitStr = Converter.fillLength(bitStr, len)
  //   for (let i = bitStr.length; i > 0; i -= 2) {
  //     descriptor.push(SuitStatus[this.__getStatusKey(deviceType, bitStr.slice(i - 2, i))])
  //   }
  //   return descriptor.join(',')
  // }
  /**
   * 0401 socket 取第一个字节，后四位bit决定状态（特殊: 一个位一个状态）
   * @private
   * @param {string} status 16进制状态码
   */
  // __parseSimpleSocket (deviceType, status, len) {
  //   let bitStr = Converter.toBinary(status.slice(0, 2), 16)
  //   let descriptor = []
  //   bitStr =  Converter.fillLength(bitStr, len)
  //   for (let i = bitStr.length; i > 0; i -= 2) {
  //     descriptor.push(SuitStatus[this.__getStatusKey(deviceType, bitStr.slice(i - 2, i))])
  //   }
  //   return descriptor.join(',')
  // }
  /**
   * 获取插座开关状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */
  // getSocketSwitchStatusDescriptor (status, deviceType, deviceSubType) {
  //   if (!deviceSubType) return SuitStatus[this.__getStatusKey(deviceType, status.slice(6, 8))]
  //   const len = TypeHints.statusLengthSocketSwitch(deviceSubType)
  //   // 智能插座
  //   if (TypeHints.isSimpleSocketSwitch(deviceSubType)) {
  //     return this.__parseSimpleSocket(deviceType, status, len)
  //   }
  //   // TODO 单键、双键、三键、四键开关区分 ==》 开、开/关、开/开/关、关/关/关/开
  //   if (TypeHints.isTouchSocketSwitch(deviceSubType) || TypeHints.isNormalSocketSwitch(deviceSubType)) {
  //     return this.__combineSocketStatus(deviceType, status.slice(0, 2), len)
  //   }

  //   if (TypeHints.isMixSocketSwitch(deviceSubType)) {
  //     return this.__combineSocketStatus(deviceType, status.slice(2, 4), len)
  //   }

  //   if (TypeHints.isSceneSocketSwitch(deviceSubType)) {
  //     return this.__combineSocketStatus(deviceType, status.slice(6, 8), len)
  //   }
  // }
  /**
   * 获取LED灯状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getLedStatusDescriptor (status, deviceType, deviceSubType) {
    let light = 0
    let num = +Converter.toDecimal(status.slice(0, 2), 16)
    if (TypeHints.isSimpleLed(deviceSubType)) {
      light = num === 0 ? 0 : `${parseInt((num - 128) * 100 / 126)}%`
    }
    if (TypeHints.isColorLed(deviceSubType)) {
      light = `${num}%`
    }
    if (TypeHints.isWayLed(deviceSubType)) {
      light = `${num}% ${+Converter.toDecimal(status.slice(2, 4), 16)}% ${+Converter.toDecimal(status.slice(4, 6), 16)}%`
    }
    return light ? '开' : '关'
  }
  /**
   * 获取传感器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */
  getSensorsStatusDescriptor (status, deviceType, deviceSubType) {
    // ac ac
    if (!deviceSubType) return SuitStatus[this.__getStatusKey(deviceType, status.slice(8, 10))]

    // cardSenseSensor
    if (TypeHints.isCardSenseSensors(deviceSubType)) return SuitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))]

    // acdcman(红外+光感)
    // if (TypeHints.isAcdcmanSensors(deviceSubType)) return SuitStatus[this.__getStatusSubKey(deviceType, deviceSubType, status.slice(2, 4))]

    // ac红外
    // if (TypeHints.isAcSensors(deviceSubType)) return SuitStatus[this.__getStatusSubKey(deviceType, deviceSubType, status.slice(2, 4))]

    //humidifier
    if (TypeHints.isHumidifierSensors(deviceSubType)) {
      const tempNum = status.slice(2, 4);
      const temp = (tempNum === 'ff' ? '-' : (Converter.toDecimal(status.slice(2, 4), 16) - 30))+ '℃'
      const RH =  Converter.toDecimal(status.slice(6, 8), 16) + '%RH'
      return `${temp}-${RH}`
    }

    // 其它类型传感器烟雾，燃气，尿床，一键呼救，水浸，门磁,ac红外,dc红外
    return SuitStatus[this.__getStatusSubKey(deviceType, deviceSubType, status.slice(2, 4))] || ''
  }
  /**
   * 获取门锁状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getDoorLockStatusDescriptor (status, deviceType) {
    // const cmd = status.slice(2, 4)
    // const cmdMap = {
    //   'c3': Converter.toDecimal(status.slice(10, 12), 16),
    //   'cd': '2'
    // }
    // return SuitStatus[this.__getStatusKey(deviceType, (cmdMap[cmd] || '-1'))]
    const _this = this
    function _openTypeStatus (byte) {
      return SuitStatus[_this.__getStatusKey(deviceType, `open${Converter.toDecimal(byte, 16)}`)]
    }
    function _closeTypeStatus (byte) {
      return SuitStatus[_this.__getStatusKey(deviceType, `close${Converter.toDecimal(byte, 16)}`)]
    }
    const cmd = status.slice(0, 2)
    const cmdMap = {
      '0xc3': _openTypeStatus(status.slice(8, 10)),
      '0xcd': SuitStatus[this.__getStatusKey(deviceType, 'card')],
      '0xc6': _closeTypeStatus(status.slice(2, 4))
    }
    return cmdMap[cmd] || SuitStatus['default']
  }
  /**
   * 获取OBOX状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getOboxStatusDescriptor(status, deviceType) {

  }
  /**
   * 获取电饭煲状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getCookerStatusDescriptor(status, deviceType) {

  }
  /**
   * 获取加湿器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getHumidifierStatusDescriptor(status, deviceType) {

  }
  /**
   * 获取可开关类设备状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getSwitchgearStatusDescriptor(status, deviceType) {
    const hexbyte = status.slice(0, 2)
    const num = Converter.toDecimal(hexbyte, 16)
    if (num === 4) {
      return Converter.toDecimal(status.slice(2, 4), 16) + '%'
    } else {
      return SuitStatus[this.__getStatusKey(deviceType, hexbyte)]
    }
  }
  /**
   * 风扇状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getFansStatusDescriptor(status, deviceType) {

  }
  /**
   * 空气清洁器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getAirCleanerStatusDescriptor(status, deviceType) {

  }
  /**
   * tv
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getTvStatusDescriptor(status, deviceType) {

  }
  /**
   * 网关
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getGateWayStatusDescriptor(status, deviceType) {

  }
  /**
   * 抄表器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getMeterReaderStatusDecriptor(status, deviceType) {

  }
  /**
   * 远程控制面板
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getWireControlPanelStatusDescriptor(status, deviceType, deviceSubType) {
    if (this.isAcWireControlPanel(deviceSubType)) {
      return SuitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))]
    }

  }
  /**
   * 转发器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getTransponderStatusDescriptor(status, deviceType) {

  }
  /**
   * 远程控制
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getRemoteControlStatusDescriptor(status, deviceType) {

  }
  /**
   * 自动移动器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getAutoMoverStatusDescriptor(status, deviceType) {

  }
  /**
   * 远程控制灯
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getRemoteControlLampStatusDescriptor(status, deviceType) {

  }
}

export default new StatusDescriptor()