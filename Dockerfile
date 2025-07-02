FROM node:22

RUN apt-get update && \
    apt-get install -y ansible && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD ["tail", "-f", "/dev/null"]
