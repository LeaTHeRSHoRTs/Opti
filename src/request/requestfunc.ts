const _request: RequestFunction = <T = unknown>(typeOrUrl: RequestType | string, urlOrData: string | unknown, dataOrOptions: unknown | RequestInit, options?: RequestInit): Promise<T> => {
    throw new NotImplementedError();
};

_request.post = <T = unknown>(url: string, data: unknown, options: RequestOptions): Promise<T> => {
    throw new NotImplementedError();
};
_request.get = <T = unknown>(url: string, data: unknown, options: RequestOptions): Promise<T> => {
    throw new NotImplementedError();
};
_request.json = <T extends {} = {}>(type: RequestType, url: string, data: unknown, options: RequestInit): Promise<T> => {
    throw new NotImplementedError();
};
_request.xml = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<XMLDocument> => {
    throw new NotImplementedError();
};
_request.css = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<CSSStyleSheet> => {
    throw new NotImplementedError();
};
_request.text = (type: RequestType, url: string, data: unknown, options: RequestOptions): Promise<string> => {
    throw new NotImplementedError();
};
_request.of = <T extends object>(datatype: T | RequestOptions, method?: RequestType, url?: string, data?: unknown, options?: RequestOptions): Promise<Unboxed<T>> => {
    throw new NotImplementedError();
};

export const request = _request satisfies RequestFunction;