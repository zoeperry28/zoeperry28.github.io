import {APICalls} from './api_calls.js'

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
        var distances = [];
        var unique_postcodes = [];
        for (var i = 0; i < this.Order_List.length; i++)
        {
            if (this.PostcodeExists(this.Order_List[i].Postcode, this.Order_List))
            {
                unique_postcodes.push(this.Order_List[i].Postcode);
            }
            for (var j = - 0 ; j < this.Order_List.length; j++)
            {
                if (!(this.Order_List[i].Postcode === this.Order_List[j].Postcode))
                {
                    console.log (this.Order_List[i].Postcode + ", " +  this.Order_List[j].Postcode)
                    var temp = await api_calls.Get_Distance(this.Order_List[i].Postcode, this.Order_List[j].Postcode);
                    distances.push([this.Order_List[i].Postcode, this.Order_List[j].Postcode, temp]);
                }
            }
        }
        console.log(distances)
        //return rf.ShortestPath(unique_postcodes, distances, unique_postcodes[0]);
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
        var shortest = 99999999999999999999999999999999999999999999999;
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
        console.log(Nodes);
        console.log(NodesAndVertices);
        //let route = [];
        //route.push(StartPoint);
        //let CurrentNode = StartPoint;
        //let All = NodesAndVertices;
//
        //while (route.length !== Nodes.length)
        //{
        //    let out = this.FindWithStartPoint(All, CurrentNode);
        //    out = this.GetBest(out);
        //    All = this.RemoveWithStartPoint(All, CurrentNode);
        //    CurrentNode = out[1];
        //    route.push(out[1]);
        //}
        //console.log(route)
        //return route; 
    }
}

export { Order };
export { OrderList };
export { RouteFinder };