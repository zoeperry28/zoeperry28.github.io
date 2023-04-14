
function prettify(e) {
    e = e.replace(/"/g, '');
    e = e.replace(/\n/g, '');
    return e;
  }
  
  function jsonAddPostcode(postcode, northings, eastings, latitude, longitude) {
    fileData.postcodes.push({
      postcode,
      NationalGrid: {
        Northings: northings,
        Eastings: eastings,
      },
      LatLong: {
        Latitude: latitude,
        Longitude: longitude,
      },
    });
  }
  
  function jsonWrite(filename) {
    fs.writeFileSync(filename, JSON.stringify(fileData, null, 4));
  }
  
  function adaptData(postcodes, sheets) {
      console.log(postcodes)
      const NG2LL = new NatGrid2LatLong();
      for (let i = 0; i < postcodes.length; i++) {
      const file1 = fs.readFileSync(sheets[i], 'utf8');
      const lines = file1.split('\n');
          for (let j = 0; j < lines.length; j++) {
          const newLine = prettify(lines[j]);
          const cols = newLine.split(',');
          const latlong = NG2LL.E_N_To_LatLong(parseFloat(cols[EASTINGS_LOC]), parseFloat(cols[NORTHINGS_LOC]));
          NG2LL.E_N_To_LatLong(cols[EASTINGS_LOC], cols[NORTHINGS_LOC]);
          jsonAddPostcode(cols[0], cols[NORTHINGS_LOC], cols[EASTINGS_LOC], latlong[0], latlong[1]);
          }
      jsonWrite(postcodes[i] + '.json');
      }
  }
      
  function GetDataForPostcodes(Postcodes=[])
  {
      var locs = []
      for (let i = 0; i < Postcodes.length; i++) 
      {
          if (i != 0){
              locs.push(Postcodes[i])
          }
      }
      adaptData(locs, getData(CODEPO_GB, "st", extractDir));   
  }
  
  
function getFileStrings(fileLoc) {
    const toReturn = [];
    for (const item of fileLoc) {
      toReturn.push(`${extractDir}/Data/CSV/${item.replace(fileFormat, '')}`);
    }
    return toReturn;
  }
  
  GetDataForPostcodes(["st"])

