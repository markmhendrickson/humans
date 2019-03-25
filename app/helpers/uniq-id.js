import { helper } from '@ember/component/helper';
import uniqid from 'npm:uniqid';

export function uniqId(params) {
  return uniqid();
}

export default helper(uniqId);
