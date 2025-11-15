export function Abstract(
  target: any,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor
): any {
  if (typeof propertyKey === "undefined") {
    // Class decorator
    const originalConstructor = target;
    const newConstructor: any = (...args: any[]) => {
      if (new.target === originalConstructor) {
        throw new AbstractInitializationException(
          `Abstract class ${originalConstructor.name} cannot be instantiated directly`
        );
      }
      return new originalConstructor(...args);
    };
    // Copy prototype so instanceof works
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor; // IMPORTANT: must return the new constructor
  }

  if (!descriptor || typeof descriptor.value !== "function") {
    throw new Error("@Abstract can only be applied to methods");
  }

  const original = descriptor.value;
  descriptor.value = function (this: any, ...args: any[]) {
    const caller = this.constructor.name;
    const origin = target.constructor.name;

    if (caller === origin) {
      throw new AbstractMethodInvokedException(
        `Abstract method ${propertyKey.toString()} must be overridden before calling`
      );
    }
    return original.apply(this, args);
  };

  return descriptor;
}

export function Final(target: Function, propertyKey?: string, descriptor?: PropertyDescriptor) {
  if (descriptor) {
    // Decorating a method: make it non-writable
    descriptor.writable = false;
    return;
  }

  // Decorating a class: prevent subclassing
  const original = target;

  function FinalizedConstructor(...args: any[]) {
    if (new.target !== original) {
      throw new Error(`${original.name} is a final class and cannot be extended`);
    }
    return Reflect.construct(original, args, new.target);
  }

  // Copy prototype
  FinalizedConstructor.prototype = original.prototype;

  return FinalizedConstructor as any;
}