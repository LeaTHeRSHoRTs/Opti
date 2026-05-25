const _request: RequestFunction = <T = unknown>(typeOrUrl: RequestType | string, urlOrData: string | unknown, dataOrOptions: unknown | RequestInit, options?: RequestInit): Promise<T> => {
  throw new globalThis.NotImplementedException();
};

_request.post = <T = unknown>(url: string, data: unknown, options: RequestOptions): Promise<T> => {
  throw new globalThis.NotImplementedException();
};
_request.get = <T = unknown>(url: string, data: unknown, options: RequestOptions): Promise<T> => {
  throw new globalThis.NotImplementedException();
};
_request.json = <T extends {} = {}>(type: RequestType, url: string, data: unknown, options: RequestInit): Promise<T> => {
  throw new globalThis.NotImplementedException();
};
_request.xml = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<XMLDocument> => {
  throw new globalThis.NotImplementedException();
};
_request.css = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<CSSStyleSheet> => {
  throw new globalThis.NotImplementedException();
};
_request.text = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<string> => {
  throw new globalThis.NotImplementedException();
};
_request.of = <T extends object>(datatype: T | RequestOptions, method?: RequestType, url?: string, data?: unknown, options?: RequestOptions): Promise<Unboxed<T>> => {
  throw new globalThis.NotImplementedException();
};

export const request = _request satisfies RequestFunction;