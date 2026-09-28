/// <reference path="flow.d.ts" />

interface Flow {
  /**
   * Checks whether a value is unusable
   * @opti
   * @param val The value to check
   */
  flows(val: unknown): boolean;

  /**
   * Returns a value that is either the original value or a fallback if the original value is unusable
   * @opti
   * @param val The value to check
   * @param flowback The fallback to use if the check fails
   */
  always<T>(val: T, flowback: NonNullable<T>): [T, boolean];

  /** 
   * Checkers for global properties. Use when you want to check or polyfill global properties 
   * @opti
   */
  globals: {
    /**
     * Checks whether a global property is unusable
     * @opti
     * @param val The global property to check
     */
    flows(key: keyof GlobalThis): boolean,

    /**
     * Mutates the global property identified by `key` in `globalThis` if the original value is unusable
     * @opti
     * @param val The global property to check
     * @param flowback The fallback to use if the check fails
     */
    always<K extends keyof GlobalThis>(key: K, flowback: NonNullable<GlobalThis[K]>): boolean
  };
}

declare var Flow: Flow;