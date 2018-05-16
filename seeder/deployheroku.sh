#!/bin/bash
rsync -av --progress api ~/heroku/seeder --exclude node_modules
cd ~/heroku/seeder
git add .
git commit -m 'auto deploy'
git push heroku master
heroku logs
cd ~/github/evt-solution-demos/seeder
