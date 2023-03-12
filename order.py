import requests 
import json

class Order:
    def __init__(self, OrderNo, ItemString, Tel, Postcode):
        self.OrderNo = OrderNo 
        self.ItemString = ItemString 
        self.Tel = Tel
        self.Postcode = Postcode

class OrderList:
    def __init__(self, OrderList):
        self.OrderList = OrderList
    
    def AddToList(self, Order):
        self.OrderList.append(Order)

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








