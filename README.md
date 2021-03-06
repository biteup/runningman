<p align="center">
  <img src="logo.png">
</p>

# Running Man 
[![Build Status](https://travis-ci.org/gobbl/runningman.svg?branch=master)](https://travis-ci.org/gobbl/runningman)


> Cron manager for Benri

Runningman is an application designed to run crons on schedule! 
Great for building scripts that are supposed to be running in the background.

Technologically, Runningman is built on Node JS, since crons and schedules seem to go well with event-based loops (Node JS). Like cidars and beers.

Perhaps, some relevant examples would be:
- sending reminder emails to Restaurants about their billing *every first day of the month*
- scraping off some data spreadsheet *every hour* to send requests to Snakebite for persisting to database instead

## Setting up

1. Install [Node](http://nodejs.org/download/) on your machine, if you have not already done so.
2. Clone this repository onto your machine and `cd` into this project directory.
3. We need to install all package dependencies. Do so by ```$ npm install```
4. run the server by ```$ node web.js dev``` if you are running Snakebite on your local machine (assuming Snakebite is listening on port 8000)
5. some default settings are assumed in the config files for various environment. you may wish to fix the config file (e.g., `config/dev.json`) to your own settings whenever necessary. 
