FROM node
EXPOSE 8082
EXPOSE 8083
ENV PORT=8082
COPY ./mxr-web /mxr-web
WORKDIR /mxr-web
ENV NODE_ENV=mxr-web
ENV NODE_PATH=./mxr-web
ENV DATA_SERVICE_URL=https://dev.monoxor.com/data-services
# ENTRYPOINT ["npm", "run", "start"]
# RUN /bin/sleep 216000
# ENTRYPOINT ["/bin/sleep", "216000"]