const { Order, OrderList, RouteFinder } = require('./order.js');
//import './location_data.js';
// get the form element
const form = document.querySelector('form');

// create an empty array to hold the orders
let orders = [];
console.log("OK")


function buttonClicked(){
    console.log("completed!");
}

function addToList()
{
    console.log("Added to list!")
}

window.onload=function(){
    const button1 = document.querySelector('#complete');
    button1.addEventListener('click', async (event) => 
    {
        buttonClicked()
    });

    const button2 = document.querySelector('#add-to-list');
    button2.addEventListener('click', async (event) => 
    {
        addToList()
    });

}


console.log("OK haha")