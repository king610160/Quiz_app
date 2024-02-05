# use nodejs 18.16.0 as image
FROM node:18.16.0

# set workdir in docker
WORKDIR /user/src/app

# copy package.json to target root
COPY package*.json ./

# start npm install
RUN npm install

# install wait-for-it, to let postgres and redis start first
RUN apt-get update && apt-get install -y wait-for-it

# copy the file to target root
COPY . .

# expose port
EXPOSE 3000

# start the service
CMD ["wait-for-it", "-s", "postgres:5432", "--", "wait-for-it", "-s", "redis:6379", "--", "node", "app.js"]