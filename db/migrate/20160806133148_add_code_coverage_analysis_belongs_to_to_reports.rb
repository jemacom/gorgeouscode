class AddCodeCoverageAnalysisBelongsToToReports < ActiveRecord::Migration[4.2]
  def change
    add_reference :reports, :code_coverage_analysis, index: true, foreign_key: true
  end
end
