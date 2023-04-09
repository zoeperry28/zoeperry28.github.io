class location:
    def __init__(self, Postcode, Northings, Eastings):
        self.Postcode = Postcode;
        self.Northings = Northings; 
        self.Eastings = Eastings;

class area:
    def __init__(self, Postcode_Area):
        self.Postcode_Area = Postcode_Area;
        self.locs = [];
        
    def Add(self, Postcode, Northings, Eastings, Latitude, Longitude):
        self.locs.append(location(Postcode, Northings, Eastings))

