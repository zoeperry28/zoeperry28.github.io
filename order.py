import sys
import requests 
import json

class Helper: 
    def Meter2Mile(Meter):
        return Meter / 1609
class Order:
    def __init__(self, OrderNo, ItemString, Tel, Postcode):
        self.OrderNo = OrderNo 
        self.ItemString = ItemString 
        self.Tel = Tel
        self.Postcode = Postcode
        self.LatLong = []
        self.ShortestPath = ""

class APICalls:
    APIKey = ""
    def __init__(self):
        f = open('validation.json')
        data = json.load(f)
        self.APIKey = data["keys"]["OpenRouteService"]
        
    def OpenRouteService_DirectionsDistance(self, LatLong1, LatLong2):
        url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + self.APIKey + "&start="+LatLong1[1]+","+LatLong1[0]+"&end="+LatLong2[1]+","+LatLong2[0]

        return url

    def OSM_Location_Request(self, Postcode):
        return "https://nominatim.openstreetmap.org/search?q=" + Postcode + "&format=json&polygon=1&addressdetails=1"

    def Get_LatLong(self, Postcode):
        url = self.OSM_Location_Request(Postcode)
        res = requests.get(self.OSM_Location_Request(Postcode))
        LatLong = res.json()
        return [LatLong[0]['lat'], LatLong[0]['lon']]

    def Get_DistanceAndDuration(self, Postcode1, Postcode2):
        P1_LL = self.Get_LatLong(Postcode1);
        P2_LL = self.Get_LatLong(Postcode2);
        res = requests.get(self.OpenRouteService_DirectionsDistance(P1_LL, P2_LL))
        dir = res.json()
        dist = dir['features'][0]['properties']['segments'][0]['distance']
        dura = dir['features'][0]['properties']['segments'][0]['duration']
        return [dist,dura]

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

class OrderList:
    visited = []
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