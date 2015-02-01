// get all cron modules

var crons = {
	menus : require('./crons/upload_menus/upload'),
	bentobot: require('./crons/bentobot/recommend')
};

console.log('RUNNING MAN v0.0.1\n--------------------------------', 
	'\nRunning some crons now. Go grab some coffee. :)\n');

// crons.menus.upload();
crons.bentobot.recommend();