const APICalls = require( './api_calls.js');
const api_calls = new APICalls();

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
    
    constructor(FromShop, Order_List=[])
    {
        this.FromShop = FromShop;
        this.Order_List = Order_List;
        var visited = [];
    }

    Add(OrderNo, ItemString, Tel, Postcode)
    {
        var order = new Order(OrderNo, ItemString, Tel, Postcode);
        this.Order_List.push(order);
    }
    
    PostcodeExists(value) {
        for (var i = 0 ; i < this.Order_List.length; i++)
        {   
            if (this.Order_List[i].Postcode === value)
            {
                return true;
            }
        }
        return false;
    }

    async OptimiseJourney()
    {
        this.Add(-1,-1,-1,this.FromShop);
        var distances = [];
        var unique_postcodes = [];

        for (var x = 0; x < this.Order_List.length; x++)
        {
            if (this.PostcodeExists(this.Order_List[x].Postcode, this.Order_List))
            {
                unique_postcodes.push(this.Order_List[x].Postcode);
            }
        }
        
        for (var i = 0; i < this.Order_List.length; i++)
        {
            for (var j = 0 ; j < this.Order_List.length; j++)
            {
                if (!(this.Order_List[i].Postcode === this.Order_List[j].Postcode))
                {
                    var temp = await api_calls.Get_Distance(this.Order_List[i].Postcode, this.Order_List[j].Postcode);
                    distances.push([this.Order_List[i].Postcode, this.Order_List[j].Postcode, temp]);
                }
            }
        }
        var rf = new RouteFinder();
        var shortest = await rf.ShortestPath(unique_postcodes, distances, this.FromShop);
        console.log(shortest)
        var all_orders = [];
        for (var y = 0 ; y < shortest.length; y++)
        {
            for (var z = 0; z < this.Order_List.length; z++)
            {
                if (this.Order_List[z].Postcode === shortest[y])
                {
                    all_orders.push(this.Order_List[z]);
                    console.log (" - " +this.Order_List[z].Postcode + "===" + shortest[y]);
                }
            }
        }
        console.log(all_orders)
        return all_orders;
    }
}

class RouteFinder {
    RemoveWithStartPoint(NodesAndVertices, StartPoint)
    {
       var res = [];
       for (var i = 0 ; i < NodesAndVertices.length; i++)
       {
            if (NodesAndVertices[i][0] != StartPoint && NodesAndVertices[i][1] != StartPoint)
            {
                res.push(NodesAndVertices[i]);
            }
       }
       return res;
    }

    GetBest(ModNodesAndVertices)
    {
        var shortest = Number.MAX_SAFE_INTEGER;
        var best = [];
        for (var i = 0 ; i < ModNodesAndVertices.length; i++)
        {
            if (ModNodesAndVertices[i][2] < shortest)
            {
                best = ModNodesAndVertices[i];
                shortest = parseFloat(ModNodesAndVertices[i][2]);
            }
        }
        return best;
    }

    FindWithStartPoint(NodesAndVertices, Postcode)
    {
        var Accessible = [];
        for (var item = 0; item < NodesAndVertices.length; item++)
        {
            if (NodesAndVertices[item][0]==Postcode)
            {
                Accessible.push(NodesAndVertices[item]);
            }
        }
        return Accessible;
    }

    ShortestPath(Nodes, NodesAndVertices, StartPoint)
    {
        let route = [];
        route.push(StartPoint);
        let CurrentNode = StartPoint;
        let All = NodesAndVertices;
//

        while (route.length != Nodes.length)
        {
            let out = this.FindWithStartPoint(All, CurrentNode);
            out = this.GetBest(out);
            All = this.RemoveWithStartPoint(All, CurrentNode);
            CurrentNode = out[1];
            route.push(out[1]);
        }
        return route; 
    }
}

module.exports = {
    Order,
    OrderList,
    RouteFinder
  };