class AddColumnGithubAccountReferenceToProjects < ActiveRecord::Migration[4.2]
  def change
    add_reference :projects, :github_account, index: true, foreign_key: true
  end
end
