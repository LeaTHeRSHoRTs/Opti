import './requests.d.ts';

declare global {
    var request: RequestFunction;
}

export const Request: Request;