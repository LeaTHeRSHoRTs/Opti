import * as Storage from "./storefuncs";

(() => {
  globalThis.SELECT = Symbol("SELECT");
  globalThis.INSERT = Symbol("INSERT");
  globalThis.UPDATE = Symbol("UPDATE");
  globalThis.DELETE = Symbol("DELETE");
  globalThis.INTO = Symbol("INTO");
  globalThis.FROM = Symbol("FROM");
  globalThis.GROUP_BY = Symbol("GROUP_BY");
  globalThis.ORDER_BY = Symbol("ORDER_BY");
  globalThis.LIMIT = Symbol("LIMIT");
  globalThis.OFFSET = Symbol("OFFSET");
  globalThis.WHERE = Symbol("WHERE");
  globalThis.VALUES = Symbol("VALUES");
  globalThis.INTO = Symbol("INTO");
  globalThis.SET = Symbol("SET");
})();