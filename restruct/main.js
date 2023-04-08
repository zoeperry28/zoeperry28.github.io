import {APICalls} from './api_calls.js'
import { OrderList } from './order.js';
import { Order } from './order.js';

async function main() {
  const api = new APICalls();
  try {
    const distanceAndDuration = await api.Get_Distance("ST74HB", "ME46FS");
    console.log(distanceAndDuration);
  } catch (error) {
    console.error(error);
  }
}

main();