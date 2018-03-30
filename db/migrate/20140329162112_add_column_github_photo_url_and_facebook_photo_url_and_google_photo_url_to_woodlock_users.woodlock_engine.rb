# This migration comes from woodlock_engine (originally 20170512093815)
class AddColumnGithubPhotoUrlAndFacebookPhotoUrlAndGooglePhotoUrlToWoodlockUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :woodlock_users, :github_photo_url, :string
    add_column :woodlock_users, :facebook_photo_url, :string
    add_column :woodlock_users, :google_photo_url, :string
  end
end
