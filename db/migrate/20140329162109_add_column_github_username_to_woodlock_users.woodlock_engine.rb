# This migration comes from woodlock_engine (originally 20170512090708)
class AddColumnGithubUsernameToWoodlockUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :woodlock_users, :github_username, :string
  end
end
