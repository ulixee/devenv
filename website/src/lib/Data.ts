import Axios from 'axios';
import IMilestones from "@/interfaces/IMilestones";
import IRoadmap from '@/interfaces/IRoadmap';
import generateLinks, { INavGroup } from '../lib/generateLinks';

const axios = Axios.create({
  // crossDomain: true,
  responseType: 'json',
});

export interface IPage {
  content: string;
  title: string;
  subtitles: { value: string, depth: number, anchor: string }[];
}

const repoLinks: { [key: string]: string } = {
  hero: 'https://github.com/ulixee/hero/tree/main/docs/main',
  datastore: 'https://github.com/ulixee/platform/tree/main/datastore/docs',
  cloud: 'https://github.com/ulixee/platform/tree/main/cloud/docs',
}

export default class Data {
  public static async fetchMilestones(): Promise<IMilestones> {
    const response = await Axios.get(`/data/milestones.json`);
    return response.data;
  }

  public static async fetchRoadmap(name: string): Promise<IRoadmap> {
    const response = await Axios.get(`/data/roadmaps/${name}.json`);
    return response.data;
  }

  public static async fetchDocLinks(path: string): Promise<INavGroup[]> {
    const toolKey = extractToolKey(path);
    const repoLink = repoLinks[toolKey];
    const response = await Axios.get(`/data/toc/${toolKey}.json`);
    return generateLinks(response.data, `/documentation/${toolKey}`, repoLink);
  }

  public static async fetchDocPage(path: string): Promise<IPage> {
    const toolKey = extractToolKey(path);
    path = path.replace('/documentation', '/docs');

    if (!path.startsWith('/docs')) {
      path = '/docs' + path;
    }

    if (path === `/docs/${toolKey}`) {
      path += '/index';
    } else if (path.endsWith('/')) {
      path += 'index';
    }
    path += '.json';

    console.log(`/data${path}`);
    const response = await Axios.get(`/data${path}`);
    return response.data;
  }
}

export function extractToolKey(path: string) {
  const matches = path.match(/\/documentation\/([^\/]+)/);
  return matches ? matches[1] : '';
}
