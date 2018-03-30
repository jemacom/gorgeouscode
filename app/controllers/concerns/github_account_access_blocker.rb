module GithubAccountAccessBlocker
  extend ActiveSupport::Concern

  def block_github_account_access?(github_account_name, current_user)
    if current_user && current_user.github_token && current_user.github_username
      client = Octokit::Client.new(access_token: current_user.github_token)
      return !client.organization_member?(github_account_name, current_user.github_username)
    end
    true
  end
end
