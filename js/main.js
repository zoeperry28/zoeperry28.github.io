import {APICalls} from './api_calls.js'
import { OrderList } from './order.js';
import { Order } from './order.js';

async function main() {
  var result;
  const api = new APICalls();
  const orderlist = new OrderList("ST65TJ");
  orderlist.Add("123", "sofa", "012345678910", "ST65TJ");
  orderlist.Add("124", "sofa", "012345678910", "CW26HR");
  orderlist.Add("126", "sofa", "012345678910", "ST74HB");
  orderlist.Add("125", "sofa", "012345678910", "CW56PH");
  try {
    result = orderlist.OptimiseJourney();
  } catch (error) {
    console.error(error);
  }
}

main();