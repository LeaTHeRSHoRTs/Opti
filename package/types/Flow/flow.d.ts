
type FlowbackTest = (fn: (...args: unknown[]) => unknown, flowTests: FlowTests) => boolean;

declare namespace Flow {
  export type Checkable = (...args: unknown[]) => unknown | Class;
}

interface FlowTests {
  test(): boolean;
}

interface Flow {
  flows(fn: (...args: unknown[]) => unknown): boolean;
  flows<T extends (...args: unknown[]) => unknown>(fn: T, flowback: T): boolean;
  flowback(file: string): boolean;
  flowback(test: FlowbackTest): void;
}