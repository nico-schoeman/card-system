import DataStore from '@nico-schoeman/data-store';
import { setupCardState } from './card.store';

const store = new DataStore();
let setup = async () => {
  await store.init();
  setupCardState();
  console.log(store);
}
setup();

export { store };
window.store = store;