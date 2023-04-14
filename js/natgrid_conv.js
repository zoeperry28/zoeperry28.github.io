class NatGrid2LatLong {

    Marc(bf0, n, PHI0, PHI)
    {
        let Marc = bf0 * (((1 + n + ((5 / 4) * (n ** 2)) + ((5 / 4) * (n ** 3))) * 
                     (PHI - PHI0)) - (((3 * n) + (3 * (n ** 2)) + ((21 / 8) * 
                     (n ** 3))) * (Math.sin(PHI - PHI0)) * (Math.cos(PHI + PHI0))) + 
                     ((((15 / 8) * (n ** 2)) + ((15 / 8) * (n ** 3))) * 
                     (Math.sin(2 * (PHI - PHI0))) * (Math.cos(2 * (PHI + PHI0)))) - 
                     (((35 / 24) * (n ** 3)) * (Math.sin(3 * (PHI - PHI0))) * 
                     (Math.cos(3 * (PHI + PHI0)))));
        return Marc;
    }
    
    InitialLat(North, n0, afo, PHI0, n, bfo)
    {
        var PHI1 = ((North - n0) / afo) + PHI0
        
        var M = this.Marc(bfo, n, PHI0, PHI1)
        var PHI2 = ((North - n0 - M) / afo) + PHI1
        
        while((North - n0 - M) > 0.00001)
        {
            PHI2 = ((North - n0 - M) / afo) + PHI1
            M = this.Marc(bfo, n, PHI0, PHI2)
            PHI1 = PHI2
        }

        var InitialLat = PHI2
        return InitialLat
    }
    
    GetLatFromEastAndNorth(East, North, a, b, e0, n0, f0, PHI0, LAM0)
    {
        var RadPHI0 = PHI0 * (Math.PI / 180)
        var RadLAM0 = LAM0 * (Math.PI / 180)

        var af0 = a * f0
        var bf0 = b * f0
        var e2 = ((af0 ** 2) - (bf0 ** 2)) / (af0 ** 2)
        var n = (af0 - bf0) / (af0 + bf0)
        var Et = East - e0

        var PHId = this.InitialLat(North, n0, af0, RadPHI0, n, bf0)

        var nu = af0 / (Math.sqrt(1 - (e2 * ((Math.sin(PHId)) ** 2))))
        var rho = (nu * (1 - e2)) / (1 - (e2 * (Math.sin(PHId)) ** 2))
        var eta2 = (nu / rho) - 1

        var VII = (Math.tan(PHId)) / (2 * rho * nu)
        var VIII = ((Math.tan(PHId)) / (24 * rho * (nu ** 3))) * (5 + (3 * ((Math.tan(PHId)) ** 2)) + 
               eta2 - (9 * eta2 * ((Math.tan(PHId)) ** 2)))
               var IX = ((Math.tan(PHId)) / (720 * rho * (nu ** 5))) * (61 + (90 * ((Math.tan(PHId)) ** 2)) + 
             (45 * ((Math.tan(PHId)) ** 4)))

        return (180 / Math.PI) * (PHId - ((Et ** 2) * VII) + ((Et ** 4) * VIII) - ((Et ** 6) * IX))

    }

    GetLongFromEastAndNorth(East, North, a, b, e0, n0, f0, PHI0, LAM0)
    {
        var RadPHI0 = PHI0 * (Math.PI / 180)
        var RadLAM0 = LAM0 * (Math.PI / 180)

        var af0 = a * f0
        var bf0 = b * f0
        var e2 = ((af0 ** 2) - (bf0 ** 2)) / (af0 ** 2)
        var n = (af0 - bf0) / (af0 + bf0)
        var Et = East - e0

        var PHId = this.InitialLat(North, n0, af0, RadPHI0, n, bf0)
        
        var nu = af0 / (Math.sqrt(1 - (e2 * ((Math.sin(PHId)) ** 2))))
        var rho = (nu * (1 - e2)) / (1 - (e2 * (Math.sin(PHId)) ** 2))
        var eta2 = (nu / rho) - 1
        
        var X =    ((Math.cos(PHId)) ** -1) / nu
        var XI =  (((Math.cos(PHId)) ** -1) / (6 * (nu ** 3))) * ((nu / rho) + (2 * ((Math.tan(PHId)) ** 2)))
        var XII = (((Math.cos(PHId)) ** -1) / (120 * (nu ** 5))) * (5 + (28 *    ((Math.tan(PHId)) ** 2)) + 
              (24 * ((Math.tan(PHId)) ** 4)))
        var XIIA =(((Math.cos(PHId)) ** -1) / (5040 * (nu ** 7))) * (61 + (662 * ((Math.tan(PHId)) ** 2)) + 
              (1320 * ((Math.tan(PHId)) ** 4)) + (720 * ((Math.tan(PHId)) ** 6)))

        return (180 / Math.PI) * (RadLAM0 + (Et * X) - ((Et ** 3) * XI) + ((Et ** 5) * XII) - ((Et ** 7) * XIIA))
    }

    E_N_To_LatLong(Easting, Northing)
    {
        let res = []

        let a = 6377563.396;
        let b = 6356256.909;
        let e0 = 400000;
        let n0 = -100000;
        let f0 = 0.9996012717;
        let PHI0 = 49;
        let LAM0 = -2;

        res.push(this.GetLatFromEastAndNorth (parseFloat(Easting), parseFloat(Northing), a, b, e0, n0, f0, PHI0, LAM0))
        res.push(this.GetLongFromEastAndNorth(parseFloat(Easting), parseFloat(Northing), a, b, e0, n0, f0, PHI0, LAM0))
        return res;
    }
}

class DistanceHelper {
    LatLong_Distance(lat1, lat2)
    {
        let result  = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371;
        return result;
    }
}

export { NatGrid2LatLong };