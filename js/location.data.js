const fs = require('fs');
const archiver = require('archiver');
const unzipper = require('unzipper');
const natgridConv = require('natgrid_conv');
const request = require('request');

const extractDir = 'dir_out_extract';
const NORTHINGS_LOC = 3;
const EASTINGS_LOC = 2;

const fileData = { postcodes: [] };

const fileFormat = 'Data/CSV/';
const fileType = '.csv';

function getFileStrings(fileLoc) {
  const toReturn = [];
  for (const item of fileLoc) {
    toReturn.push(`${extractDir}/Data/CSV/${item.replace(fileFormat, '')}`);
  }
  return toReturn;
}



function getData(postcodes) {
  fs.rmdirSync(extractDir, { recursive: true });
  let names = [];
  fs.createReadStream('codepo_gb.zip')
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      names.push(entry.path);
      entry.autodrain();
    })
    .on('finish', () => {
      const filesNeeded = [];
      for (const item of postcodes) {
        for (const file of names) {
          if (file.includes(fileFormat) && file.includes(`${item.toLowerCase()}${fileType}`)) {
            filesNeeded.push(file);
          }
        }
      }
      const extractPromises = [];
      const extractArchive = archiver('zip');
      extractArchive.pipe(fs.createWriteStream('codepo_gb_extract.zip'));
      for (const file of filesNeeded) {
        extractPromises.push(
          new Promise((resolve, reject) => {
            extractArchive.append(fs.createReadStream('codepo_gb.zip', { start: file.dataStart, end: file.dataEnd }), {
              name: `${extractDir}/${file}`,
            });
            resolve();
          })
        );
      }
      Promise.all(extractPromises).then(() => {
        extractArchive.finalize();
      });
    });
  return getFileStrings(filesNeeded);
}

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
    const NG2LL = new natgrid_conv.NatGrid2LatLong();
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
    locs = []
    for (let i = 0; i < Postcodes.length; i++) 
    {
        if (i != 0){
            locs.push(Postcodes[i])
        }
    }
    adaptData(locs, getData(locs))    
}

