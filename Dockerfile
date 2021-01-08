FROM node
EXPOSE 8082
ENV PORT=8082
COPY ./nocode /nocode
WORKDIR /nocode
ENV NODE_ENV=/nocode
ENV NODE_PATH=src
RUN npm install react-scripts
# ENTRYPOINT ["npm", "run", "start"]
# RUN /bin/sleep 216000
# ENTRYPOINT ["/bin/sleep", "216000"]