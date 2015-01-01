// packages
var Spreadsheet = require('edit-google-spreadsheet');
var schedule = require('node-schedule');
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