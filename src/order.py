from api_calls import *

class Helper: 
    def Meter2Mile(Meter):
        return Meter / 1609


class Shop: 
    def __init__(self, Shop_Name, Postcode):
        self.Shop_Name = Shop_Name
        self.Postcode = Postcode

class Shops: 
    All = []
    TUN1 = Shop("TUN1", "ST75XX")
    TUN2 = Shop("TUN2", "ST34EE")
    All = [TUN1, TUN2]

class Order:
    def __init__(self, OrderNo, ItemString, Tel, Postcode):
        self.OrderNo = OrderNo 
        self.ItemString = ItemString 
        self.Tel = Tel
        self.Postcode = Postcode
        LatLong = []
        ShortestPath = ""

class OrderList:
    m = APICalls()
    def __init__(self, FromShop, OrderList=[]):
        self.FromShop = FromShop
        self.OrderList = OrderList
        
    def AddToList(self, OrderNo, ItemString, Tel, Postcode):
        order = Order(OrderNo, ItemString, Tel, Postcode)
        res = self.m.Get_LatLong(order.Postcode)
        order.LatLong = res
        self.OrderList.append(order)

    def IsAccessed(self, Postcode, Visited):
        if (Postcode in Visited):
            return True
        else:
            return False

    def OptimiseJourney(self):
        distances = []
        unique_postcodes = []
        for item in self.OrderList:
            if item.Postcode not in unique_postcodes:
                unique_postcodes.append(item.Postcode)
            for other_item in self.OrderList:
                if (item.Postcode != other_item.Postcode):
                    temp = self.m.Get_DistanceAndDuration(item.Postcode, other_item.Postcode)[0]
                    distances.append([item.Postcode,other_item.Postcode,temp])
        rf = RouteFinder();
        return rf.ShortestPath(unique_postcodes, distances, unique_postcodes[0]);

class RouteFinder:
    def RemoveWithStartPoint(self, NodesAndVertices, StartPoint):
        res = []
        for item in NodesAndVertices: 
            if (item[0] != StartPoint and item[1] != StartPoint):
                res.append(item)
        return res; 

    def GetBest(self, ModNodesAndVertices):
        shortest = 999999999999999999999999999999999;
        best = []
        for item in ModNodesAndVertices:
            if (item[2] < shortest):
                best = item;
                shortest = float(item[2])
        return best
            
    def FindWithStartPoint(self, NodesAndVertices, Postcode):
        Accessible = []
        for item in NodesAndVertices:
            if (item[0] == Postcode):
                Accessible.append(item)
            else:
                pass
        return Accessible

    def ShortestPath(self, Nodes, NodesAndVerticies, StartPoint):
        route = []
        route.append(StartPoint)
        CurrentNode = StartPoint
        All = NodesAndVerticies;
        
        while(len(route) != len(Nodes)):
            # Get all of the accessible nodes
            out = self.FindWithStartPoint(All, CurrentNode)
            out = self.GetBest(out);
            All = self.RemoveWithStartPoint(All, CurrentNode)
            CurrentNode = out[1]
            route.append(out[1])
        print(route)
        return route

