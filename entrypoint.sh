#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

exec bundle exec "bin/bundle exec rake db:schema:load RAILS_ENV=development"

exec bundle exec "bin/rails db:environment:set RAILS_ENV=development"

exec bundle exec "bin/bundle exec rails s -p 3000 -b 0.0.0.0 RAILS_ENV=development"
