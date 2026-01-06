function isClass(x: unknown): x is Class {
  return typeof x === "function";
}

export function Abstract<T extends Class<false>>(ctor: T): T;
export function Abstract(target: Object, propertyKey: string | symbol, description: PropertyDescriptor): PropertyDescriptor
export function Abstract<T extends Class<false>>(
  target: Object | T,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor
): T | PropertyDescriptor {

  // --- CLASS DECORATOR ---
  if (isClass(target)) {
    const Wrapper = class extends target {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        const clz = target as T;
        if (new.target === clz) {
          throw new AbstractInitializationException(
            `Abstract class ${clz.name} cannot be instantiated directly`
          );
        }
        super(...args);
      }
    };

    Wrapper.prototype = target.prototype;
    Object.defineProperty(Wrapper, "name", { value: target.name });

    return Wrapper as T;
  }

  // --- METHOD DECORATOR ---
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new Error("@Abstract can only be applied to methods and classes");
  }

  const originalMethod = descriptor.value;

  descriptor.value = function (this: Class, ...args: unknown[]) {
    if (this.constructor === target.constructor) {
      throw new AbstractMethodInvokedException(
        `Abstract method ${String(propertyKey)} must be overridden`
      );
    }
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

export function Final<T extends Class<false>>(target: T): T | void {
  if(!isClass(target)) {
    throw new IncorrectDecoratorPlacmentException("@Final decorator can only go on ES___ classes");
  }

  const original = target;

  const Wrapper = class extends target {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      if (new.target !== original) {
        throw new Exception(`${original.name} is a final class and cannot be extended`);
      }
      super(...args);
    }
  };

  Wrapper.prototype = original.prototype;

  return Wrapper;
}