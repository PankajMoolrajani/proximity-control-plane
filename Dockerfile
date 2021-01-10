FROM node
EXPOSE 8082
ENV PORT=8082
COPY ./ /
WORKDIR /
ENV NODE_ENV=/
ENV NODE_PATH=./
# ENTRYPOINT ["npm", "run", "start"]
# RUN /bin/sleep 216000
# ENTRYPOINT ["/bin/sleep", "216000"]