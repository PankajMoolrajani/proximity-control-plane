FROM node
EXPOSE 8082
EXPOSE 8083
ENV PORT=8082
COPY ./mxr-web /mxr-web
WORKDIR /mxr-web
ENV NODE_ENV=mxr-web
ENV NODE_PATH=./mxr-web