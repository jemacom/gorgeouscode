class CreateGithubAccounts < ActiveRecord::Migration[4.2]
  def change
    create_table :github_accounts do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
