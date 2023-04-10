import shutil
import zipfile
import os; 
import csv
import natgrid_conv
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

def prettify(e):
    e = e.replace("\"", "");
    e = e.replace("\n", "")
    return e;

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
    NG2LL = natgrid_conv.NatGrid2LatLong();
    for i in range (0, len(postcodes)):
        # Opening file
        file1 = open(sheets[i], 'r')
        for line in file1:
            new_line = prettify(line)
            cols = new_line.split(",")
            latlong = NG2LL.E_N_To_LatLong(float(cols[EASTINGS_LOC]), float(cols[NORTHINGS_LOC]))
            NG2LL.E_N_To_LatLong(cols[EASTINGS_LOC], cols[NORTHINGS_LOC])
            json_add_postcode(cols[0], cols[NORTHINGS_LOC], cols[EASTINGS_LOC], latlong[0] ,latlong[1]);
        json_write(postcodes[i] + ".json")
        # Closing files
        file1.close()
    return to_return;

if __name__ == "__main__":
    locs = []
    for i in range(0, len(sys.argv)):
        if (i != 0):
            locs.append(sys.argv[i])
    adapt_data(locs, get_data(locs))