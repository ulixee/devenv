import IChromeAliveApi from './IChromeAliveApi';

export default interface ISessionUrlScreenshotApi extends IChromeAliveApi {
  args: ISessionUrlScreenshotArgs;
  result: ISessionUrlScreenshotResult;
}

export interface ISessionUrlScreenshotArgs {
  sessionId: string;
  navigationId: number;
}

export interface ISessionUrlScreenshotResult {
  imageBase64: string;
}
