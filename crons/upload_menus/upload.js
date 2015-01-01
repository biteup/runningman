// packages
var express = require('express');
var schedule = require('node-schedule');
// -- end

var upload = function(){
	// run uploadJob every 2 hour
	var uploadJob = schedule.scheduleJob('0 */2 * * *', function(){
		console.log('uploading menus from spreasheets');
	});	
}

module.exports.upload = upload;