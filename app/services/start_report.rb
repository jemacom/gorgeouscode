require "yaml"
require "fileutils"

class StartReport
  def initialize(project:, commit_hash:, branch:, queued_at: Time.zone.now)
    @report = Report.new(
      project: project,
      commit_hash: commit_hash,
      branch: branch,
      queued_at: queued_at
    )
    @project = project
  end

  # Creates new VMConnection, prepares repository and gemset configuration
  # and queues analysers with ActiveJob.
  def call
    Log.info "GC:StartReport#call Started for",
      "project(id:#{@project.id}): #{@project.github_owner}/#{@project.github_name}"
    @project.has_last_report_analyses = false
    @project.save!

    Log.info "GC:StartReport#call Cloning/preparing repository"
    @report.started_at = Time.zone.now
    connection = VMConnection.new(@report)
    connection.prepare_repository
    @report.rails_app_path = get_rails_path(connection)
    @report.save!
    Log.info "GC:StartReport#call Report(id:#{@report.id}) created",
      "report branch: #{@report.branch}",
      "commit_hash: #{@report.commit_hash}",
      "queued_at: #{@report.queued_at}"

    if @report.rails_app_present?
      Log.info "GC:StartReport#call Found rails app. Now updating Report(id:#{@report.id}).gc_config"
      copy_overrides_and_update_gc_config(@report, connection)

      if @report.gc_config_valid?
        @report.ruby_version = connection.search_ruby_version
        @report.save!
        Log.info "GC:StartReport#call Updated Report(id:#{@report.id}).ruby_version = #{@report.ruby_version}"

        # setup do rvm
        # new connection to updated @report
        connection = VMConnection.new(@report)
        connection.delete_rake_tasks_folder # got problems with rake tasks folder
        connection.prepare_gemset
        connection.disable_spring_in_rails_app # Disable Spring
        Log.info "GC:StartReport#call Finished Ruby Version and Gemset setup"

        Log.info "GC:StartReport#call Will execute .gc.yml before script",
          "creating databases, copy example.yml, etc "
        connection.execute_in_rails_app(@report.gc_config_to_yml["before_script"])
        @report.finished_setup_at = Time.zone.now
        @report.save!

        Log.info "GC:StartReport#call Will queue PerformAnalysesJob",
         "which queues analyses jobs, delete gemset and repository",
         "in development mode will run right way"
        PerformAnalysesJob.perform_later(@report)
      else
        Log.error "GC:StartReport#call No rails app found. Will remove github hook and raise."
        @project.remove_github_hook
        raise "The current gc_config/override is invalid."
      end
    else
      Log.error "GC:StartReport#call No rails app found. Will remove github hook and raise."
      @project.remove_github_hook
      raise "Couldn't find a Rails application."
    end
  end

  private

  def copy_overrides_and_update_gc_config(report, connection)
    path = overrides_path(report)
    if File.exist?(path)
      Log.info "GC:StartReport#copy_overrides_and_update_gc_config will copy overrides"
      FileUtils.cp_r(File.join(path, "."), connection.rails_fullpath, remove_destination: true)
    end
    report.gc_config = connection.get_gc_config([".gc.yml"])
    report.save!
  end

  def overrides_path(report)
    File.join(
      Rails.application.secrets.overrides_path,
      report.project_github_owner,
      report.project_github_name
    )
  end

  def get_rails_path(connection)
    connection.execute_in_repository(["ls Gemfile"]) ? "/" : nil
  end
end
