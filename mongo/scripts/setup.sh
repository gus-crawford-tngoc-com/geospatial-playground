apt-get update
apt-get install wget -y
wget https://media.mongodb.org/zips.json
mongoimport mongodb://mongo zips.json