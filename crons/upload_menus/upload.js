// packages
var Spreadsheet = require('edit-google-spreadsheet');
var schedule = require('node-schedule');
var _ = require('underscore');
var fs = require('fs');
var req = require('request');
// -- end packages declaration

/*
 currently, the spreadsheet headers have the following format:

 --------------------------------------------------------------------------------------------------------------------------------
 RESTAURANT                                                                                     MENU1 ...
 --------------------------------------------------------------------------------------------------------------------------------
 STATUS | ID | NAME | DESCRIPTION | EMAIL | ADDRESS | GEOLOCATION (LATLONG) | TAGS | MENU SIZE | NAME | PRICE (¥) | IMAGES | TAGS
 --------------------------------------------------------------------------------------------------------------------------------

*/

var readSpreadsheet = function(){
	var filePath = __dirname + '/../../config/' + process.argv[2] + '.json';
	var config = JSON.parse(fs.readFileSync(filePath));
	var updateMap = {};

	Spreadsheet.load(config.spreadsheet,
	function sheetReady(err, spreadsheet){

		function updateSpreadsheet(){
			// update status to NOOP for all
			for(var key in updateMap){
				var row = updateMap[key][1] = {name: 'status', val: "NOOP"};
			};
			console.log("updates: ", JSON.stringify(updateMap, null, 4));
			spreadsheet.add(updateMap);
			spreadsheet.send(function(err){
				if(err) throw err;
			});
		};

		if(err) throw err;

		spreadsheet.receive(function(err, rows, info){
			if(err) throw err;

			console.log("Found rows:", rows, "\n\n");
			rows = _.values(rows);  // to array of rows (each row in dict form)

			// get details of objects via headers
			var headers = _.invert(rows[0]);
			var h = {}, prevKey;
			for(var key in headers){
				h[key] = {'start': parseInt(headers[key], 10), 'end': -1};
				if(h[prevKey]) h[prevKey]['end'] = h[key]['start'] - 1;
				prevKey = key;
			};

			var attrs = _.values(rows[1]),
				i = 2, // start from third row in spreadsheet
				row,
				restaurant,
				menus,
				status,
				menuSize;

			for(; i < rows.length; i++){
				var id = rows[i]["2"];
				if(!id) rows[i]["2"] = 0;  // fill in temp id value first if new restaurant
				row = _.values(rows[i]);
				status = row[0].toUpperCase(); // get request status (either NEW, UPDATE or DELETE)
				menuSize = row[8]; // how many menus this restaurant has / should have


				// TODO: more efficient ways of initializing Restaurant and Menu objects
				var restaurant = {"menus": []};
				for(var k = 2; k < 8; k++){
					restaurant[attrs[k]] = row[k];
				};

				// get individual menus' information
				for(var k = 9; k < (9 + menuSize*4); k+=4){
					var menu = {};
					menu[attrs[k]] = row[k]; // name
					menu[attrs[k+1]] = row[k+1];  // price
					menu[attrs[k+2]] = row[k+2];  // images
					menu[attrs[k+3]] = row[k+3];  // tags

					restaurant['menus'].push(menu);
				};

				var method,
				    url = config.api.url + '/restaurants',
				    requestMethodMap = {
						"NEW": "post",
						"UPDATE": "update",
						"DELETE": "delete"
				    };

				method = requestMethodMap[status] || 'noop';  // invalidate method if request status not of certain type

				function reformatRestaurantJSON(restaurant){
					/*
					geolocation is expressed as lat, long (as per Google Maps). However we need it to be (long, lat)
					so that MongoDB does not complain.

					the backend server assumes each menu's images to be in an array,
					so we need to reformat the data from spreadsheet.
					*/

					var latlong = _.map(restaurant.geolocation.split(','), function(str){ return parseFloat(str, 10); });
					restaurant.geolocation = [latlong[1], latlong[0]];  // mongodb accepts in long lat only

					_.each(restaurant.menus, function(menu){ menu.images = menu.images.split(','); });
				}

				reformatRestaurantJSON(restaurant);
				if(method === "noop"){
					console.log("No request made for row #" + i + ". Skipping this row.");
					continue;
				};
				req({url: url, headers: {'Content-Type': 'application/json'}, method: method, body: restaurant, json: true},
					function(err, resp, body){
						if(err) throw err;

						switch(resp.statusCode){
							case 200: {
								console.log('Success: ', body);
								switch(method){
									case 'post': {
										// update spreadsheet with restaurant ID
										var id = body['_id']['$oid'];
										updateMap[i] = {2: {name: 'ID', val: id}};
										updateSpreadsheet();
										break;
									}
								};

								break;
							}
							case 400: {
								console.log('Error: ', body);
								break;
							}
							default: {
								console.log(body);
								break;
							}
						};
					}
				);
				// end of request call
			};

		}); // end spreadsheet Receive function
	});
}

var upload = function(){
	// run uploadJob every 2 hour
	var uploadJob = schedule.scheduleJob('0 */2 * * *', function(){
		console.log('uploading menus from spreasheets');
		readSpreadsheet();
	});	
}

module.exports.upload = readSpreadsheet;  // switch to 'readSpreadsheet' if we want to manually run this script when firing web.js
