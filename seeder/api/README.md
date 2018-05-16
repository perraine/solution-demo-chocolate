# api

Runs on Heroku

On local machine mkdir ~/heroku/seeder
then git init
heroku git:remote -a evt-seeder

then back in main repositry from evt-solution-demos/seeder run

sh deployheroku.sh


# ENDPOINTS

/simulator


Adds random scans from random global cities.

Pass in APP API Key as authorisation

As part of the payload need to pass in the region the account is hosted and also over ride of the number of scans

eg

{ "region" : "eu", "numberOfScans" : 10 }

/seeder

POST /seeder HTTP/1.1
Host: evt-seeder.herokuapp.com
Content-Type: application/json
Accept: application/json
Authorization: OPERATOR KEY
Cache-Control: no-cache

{"project" : "Project Name", "region" : "eu"}
