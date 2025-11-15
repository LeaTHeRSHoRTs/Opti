/* eslint-disable no-var */

declare var SELECT: unique symbol;
declare var INSERT: unique symbol;
declare var UPDATE: unique symbol;
declare var DELETE: unique symbol;

declare var FROM: unique symbol;
declare var GROUP_BY: unique symbol;
declare var ORDER_BY: unique symbol;
declare var LIMIT: unique symbol;
declare var OFFSET: unique symbol;
declare var WHERE: unique symbol;
declare var VALUES: unique symbol;
declare var INTO: unique symbol;
declare var SET: unique symbol;

declare var AND: unique symbol;
declare var OR: unique symbol;
declare var NOT: unique symbol;

declare function COUNT(column: "*" | string)
declare function MAX(val: number | string, other: number | string)
declare function MIN(val: number | string, other: number | string)
declare function AVG(val: number | string, other: number | string)
declare function COALESCE(val1: string, val2: string, fallback: string)

declare var DBQueryException: SubExceptionConstructor;
declare var DB: Database;

interface Database {
  query: DBQuery
}

interface DBQuery {
  <
    Cols extends [string, ...string[]],
    WherePart extends [] | [where: WHERE, ...conds: [string | NOT, (string | AND | OR)?][]],
    GroupPart extends [] | [groupBy: GROUP_BY, ...cols: [string, ...string[]]],
    OrderPart extends [] | [orderBy: ORDER_BY, ...cols: [string, ...string[]]],
    LimitPart extends [] | [limit: LIMIT, value: number],
    OffsetPart extends [] | [offset: OFFSET, value: number]
  >(
    select: SELECT,
    ...args: [...Cols, from: FROM, table: string, ...WherePart, ...GroupPart, ...OrderPart, ...LimitPart, ...OffsetPart]
  ): ResultSet<Cols>;

  (
    insert: INSERT,
    into: INTO,
    column: string,
    values: VALUES,
    value: string
  ): void

  <T extends [string, string, ...string]>(
    insert: INSERT,
    into: INTO,
    columns: T,
    values: VALUES,
    values: T
  ): void
}