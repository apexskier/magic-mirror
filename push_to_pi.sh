./node_modules/.bin/gulp build

ssh pi@10.0.1.145 "mkdir -p magic-mirror"

rsync -avz --exclude node_modules --progress . pi@10.0.1.145:magic-mirror

ssh pi@10.0.1.145 "cd magic-mirror && npm install --production && sudo service magic-mirror restart"
