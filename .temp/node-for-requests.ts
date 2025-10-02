namespace Opti.Requests {
  const _request: RequestFunction = <T = any>(typeOrUrl: RequestType | string, urlOrData: string | any, dataOrOptions: any | RequestInit, options?: RequestInit): Promise<T> => {
    throw new globalThis.NotImplementedException();
  };

  _request.post = <T = any>(url: string, data: any, options: RequestOptions): Promise<T> => {
    throw new globalThis.NotImplementedException();
  };
  _request.get = <T = any>(url: string, data: any, options: RequestOptions): Promise<T> => {
    throw new globalThis.NotImplementedException();
  };
  _request.json = <T extends {} = {}>(type: RequestType, url: string, data: any, options: RequestInit): Promise<T> => {
    throw new globalThis.NotImplementedException();
  };
  _request.xml = (type: RequestType, url: string, data: any, options: RequestOptions): Promise<XMLDocument> => {
    throw new globalThis.NotImplementedException();
  };
  _request.css = (type: RequestType, url: string, data: any, options: RequestOptions): Promise<CSSStyleSheet> => {
    throw new globalThis.NotImplementedException();
  };
  _request.text = (type: RequestType, url: string, data: any, options: RequestOptions): Promise<string> => {
    throw new globalThis.NotImplementedException();
  };
  _request.of = <T extends Object>(datatype: T | RequestOptions, method?: RequestType, url?: string, data?: any, options?: RequestOptions): Promise<Unboxed<T>> => {
    throw new globalThis.NotImplementedException();
  };

  export const request = _request satisfies RequestFunction;
}
(function() {
  globalThis.request = Opti.Requests.request;
})();
