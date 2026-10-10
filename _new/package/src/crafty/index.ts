import '@crafty';
import * as Impl from './class';
import { initializer } from '../helpers';

export default initializer<Crafty>(Impl._InternalCrafty, () => {
    globalThis.Opti.crafty = true;
});