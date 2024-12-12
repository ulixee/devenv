// NOTE: you must start your own Ulixee Server to run this example.
import * as HeroPlugin from  '@ulixee/datastore-plugins-hero';
import { Extractor, HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';

export default new Extractor(datastore => {
  console.log('INPUT: ', datastore.input);
}, HeroExtractorPlugin);
