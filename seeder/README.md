# EVRYTHNG screen__header

## Introduction
Creates a Sample Project, App, Products, Thngs, Action Types , deploys some reactor scripts for counterfeit, grey market and sets a default redirection for the Kidger App.

## Running up the seeder

Seeder uses evt-config npm module now, so all settings are environment variables. setconfigExample.sh is a version without the keys.

https://www.npmjs.com/package/evt-config.

Install it globally.

then run npm update in seeder directory

Copy setconfigExample.sh to setconfig.sh (setconfig.sh is in .gitignore so wont be checked in)

Add your OperatorKey and set various API locations dependant on EU / US data centre.

run : sh setconfig.sh

run : node 1_addProjectAndApplication.js

update keys and ID's in setconfig.sh, then run it

run : node 2_addActionTypes
run : node 3_scopeActionTypes

Change products.json or thngs.json as needed, or just do it in the dashboard

run : node 4_addProductsAndThngs

run : node 5_addRedirection

## Setting up Reactor

In ./supplychainrules

run npm update

In ./supplychainrules/deploy

zip reactor using 1_zipreactor.sh
deploy using 2_deployreactorzip.js

Reactor rules run if the application customfield runCounterfeitRules is true


## Custom Live Dashboard

Add new Dashboard as necessary and add custom Widgets.

See Here for dashboard setup https://content.screencast.com/users/Dashenhurst/folders/Jing/media/ed30ce55-43d7-4e3a-8989-0829cbe64dcc/00001273.png

If a new version of the dashboard is built, then need to rebuild in dashboards github repository copy over the realtime-actions.js file, then switch to seeder/dashboards and run netlify deploy
