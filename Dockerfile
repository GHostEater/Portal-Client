FROM node:7.4

RUN npm install -g bower && npm install -g gulp

WORKDIR /usr/application

COPY .bowerrc ./
COPY .eslintrc ./
COPY .jshintrc ./
COPY .yo-rc.json ./
COPY bower.json ./
COPY gulpfile.js ./
COPY karma.conf.js ./
COPY package.json ./
COPY protractor.conf.js ./

# install requirements
RUN npm install
RUN bower install --allow-root

# run server
CMD gulp build
