import Path from 'path';
import Url from 'url';
import { ensureIndexFile, saveToWebsite, walkDirectory } from './lib/DocsUtils.mjs';

const __dirname = Path.dirname(Url.fileURLToPath(import.meta.url));
const rootDir = Path.resolve(__dirname, '../../');

// const basePath = `${rootDir}/hero/docs`;
// await saveToWebsite(basePath, `${basePath}/main/Overview/Configuration.md`, 'hero');

{
  const mdDocsRootPath = `${rootDir}/client/docs`;
  await walkDirectory(mdDocsRootPath, async filePath => {
    await saveToWebsite(mdDocsRootPath, filePath, 'client');
  });
  ensureIndexFile(mdDocsRootPath, 'client');
}

{
  const mdDocsRootPath = `${rootDir}/../hero/docs`;
  await walkDirectory(mdDocsRootPath, async filePath => {
    await saveToWebsite(mdDocsRootPath, filePath, 'hero');
  });
  ensureIndexFile(mdDocsRootPath, 'hero');
}

{
  const mdDocsRootPath = `${rootDir}/datastore/docs`;
  await walkDirectory(mdDocsRootPath, async filePath => {
    await saveToWebsite(mdDocsRootPath, filePath, 'datastore');
  });
  ensureIndexFile(mdDocsRootPath, 'datastore');
}

{
  const mdDocsRootPath = `${rootDir}/sql/docs`;
  await walkDirectory(mdDocsRootPath, async filePath => {
    await saveToWebsite(mdDocsRootPath, filePath, 'sql');
  });
  ensureIndexFile(mdDocsRootPath, 'sql');
}

{
  const mdDocsRootPath = `${rootDir}/cloud/docs`;
  await walkDirectory(mdDocsRootPath, async filePath => {
    await saveToWebsite(mdDocsRootPath, filePath, 'cloud');
  });
  ensureIndexFile(mdDocsRootPath, 'cloud');
}
