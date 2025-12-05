function isClass(x: any): x is Class {
  return typeof x === "function";
}

export function Abstract(
  target: Class | object,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor
): any {

  // --- CLASS DECORATOR ---
  if (propertyKey === undefined) {
    if (!isClass(target)) {
      throw new Exception("@Abstract must be used on a class or function");
    }

    const Original = target;

    const Wrapper = class extends Original {
      constructor(...args: any[]) {
        if (new.target === Original) {
          throw new AbstractInitializationException(
            `Abstract class ${Original.name} cannot be instantiated directly`
          );
        }
        super(...args);
      }
    };

    Object.defineProperty(Wrapper, "name", { value: Original.name });

    return Wrapper;
  }

  // --- METHOD DECORATOR ---
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new Error("@Abstract can only be applied to methods");
  }

  const originalMethod = descriptor.value;

  descriptor.value = function (this: any, ...args: any[]) {
    if (this.constructor === target.constructor) {
      throw new AbstractMethodInvokedException(
        `Abstract method ${String(propertyKey)} must be overridden`
      );
    }
    return originalMethod.apply(this, args);
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
      throw new Exception(`${original.name} is a final class and cannot be extended`);
    }
    return Reflect.construct(original, args, new.target);
  }

  // Copy prototype
  FinalizedConstructor.prototype = original.prototype;

  return FinalizedConstructor as any;
}