var APIKey = "5b3ce3597851110001cf62485a4bf8c2a5b64dd0bdaf5919a644b628";
class APICalls {

    ORS_DirectionsDistance(LatLong1, LatLong2)
    {
        console.log(LatLong1)
        console.log(LatLong2)
        return "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIKey + 
              "&start="+LatLong1[1]+","+LatLong1[0]+"&end="+LatLong2[1]+","+LatLong2[0];
    }

    OSM_LocationRequest(Postcode)
    {
        return "https://nominatim.openstreetmap.org/search?q=" + Postcode + "&format=json&polygon=1&addressdetails=1"; 
    }

    async Get_LatLong(Postcode) 
    {
        var LatLong = new Array(2);
        var res;
        var url = this.OSM_LocationRequest(Postcode);
        try 
        {
          const response = await fetch(url);
          const dat = await response.json();
          console.log(dat);
          LatLong[0] = dat[0]["lat"];
          LatLong[1] = dat[0]["lon"];
        } 
        catch (error) 
        {
          console.error(error);
        }
        return LatLong;
      }
      

    async Get_DistanceAndDuration(Postcode1, Postcode2) 
    {
      try 
      {
        var P1_LL = await this.Get_LatLong(Postcode1);
        var P2_LL = await this.Get_LatLong(Postcode2);
        console.log(P1_LL);
        console.log(P2_LL);
        return [P1_LL, P2_LL];
      } 
      catch (error) 
      {
        console.error(error);
      }
    }

    async Get_Distance(Postcode1, Postcode2)
    {
        var dist = 0;
        var LatLongs = await this.Get_DistanceAndDuration(Postcode1, Postcode2);
        var url =      await this.ORS_DirectionsDistance(LatLongs[0], LatLongs[1]);
        
        console.log(url)

        try 
        {
          const response = await fetch(url);
          const dat = await response.json();
          dist = dat['features'][0]['properties']['segments'][0]['distance'];
        } 
        catch (error) 
        {
          dist = console.error(error);
        }
        return dist;
    }
}

module.exports = {
  APICalls
};