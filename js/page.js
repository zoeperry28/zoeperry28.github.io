import { OrderList } from './order.js';
// get the form element
const form = document.querySelector('form');

// create an empty array to hold the orders
let orders = [];

// listen for button click
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#add-order');
    button.addEventListener('click', (event) => {
        // prevent the default form submission behavior
        event.preventDefault();

        // get the form data
        const orderNo = document.querySelector('#inlineFormCustomSelect1').value;
        const postcode = document.querySelector('#inlineFormCustomSelect2').value;
        const orderDetails = document.querySelector('#inlineFormCustomSelect3').value;
        const phoneNumber = document.querySelector('#inlineFormCustomSelect4').value;

        // create an object with the form data
        const order = {
            orderNo: orderNo,
            postcode: postcode,
            orderDetails: orderDetails,
            phoneNumber: phoneNumber
        };

        // add the order object to the orders array
        orders.push(order);

        // reset the form fields 
        document.querySelector('#inlineFormCustomSelect1').value = '';
        document.querySelector('#inlineFormCustomSelect2').value = '';
        document.querySelector('#inlineFormCustomSelect3').value = '';
        document.querySelector('#inlineFormCustomSelect4').value = '';


        // log the orders array to the console
        console.log(orders);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#complete');
    button.addEventListener('click', async (event) => {
        if (orders.length !== 0)
        {
            let order_list = new OrderList("ST65TJ");
            for (var i = 0 ; i < orders.length; i++)
            {
                order_list.Add(orders[i].orderNo, orders[i].orderDetails, orders[i].phoneNumber, orders[i].postcode);
            }
            var res = await order_list.OptimiseJourney();
            console.log(res);

            var out = "[";
            for (var j = 0 ; j < res.length; j++)
            {
                if (j != res.length-1)
                {
                    out = out + res[j].Postcode + ", ";
                }
                else
                {
                    out = out + res[j].Postcode + "]";
                }

            }

            document.getElementById("temp-list").innerHTML = out;
           
        }
        else
        {
            // do nothing
        }
        orders = [];
    });
});