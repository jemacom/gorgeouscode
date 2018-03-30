class AddGithubWebhookIdToProjects < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :github_webhook_id, :integer
  end
end
