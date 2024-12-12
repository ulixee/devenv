import { IBounds } from '@ulixee/desktop-interfaces/IBounds';
interface IBoundsAndScale extends IBounds {
    scale: number;
}
export default class Workarea {
    static workarea: IBoundsAndScale;
    static getMaxChromeBounds(): IBoundsAndScale | null;
    static setHeroDefaultScreen(workarea: IBoundsAndScale): void;
}
export {};
