class AddGithubSecretTokenToProjects < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :github_secret_token, :string
  end
end
