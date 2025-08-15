FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  g++ \
  python3 python3-pip \
  openjdk-17-jdk \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /code

CMD ["bash"]
