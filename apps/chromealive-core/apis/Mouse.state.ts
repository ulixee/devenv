import { IMouseStateArgs } from '@ulixee/apps-chromealive-interfaces/apis/IMouseStateApi';
import AliveBarPositioner from '../lib/AliveBarPositioner';

export default function mouseStateApi(args: IMouseStateArgs): void {
  AliveBarPositioner.setMouseDown(args.isMousedown);
}
