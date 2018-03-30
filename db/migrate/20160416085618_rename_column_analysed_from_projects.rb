class RenameColumnAnalysedFromProjects < ActiveRecord::Migration[4.2]
  def change
    rename_column :projects, :analysed, :has_last_report_analyses
  end
end
