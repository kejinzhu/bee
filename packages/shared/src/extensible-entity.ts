/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { VerseaError } from './error';

export interface ExtensiblePropDescription {
  required?: boolean;
  default?: any;
  validator?: (value: any) => boolean;
}

/**
 * 获取所有的派生类
 * @param instance 派生类的实例
 * @param baseClass 基础类
 */
function findAllDerivedClass(instance: any, baseClass: any, currentValue: any[] = []): any[] {
  const targetConstructor = instance.constructor;

  // 只寻找派生类，不包含这个基类
  if (targetConstructor === baseClass) {
    return currentValue;
  }

  const result: any[] = [...currentValue];
  if (targetConstructor && !currentValue.includes(targetConstructor)) {
    result.push(targetConstructor);
  }

  /* istanbul ignore next */
  if (!instance.__proto__) {
    return result;
  }

  return findAllDerivedClass(instance.__proto__, baseClass, result);
}

export class ExtensibleEntity {
  [key: string]: any;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static __extensiblePropDescriptions__: Record<string, ExtensiblePropDescription | undefined>;

  constructor(options: Record<string, any> = {}) {
    const constructors = findAllDerivedClass(this, ExtensibleEntity);
    // 从子类开始遍历，子类 -> 孙子类 -> ...
    constructors.reverse().forEach((ctor) => {
      const descriptions: Record<string, ExtensiblePropDescription> | undefined = ctor.__extensiblePropDescriptions__;
      if (descriptions) {
        Object.keys(descriptions).forEach((key: string) => {
          this._setEntityProp(key, options[key], descriptions[key]);
        });
      }
    });
  }

  /**
   * 在实体类上新增一个字段
   */
  public static defineProp(key: string, description: ExtensiblePropDescription = {}): void {
    if (!Object.prototype.hasOwnProperty.call(this, '__extensiblePropDescriptions__')) {
      this.__extensiblePropDescriptions__ = {};
    }

    if (this.__extensiblePropDescriptions__[key]) {
      throw new VerseaError(`Duplicate prop: ${key}`);
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      typeof description.default === 'object' &&
      description.default !== null
    ) {
      console.warn(
        `Invalid default value for prop "${key}": Props with type Object/Array must use a factory function to return the default value.`,
      );
    }

    this.__extensiblePropDescriptions__[key] = description;
  }

  private _setEntityProp(key: string, value: any, description: ExtensiblePropDescription): void {
    if (value === undefined) {
      const defaultValue = description.default;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      value = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    if (description.required && value === undefined) {
      throw new VerseaError(`Missing required prop: "${key}"`);
    }

    if (description.validator && !description.validator(value)) {
      throw new VerseaError(`Invalid prop: custom validator check failed for prop "${key}"`);
    }

    this[key] = value;
  }
}