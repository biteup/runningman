var Slack = require('slack-api');
var req = require('request');
var fs = require('fs');
var schedule = require('node-schedule');
var config = {};


var _get_config = function(){
	var filePath = __dirname + '/../../config/' + process.argv[2] + '.json';
	return JSON.parse(fs.readFileSync(filePath));
}

var recommendMenu = function(){
	try
	{
		config = _get_config();
	}
	catch (e)
	{
		console.log(e);
		return false;
	};

	getRandomRecommendation(onRecommendationSuccess, onRecommendationError);
};

var onRecommendationSuccess = function(restaurant){
	var menu = restaurant.menus[0];
	var msg = "It's lunchtime now! Why not try \*" + restaurant.name + "\*'s " + menu.name + " for only ¥" + menu.price + "!\n\n" + menu.images[0];
	var payload = {'token': config.slack.token, 'channel': config.slack.channels.general, 'username': config.slack.user, 'mrkdwn': true, 'text': msg};
	Slack.chat.postMessage(payload, function(error, data){
		if(!error){
			console.log("SUCESS");
		}
		else {
			console.log("ERROR");
		};
		console.log("data: \n%s", JSON.stringify(data, null, 4));
		return;
	});
};// 

var onRecommendationError = function(error){
	console.log('Error Handler for when calls to Snakebite API are erroneous!');
	return;
};

var getRandomRecommendation = function(success, error){
	var apiURL = config.api.url + '/restaurants';

	req({url: apiURL, headers: {'Content-Type': 'application/json'}, method: 'get', json: true},
		function(err, resp, body){
			if(err) throw err;

			switch(resp.statusCode){
				case 200: {
					var numRestaurants = parseInt(body.count, 10),
					    randomIndex = Math.floor(Math.random() * (numRestaurants - 1)) + 0;

					console.log('Success: ', body);
					console.log('Number of restaurants: %d', numRestaurants);
					var restaurant = body.items[randomIndex];
					success(restaurant);
					break;
				}
				case 400: {
					console.log('Error: ', body);
					error(body);
					break;
				}
				default: {
					console.log(body);
					break;
				}
			};
		}
	);
};

var recommendLunch = function(){
	// run uploadJob every 2 hour
	var uploadJob = schedule.scheduleJob('0 12 * * 1-5', function(){
		console.log('recommending lunch from Gobbl at 12pm every weekdays');
		recommendMenu();
	});	
};

module.exports.recommend = recommendLunch;