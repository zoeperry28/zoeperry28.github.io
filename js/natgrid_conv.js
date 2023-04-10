class NatGrid2LatLong {

    Marc(bf0, n, PHI0, PHI)
    {
        let Marc = bf0 * (((1 + n + ((5 / 4) * (n ** 2)) + ((5 / 4) * (n ** 3))) * 
                     (PHI - PHI0)) - (((3 * n) + (3 * (n ** 2)) + ((21 / 8) * 
                     (n ** 3))) * (math.sin(PHI - PHI0)) * (math.cos(PHI + PHI0))) + 
                     ((((15 / 8) * (n ** 2)) + ((15 / 8) * (n ** 3))) * 
                     (math.sin(2 * (PHI - PHI0))) * (math.cos(2 * (PHI + PHI0)))) - 
                     (((35 / 24) * (n ** 3)) * (math.sin(3 * (PHI - PHI0))) * 
                     (math.cos(3 * (PHI + PHI0)))));
        return Marc;
    }
    
    InitialLat(North, n0, afo, PHI0, n, bfo)
    {
        PHI1 = ((North - n0) / afo) + PHI0
        
        M = self.Marc(bfo, n, PHI0, PHI1)
        PHI2 = ((North - n0 - M) / afo) + PHI1
        
        while((North - n0 - M) > 0.00001)
        {
            PHI2 = ((North - n0 - M) / afo) + PHI1
            M = self.Marc(bfo, n, PHI0, PHI2)
            PHI1 = PHI2
        }

        InitialLat = PHI2
        return InitialLat
    }
    
    GetLatFromEastAndNorth(East, North, a, b, e0, n0, f0, PHI0, LAM0)
    {
        RadPHI0 = PHI0 * (math.pi / 180)
        RadLAM0 = LAM0 * (math.pi / 180)

        af0 = a * f0
        bf0 = b * f0
        e2 = ((af0 ** 2) - (bf0 ** 2)) / (af0 ** 2)
        n = (af0 - bf0) / (af0 + bf0)
        Et = East - e0

        PHId = self.InitialLat(North, n0, af0, RadPHI0, n, bf0)

        nu = af0 / (math.sqrt(1 - (e2 * ((math.sin(PHId)) ** 2))))
        rho = (nu * (1 - e2)) / (1 - (e2 * (math.sin(PHId)) ** 2))
        eta2 = (nu / rho) - 1

        VII = (math.tan(PHId)) / (2 * rho * nu)
        VIII = ((math.tan(PHId)) / (24 * rho * (nu ** 3))) * (5 + (3 * ((math.tan(PHId)) ** 2)) + 
               eta2 - (9 * eta2 * ((math.tan(PHId)) ** 2)))
        IX = ((math.tan(PHId)) / (720 * rho * (nu ** 5))) * (61 + (90 * ((math.tan(PHId)) ** 2)) + 
             (45 * ((math.tan(PHId)) ** 4)))

        E_N_to_Lat = (180 / math.pi) * (PHId - ((Et ** 2) * VII) + ((Et ** 4) * VIII) - ((Et ** 6) * IX))
        return E_N_to_Lat;
    }

    GetLongFromEastAndNorth(East, North, a, b, e0, n0, f0, PHI0, LAM0)
    {
        RadPHI0 = PHI0 * (math.pi / 180)
        RadLAM0 = LAM0 * (math.pi / 180)

        af0 = a * f0
        bf0 = b * f0
        e2 = ((af0 ** 2) - (bf0 ** 2)) / (af0 ** 2)
        n = (af0 - bf0) / (af0 + bf0)
        Et = East - e0

        PHId = self.InitialLat(North, n0, af0, RadPHI0, n, bf0)
        
        nu = af0 / (math.sqrt(1 - (e2 * ((math.sin(PHId)) ** 2))))
        rho = (nu * (1 - e2)) / (1 - (e2 * (math.sin(PHId)) ** 2))
        eta2 = (nu / rho) - 1
        
        X =    ((math.cos(PHId)) ** -1) / nu
        XI =  (((math.cos(PHId)) ** -1) / (6 * (nu ** 3))) * ((nu / rho) + (2 * ((math.tan(PHId)) ** 2)))
        XII = (((math.cos(PHId)) ** -1) / (120 * (nu ** 5))) * (5 + (28 *    ((math.tan(PHId)) ** 2)) + 
              (24 * ((math.tan(PHId)) ** 4)))
        XIIA =(((math.cos(PHId)) ** -1) / (5040 * (nu ** 7))) * (61 + (662 * ((math.tan(PHId)) ** 2)) + 
              (1320 * ((math.tan(PHId)) ** 4)) + (720 * ((math.tan(PHId)) ** 6)))

        E_N_to_Long = (180 / math.pi) * (RadLAM0 + (Et * X) - ((Et ** 3) * XI) + ((Et ** 5) * XII) - ((Et ** 7) * XIIA))
        return E_N_to_Long;
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

        res.push(self.GetLatFromEastAndNorth (float(Easting), float(Northing), a, b, e0, n0, f0, PHI0, LAM0))
        res.push(self.GetLongFromEastAndNorth(float(Easting), float(Northing), a, b, e0, n0, f0, PHI0, LAM0))
        return res;
    }
}

class DistanceHelper {
    LatLong_Distance(lat1, lat2)
    {
        let result  = math.acos(math.sin(lat1)*math.sin(lat2)+math.cos(lat1)*math.cos(lat2)*math.cos(lon2-lon1))*6371;
        return result;
    }
}

export { NatGrid2LatLong };