// get all cron modules

var crons = {
	menus : require('./crons/upload_menus/upload'),
};

crons.menus.upload();