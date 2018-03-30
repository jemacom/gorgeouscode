# This migration comes from woodlock_engine (originally 20170512093729)
class AddColumnGenderToWoodlockUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :woodlock_users, :gender, :string
  end
end
