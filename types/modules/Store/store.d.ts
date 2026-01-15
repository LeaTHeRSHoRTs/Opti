type ResultSet<T extends string[], U extends T[number] = T[number]> = {
  results: placeholder,
  ok: true,
} | {
  error: placeholder,
  ok: false,
}

type SELECT = typeof globalThis.SELECT;
type INSERT = typeof globalThis.INSERT;
type UPDATE = typeof globalThis.UPDATE;
type DELETE = typeof globalThis.DELETE;
type FROM = typeof globalThis.FROM;
type GROUP_BY = typeof globalThis.GROUP_BY;
type ORDER_BY = typeof globalThis.ORDER_BY;
type LIMIT = typeof globalThis.LIMIT;
type OFFSET = typeof globalThis.OFFSET;
type WHERE = typeof globalThis.WHERE;
type VALUES = typeof globalThis.VALUES;
type INTO = typeof globalThis.INTO;
type SET = typeof globalThis.SET;

type AND = typeof globalThis.AND;
type OR = typeof globalThis.OR;
type NOT = typeof globalThis.NOT;