/// <reference path="./query.d.ts" />
/// <reference path="./classes.d.ts" />
/// <reference path="./exceptions.d.ts" />

declare namespace Query {}

interface Query {
  MalformedQueryException: Query.MalformedQueryExceptionConstructor;
  UnsupportedSelectorException: Query.UnsupportedSelectorExceptionConstructor;
}

declare var Query: Query;
declare var $: Query.$;
declare var $$: Query.$$;