FROM node:lts-alpine as develop
WORKDIR /app
RUN mkdir logs
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json
RUN npm install

FROM develop as production
ADD ./tsconfig.json /app/tsconfig.json
ADD ./tsconfig.build.json /app/tsconfig.build.json
ADD ./README.md /app/README.md
ADD ./src /app/src
RUN npm run build