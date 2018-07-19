#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

exec bundle exec "bin/rails db:environment:set RAILS_ENV=development"

exec bundle exec "$@"
