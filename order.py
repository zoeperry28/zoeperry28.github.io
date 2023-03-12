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
        print(url)
        res = requests.get(self.OSM_Location_Request(Postcode))
        LatLong = res.json()
        return [LatLong[0]['lat'], LatLong[0]['lon']]

    def Get_DistanceAndDuration(self, Postcode1, Postcode2):
        P1_LL = self.Get_LatLong(Postcode1);
        P2_LL = self.Get_LatLong(Postcode2);
        print(P1_LL)
        print(P2_LL)
        res = requests.get(self.OpenRouteService_DirectionsDistance(P1_LL, P2_LL))
        dir = res.json()
        dist = dir['features'][0]['properties']['segments'][0]['distance']
        dura = dir['features'][0]['properties']['segments'][0]['duration']
        return [dist,dura]

class Dijkstra:
    def ShortestPath(Nodes, NodesAndVerticies, StartPoint):
        final = []
        route = []
        sp = []
        current_postcode = StartPoint
        shortest = 99999999999999999999999
        shortest_item = 0

        for i in range(1, len(Nodes)):
            sp = []
            for path in NodesAndVerticies:
                print (path[0] + "==" + current_postcode + "?")
                if (path[0] == current_postcode):
                    sp.append(path)

            for item in sp: 
                if (item[2] < shortest) :
                    shortest_item = item
                    shortest = item[2]
                    final.append(item)
                    current_postcode = item[1]
                    

        print(final)
            
               
               

            
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
                print(item)
                unique_postcodes.append(item.OrderNo)
            for other_item in self.OrderList:
                if (item.Postcode != other_item.Postcode):
                    temp = self.m.Get_DistanceAndDuration(item.Postcode, other_item.Postcode)[0]
                    distances.append([item.Postcode,other_item.Postcode,temp])
                else:
                    pass
        return Dijkstra.ShortestPath(unique_postcodes, distances, self.FromShop);