FROM ruby:2.5.0-alpine

RUN apk --update add tzdata git nodejs netcat-openbsd postgresql-dev
RUN apk --update add --virtual build-dependencies make g++

RUN mkdir /freeletics

WORKDIR /freeletics

ADD Gemfile /freeletics/Gemfile
ADD Gemfile.lock /freeletics/Gemfile.lock

RUN bundle install
RUN apk del build-dependencies && rm -rf /var/cache/apk/*

ADD . /freeletics
RUN git submodule init
COPY entrypoint.sh /usr/local/bin

ENTRYPOINT ["entrypoint.sh"]
