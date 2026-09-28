type RequestType = "GET" | "POST";


interface RequestOptions {

}

interface RequestFunction {
  <T = unknown>(url: string, data: unknown, options: RequestOptions): Promise<T>;
  <T = unknown>(type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<T>;
  post: <T = unknown>(url: string, data: unknown, options: RequestOptions) => Promise<T>;
  get: <T = unknown>(url: string, data: unknown, options: RequestOptions) => Promise<T>;
  json: <T extends {} = {}>(type: RequestType, url: string, data: unknown, options: RequestOptions) => Promise<T>;
  xml: (type: RequestType, url: string, data: unknown, options: RequestOptions) => Promise<XMLDocument>;
  css: (type: RequestType, url: string, data: unknown, options: RequestOptions) => Promise<CSSStyleSheet>;
  text: (type: RequestType, url: string, data: unknown, options: RequestOptions) => Promise<string>;
  of: 
    (<T extends Object>(datatype: T, method: RequestType, url: string, data: unknown, options: RequestOptions) => Promise<Unboxed<T>>) |
    (<T = unknown>(options: RequestOptions) => Promise<T>);
}