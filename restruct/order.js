function IsInArray(value, array) {
    return array.indexOf(value) > -1;
}

class Order {
    constructor(OrderNo, ItemString, Tel, Postcode)
    {
        this.OrderNo = OrderNo ;
        this.ItemString = ItemString ;
        this.Tel = Tel;
        this.Postcode = Postcode;
        var LatLong = [];
        var ShortestPath = "";
    }
}

class OrderList {
    constructor(FromShop, OrderList)
    {
        this.FromShop = FromShop;
        this.OrderList = OrderList;
        var visited = [];
    }

    Add(OrderNo, ItemString, Tel, Postcode)
    {
        var order = new Order(OrderNo, ItemString, Tel, Postcode);
        OrderList.push(order);
    }

    OptimiseJourney()
    {
        var distances = [];
        var unique_postcodes = [];
        for (var i = 0; i < OrderList.length(); i++)
        {
            if (IsInArray(Postcode, unique_postcodes))
            {
                unique_postcodes.push(OrderList[i].Postcode);
            }
            
        }
    }
}

export { Order };
export { OrderList };