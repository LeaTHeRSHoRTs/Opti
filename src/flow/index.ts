import type { Flow } from '@flow';
import _InternalFlow from './flowclass';
import { initializer } from '../helpers';

export default initializer<Flow>(_InternalFlow, () => {
    globalThis.Opti.flow = true;
});