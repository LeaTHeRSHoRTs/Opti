import "@request";
import * as Impl from "./requestfunc";
import { initializer } from "../helpers";

export default initializer<placeholder>({}, () => {
    globalThis.request = Impl.request;
});