namespace Opti.Flow {
  export class Flow {
    static flows(fn: globalThis.Flow.Checkable): boolean;
    static flows<T extends globalThis.Flow.Checkable>(fn: T, flowback: T): boolean;
    static flows<T extends globalThis.Flow.Checkable>(fn: T, flowback?: T): boolean {
      return true;
    }
    static flowback(file: string): boolean;
    static flowback(test: FlowbackTest): void;
    static flowback(fileOrTest: string | FlowbackTest): boolean | void {

    }
  }
}