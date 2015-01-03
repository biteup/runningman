// packages
var Spreadsheet = require('edit-google-spreadsheet');
var schedule = require('node-schedule');
// -- end

// classes
var Restaurant = function(name, description, email, geolocation, tags){
	this.name = name;
	this.description = description || '';
	this.geolocation = geolocation || [139.710388, 35.673343];
	this.email = email || '';
	this.tags = tags.split(',') || [];
};

var Menu = function(name, price, images, tags) {
	this.name = name;
	this.price = price;
	this.images = images || [];
	this.tags = tags.split(',') || [];
}
// -- end

var rowCount = 0;

var readSpreadsheet = function(){
	Spreadsheet.load({
	debug: true,
	spreadsheetId: '1YTOWZZjEsswPr8YdaZzRJBlPH8BJdClJm_TEbRgqkIg',
	worksheetId: 'od6',
	username: 'get.benri@gmail.com',
	password: '123gobenri!',
	},
	function sheetReady(err, spreadsheet){

		if(err){
			throw err;
		};

		spreadsheet.receive(function(err, rows, info){
			if(err){
				throw err;
			};

			console.log("Found rows:", rows);
			console.log("row 1:", rows["1"]);  // example of accessing row

			// parse data into objects
			var totalRows = 3, row; // TODO: ascertain total rows (sans headers)
			var rowIndex = 3, rowSize = (totalRows - 2) + rowIndex;
			for(; rowIndex < rowSize; rowIndex++){
				row = rows[rowIndex.toString()];
				var rowArr = [false];  // setup dummy value at index 0 since keys start from "1"
				for(var key in row){
					rowArr.push(row[key])
				};
				console.log('status: ', rowArr[1]);
				console.log('restaurant: ', rowArr.slice(2, 8));
				console.log('menu(s): ', rowArr.slice(9));
				/*
				var restaurant = Restaurant.apply(rowArr.slice(1,8));
				var numMenus = parseInt(rowArr[8], 10);
				var menus = [], iter = 9, menuArrSize = 4;
				for(var i=1; iter < rowArr.length && i <= numMenus; iter+=menuArrSize){
					menus.push(Menu.apply(rowArr.slice(iter, iter+menuArrSize)));
				};

				console.log('restaurant: ', restaurant);
				console.log('menu(s): ', menus);
				*/
			}

		});
	});
}

var upload = function(){
	// run uploadJob every 2 hour
	var uploadJob = schedule.scheduleJob('0 */2 * * *', function(){
		console.log('uploading menus from spreasheets');
		readSpreadsheet();
	});	
}

module.exports.upload = upload;