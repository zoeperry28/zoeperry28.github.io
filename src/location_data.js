const fs        = require( 'fs');
const JSZip     = require( 'jszip');
const csvParser = require( 'csv-parser');
const NatGrid2LatLong = require( './geo.js' );

const HEADING_FILE = "Code-Point_Open_Column_Headers.csv"
const CSV_PATH = "data_gen"
const CODEPO_GB = "data_gen/codepo_gb.zip"

const fileData = { postcodes: [] };

function getZipData(string_to_find) {
	return new Promise((resolve, reject) => {
	  fs.readFile(CODEPO_GB, function (err, data) {
		if (err) reject(err);
		JSZip.loadAsync(data).then(function (zip) {
		  var found_file = null;
		  var files = zip["files"];
		  for (var filename in files) {
			if (filename.toLowerCase().indexOf(string_to_find.toLowerCase()) !== -1) {
			  found_file = files[filename];
			  break;
			}
		  }
		  if (found_file) {
			found_file.async("nodebuffer").then(function (content) {
			  var output_file_path = CSV_PATH + "/" + found_file.name.split('/').pop();
			  fs.writeFile(output_file_path, content, function (err) {
				if (err) reject(err);
				console.log("File extracted and saved successfully");
				resolve(output_file_path);
			  });
			});
		  } else {
			console.log("No file found containing the string: " + string_to_find);
			resolve(null);
		  }
		});
	  });
	});
}

function readCsv(filePath) {
	return new Promise((resolve, reject) => {
	  const results = [];
	  fs.createReadStream(filePath)
		.pipe(csvParser())
		.on('data', (data) => results.push(data))
		.on('end', () => resolve(results))
		.on('error', (error) => reject(error))
		
	});
}

async function appendHeaders(csv_name)
{
	var data = 0;
	try {
	  const path = await getZipData(HEADING_FILE);
	  data = await readCsv(path);
	  console.log("OK");
	} catch (error) {
	  console.error(error);
	}
	
	var s = data[0]
	var keys = [];
	for(var k in s) keys.push(s[k]);
	console.log(keys)

	var data = fs.readFileSync(csv_name); //read existing contents into data
	var fd = fs.openSync(csv_name, 'w+');

	var head = '';
	for (var i = 0 ; i < keys.length; i++)
	{
		if (i == keys.length-1)
		{
			head = head + keys[i] + "\n";
		}
		else
		{
			head = head + keys[i] + ',';
		}
	}
	console.log(head)
	var buffer = Buffer.from(head);

	fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
	fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
	fs.close(fd);
}

function jsonWrite(filename) {
	fs.writeFileSync(filename, JSON.stringify(fileData, null, 4));
}

function createJson(data, filename)
{
	const ng_ll = new NatGrid2LatLong();
	for (var i = 0 ; i < data.length; i++)
	{
		var POSTCODE = data[i]["Postcode"]
		var NORTHINGS = data[i]["Northings"]
		var EASTINGS = data[i]["Eastings"]
   
		const ll = ng_ll.E_N_To_LatLong(parseFloat(EASTINGS), parseFloat(NORTHINGS));
		fileData.postcodes.push({
			POSTCODE,
			NationalGrid: {
			  Northings: NORTHINGS,
			  Eastings: EASTINGS,
			},
			LatLong: {
			  Latitude: ll[0],
			  Longitude: ll[1],
			},
		  });
	}
	jsonWrite(filename + ".json")
}

function getName(path)
{
	const lastSlashIndex = path.lastIndexOf("/");
	const csvFileNameWithExtension = path.substring(lastSlashIndex + 1);
	const csvFileName = csvFileNameWithExtension.replace(".csv", "");
	return csvFileName;
}

async function getData(string_to_find) {
	var data = 0;
	var path = "";
	try {
		path = await getZipData(string_to_find);
		await appendHeaders(path);	
	  	data = await readCsv(path);
	  console.log("OK");
	} catch (error) {
	  console.error(error);
	}
	createJson(data, getName(path));
	return path;
}

const path = await getData("St")