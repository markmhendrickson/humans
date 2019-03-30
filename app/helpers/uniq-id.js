import { helper } from '@ember/component/helper';
import uniqid from 'uniqid';

export function uniqId(params) {
  return uniqid();
}

export default helper(uniqId);
