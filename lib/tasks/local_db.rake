require "fileutils"

namespace :local_db do
  desc "Backup database and pull from heroku"
  task pull_from_heroku: :environment do
    FileUtils.mkdir_p(File.join("gc_backups", "db")) unless File.exist?(File.join("gc_backups", "db"))
    system "pg_dump gorgeous-code-alpha_development > gc_backups/db/#{Time.current.strftime('%Y%m%d%H%M%S')}_local_db"
    system "dropdb gorgeous-code-alpha_development"
    system "heroku pg:pull DATABASE_URL gorgeous-code-alpha_development --app gorgeouscode-alpha"
  end

  desc "Push local database to heroku"
  task push_to_heroku: :environment do
    system "heroku pg:reset DATABASE_URL --confirm gorgeouscode-alpha"
    system "heroku pg:push gorgeous-code-alpha_development DATABASE_URL --app gorgeouscode-alpha"
  end

  desc "Dumps the database to db/APP_NAME.dump"
  task :dump => :environment do
    cmd = nil
    with_config do |app, host, db, user|
      cmd = "pg_dump --host #{host} --username #{user} --verbose --clean --no-owner --no-acl --format=c #{db} > #{Rails.root}/db/#{app}.dump"
    end
    puts cmd
    exec cmd
  end

  desc "Restores the database dump at db/APP_NAME.dump."
  task :restore => :environment do
    cmd = nil
    with_config do |app, host, db, user|
      cmd = "pg_restore --verbose --host #{host} --clean --no-owner --no-acl --dbname '#{db}' '#{Rails.root}/db/#{app}.dump'"
      #cmd = "pg_restore --verbose --host #{host} --username #{user} --clean --no-owner --no-acl --dbname '#{db}' '#{Rails.root}/db/#{app}.dump'"
    end
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    puts cmd
    exec cmd
  end

  private

  def with_config
    yield Rails.application.class.parent_name.underscore,
      ActiveRecord::Base.connection_config[:host],
      ActiveRecord::Base.connection_config[:database],
      ActiveRecord::Base.connection_config[:username] || "miguelfernandes"
  end
end
