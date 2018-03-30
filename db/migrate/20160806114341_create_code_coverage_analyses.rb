class CreateCodeCoverageAnalyses < ActiveRecord::Migration[4.2]
  def change
    create_table :code_coverage_analyses do |t|
      t.float :percent

      t.timestamps null: false
    end
  end
end
