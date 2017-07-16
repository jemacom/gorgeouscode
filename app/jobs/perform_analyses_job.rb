class PerformAnalysesJob < ActiveJob::Base
  queue_as :default

  def perform(report)
    #rails_best_practices_analysis = Analyses::RailsBestPracticesAnalysis.create!(report: report)
    Log.info "GC::PerformAnalysesJob#perform Created RailsBestPracticesAnalysis COMMENTED OUT"
    model_diagram_analysis = Analyses::ModelDiagramAnalysis.create!(report: report)
    Log.info "GC::PerformAnalysesJob#perform Created ModelDiagramAnalysis(Id:#{model_diagram_analysis.id})"
    #code_coverage_analysis = Analyses::CodeCoverageAnalysis.create!(report: report)
    Log.info "GC::PerformAnalysesJob#perform Created CodeCoverageAnalysis COMMENTED OUT"

    connection = VMConnection.new(report)
    begin
      Log.info "GC::PerformAnalysesJob Starts RailsBestPracticesAnalysis#run COMMENTED OUT"
      #rails_best_practices_analysis.run
      Log.info "GC::PerformAnalysesJob Starts ModelDiagramAnalysis#run"
      model_diagram_analysis.run
      Log.info "GC::PerformAnalysesJob#perform Starts CodeCoverageAnalysis#run COMMENTED OUT"
      #code_coverage_analysis.run

      finish_report(report)
    rescue Exception
      Rails.logger.error "GC::PerformAnalysesJob @ Exception while running analyses".red
    end

    Log.info "GC::PerformAnalysesJob#perform Will droping DB",
      "delete_gemset and delete_repository COMMENTED OUT"
    connection.execute_in_rails_app(["bundle exec rake db:drop"])
    # connection.delete_gemset
    # connection.delete_repository
  end

  private

  def finish_report(report)
    project = report.project

    if finished_analyses?(report)
      Log.info "GC::PerformAnalysesJob#finish_report project.has_last_report_analyses = true"
      project.has_last_report_analyses = true
      project.save!
      # TODO: Reveiew this code
      if !project.github_webhook_id || !Rails.env.development?
        Log.info "GC::PerformAnalysesJob#finish_report will create_github_hook"
        project.create_github_hook
      end
    else
      Log.error "GC::PerformAnalysesJob#finish_report project.has_last_report_analyses = false"
      project.has_last_report_analyses = false
      project.save!
      Log.info "GC::PerformAnalysesJob#finish_report will remove_github_hook"
      report.project.remove_github_hook(report)
    end
  end

  def finished_analyses?(report)
    report.model_diagram_analysis.json_data? ||
    report.rails_best_practices_analysis.nbp_report ||
    report.rails_best_practices_analysis.score
  end
end
