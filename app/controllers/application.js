import Controller from '@ember/controller';
import config from 'humans/config/environment';

export default Controller.extend({
  blockstackName: config.blockstackName
});
