import ISessionCreateOptions from '@ulixee/hero-interfaces/ISessionCreateOptions';
import { fork } from 'child_process';
import {
  ISessionResumeArgs,
  ISessionResumeResult,
} from '@ulixee/apps-chromealive-interfaces/apis/ISessionResumeApi';
import Debug from 'debug';
import ChromeAliveCore from '../index';

const debug = Debug('ulixee:chromealive');

export default function sessionResumeApi(args: ISessionResumeArgs): ISessionResumeResult {
  const sessionId = args.heroSessionId ?? ChromeAliveCore.activeHeroSessionId;
  if (!sessionId || !ChromeAliveCore.sessionObserversById.has(sessionId))
    throw new Error('No active sessionId found');

  const observer = ChromeAliveCore.sessionObserversById.get(sessionId);
  const { heroSession } = observer;

  let startUrl = '';

  let startLocation: ISessionCreateOptions['sessionResume']['startLocation'] = 'currentLocation';
  if (args.startFromUrlIndex !== undefined) {
    if (args.startFromUrlIndex <= 0) {
      startLocation = 'sessionStart';
    } else if (args.startFromUrlIndex < observer.loadedUrls.length - 1) {
      startUrl = observer.loadedUrls[args.startFromUrlIndex].url;

      startLocation = 'pageStart';
    }
  }

  const script = heroSession.options.scriptInstanceMeta?.entrypoint;
  const execArgv = [
    `--sessionResume.startLocation`,
    startLocation,
    `--sessionResume.sessionId`,
    heroSession.id,
  ];
  if (startUrl) {
    execArgv.push(`--sessionResume.startUrl`, startUrl);
  }
  if (script.endsWith('.ts')) {
    execArgv.push('-r', 'ts-node/register');
  }
  let success = true;
  let error: Error;
  try {
    debug('Resuming session', execArgv);
    fork(script, execArgv, {
      // execArgv,
      stdio: 'inherit',
      env: { ...process.env, HERO_CLI_NOPROMPT: 'true' },
    });
  } catch (err) {
    console.error('ERROR resuming session', err);
    success = false;
    error = err;
  }

  return {
    success,
    error,
  };
}
