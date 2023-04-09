import shutil
import zipfile
import os; 
import csv
import location_data
import requests
import sys
import json

extract_dir = "dir_out_extract"
NORTHINGS_LOC = 3
EASTINGS_LOC = 2


file_data = { "postcodes" : []}

file_format = "Data/CSV/";
file_type = ".csv"

def get_file_strings(file_loc):
    to_return = []
    for item in file_loc:
        to_return.append(extract_dir + "/Data/CSV/" + item.replace(file_format, ""));
    return to_return;

def get_data(Postcodes):
    shutil.rmtree(extract_dir, ignore_errors=False, onerror=None)

    
    names = []
    with zipfile.ZipFile('codepo_gb.zip') as zf:
        names = zf.namelist()
    
    files_needed = [];
    for item in Postcodes:
        for file in names:
            if ((file.find(file_format)!= -1) and (file.find(item.casefold()+file_type) != -1)):
                files_needed.append(file)

    with zipfile.ZipFile('codepo_gb.zip') as zf:
        for files in files_needed:
            zf.extract(files, extract_dir)

    return get_file_strings(files_needed)

def natgrid_to_latlong(Eastings, Northings):
    URL = "https://webapps.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc";
    URL = URL + "?method=BNGtoLatLng&";
    URL = URL + "easting=" + Eastings;
    URL = URL + "&northing=" + Northings;
    # A GET request to the API
    response = requests.get(URL)

    # Print the response
    response_json = response.json()
    return [response_json["LATITUDE"], response_json["LONGITUDE"]];

def prettify(e):
    e = e.replace("\"", "");
    e = e.replace("\n", "")
    return e;

def write_csv(Area, Loc, latitude, longitude):
    CSV_NAME = Area+".csv";
    if (os.path.isfile(CSV_NAME) == False):
        f = open(CSV_NAME, "a")
        f.write(Area + "_Postcode, latitide, longitude\n")
        f.close()
    with open(CSV_NAME,'a') as f:
        f.write((Loc+","+str(latitude)+","+str(longitude)+"\n"));

def no_of_postcodes(file_name):
    with open(file_name, 'r') as fp:
        x = len(fp.readlines())
        return int(x)

def json_add_postcode(Postcode, Northings, Eastings, Latitude, Longitude):
    
    file_data["postcodes"].append({"postcode":Postcode,
            "NationalGrid":{
                "Northings":Northings,
                "Eastings" : Eastings
            },
            "LatLong":{
                "Latitude":Latitude,
                "Longitude":Longitude
            }
            });

def json_write(filename):
    with open(filename, "w") as outfile:
        json.dump(file_data, outfile, indent=4)


def adapt_data(postcodes, sheets):
    to_return = [];
    NO_DONE = 0;
    PERCENT_DONE = 0;
    TOTAL_POSTCODES = 0;
    for i in range (0, len(postcodes)):
        
        area = location_data.area(postcodes);
        # Opening file
        file1 = open(sheets[i], 'r')
        count = 0
        TOTAL_POSTCODES = no_of_postcodes(sheets[i]);

        # Using for loop
        print("Using for loop")
        for line in file1:
            new_line = prettify(line)
            cols = new_line.split(",")
            latlong = natgrid_to_latlong(cols[EASTINGS_LOC], cols[NORTHINGS_LOC])
            area.Add(cols[0], cols[NORTHINGS_LOC], cols[EASTINGS_LOC], latlong[0] ,latlong[1])
            write_csv(postcodes[i], cols[0], latlong[0], latlong[1]);
            NO_DONE = NO_DONE + 1;
            PERCENT_DONE = round(((NO_DONE / TOTAL_POSTCODES) * 100),2);
            sys.stdout.write('\r')
            sys.stdout.flush()
            sys.stdout.write(("[" + postcodes[i] + "] " + str(PERCENT_DONE) + "% Complete"))
            sys.stdout.flush()
            json_add_postcode(cols[0], cols[NORTHINGS_LOC], cols[EASTINGS_LOC], latlong[0] ,latlong[1]);
        json_write(postcodes[i] + ".json")
        sys.stdout.write("\n")
        # Closing files
        file1.close()
        to_return.append(area);
    return to_return;

if __name__ == "__main__":
    locs = []
    for i in range(0, len(sys.argv)):
        if (i != 0):
            locs.append(sys.argv[i])
    #json_init("ST.json")
    #json_add_postcode("ST.json", "test", 1,2,3,4)
    adapt_data(locs, get_data(locs))

    #print("done!")