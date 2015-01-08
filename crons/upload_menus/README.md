# Upload JS

## Introduction

This script is setup to poll restaurant data from the spreadsheet (url defined in config files) and reformats the data correctly before sending POST (re: new restaurant), PUT (re: update restaurant), and/or DELETE (re: delete restaurant) requests to the backend API server, **Snakebite**

## NOTES

In the spreadsheet, we can alert Runningman what to do with each row.
Under 'STATUS', the following values are accepted and correspond to the following actions executable on Runningman (via upload.js)

| STATUS | Course of Action | Remarks |
| ------ | ---------------- | ------- |
| NEW | Create new restaurant with data from this row | DONE |
| UPDATE | Update this existing restaurant (based on ID) with data from this row | NOT DONE |
| DELETE | Delete this existing restaurant (based on ID), removing this row | NOT DONE |
| NOOP | do nothing about the data in this row | DONE |
