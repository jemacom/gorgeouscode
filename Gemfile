source "https://rubygems.org"

ruby "2.5.0"

gem 'rails', '>= 5.2.0.rc2'
gem 'activeadmin'
gem "woodlock", git: "https://github.com/regedor/woodlock.git"
gem "sass-rails", "~> 5.0"
gem 'materialize-sass', '~> 1.0.0.beta'
gem "pg", '~> 0.20.0'
gem "uglifier", ">= 1.3.0"
gem "jquery-rails"
gem 'turbolinks', '~> 5'
gem "jbuilder", "~> 2.5"
gem "sdoc", "~> 0.4.0", group: :doc
gem "thin"
gem "haml"
gem "factory_girl"
gem "hirb", "~> 0.7.3"
gem "formtastic", "> 3.0"
gem "rails_best_practices-gorgeouscode", require: "rails_best_practices"
gem "octokit", "~> 4.1", ">= 4.1.1"
gem "delayed_job_active_record", "~> 4.1"
gem "daemons"

group :development, :test do
  gem "byebug"
  gem "colorize"
  gem "annotate"
  gem "capybara", "~> 2.5"
  gem "capybara-email", "~> 2.4.0"
  gem "shoulda", "~> 3.5"
  gem "mocha"
end

group :development do
  gem "web-console", "~> 2.0"
  gem "spring"
end

gem "simplecov", require: false, group: :test

group :production do
  gem "rails_12factor"
end
