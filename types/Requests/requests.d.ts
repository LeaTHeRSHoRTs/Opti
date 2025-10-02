type RequestType = "GET" | "POST";


interface RequestOptions {

}

interface RequestFunction {
  <T = any>(url: string, data: any, options: RequestOptions): Promise<T>
  <T = any>(type: RequestType, url: string, data: any, options: RequestOptions): Promise<T>;
  post: <T = any>(url: string, data: any, options: RequestOptions) => Promise<T>,
  get: <T = any>(url: string, data: any, options: RequestOptions) => Promise<T>,
  json: <T extends {} = {}>(type: RequestType, url: string, data: any, options: RequestOptions) => Promise<T>,
  xml: (type: RequestType, url: string, data: any, options: RequestOptions) => Promise<XMLDocument>,
  css: (type: RequestType, url: string, data: any, options: RequestOptions) => Promise<CSSStyleSheet>,
  text: (type: RequestType, url: string, data: any, options: RequestOptions) => Promise<string>,
  of: <T extends Object>(datatype: T, method: RequestType, url: string, data: any, options: RequestOptions) => Promise<Unboxed<T>>
  of: <T = any>(options: RequestOptions) => Promise<T>
}

interface OptiObject {
  requests: true,
};