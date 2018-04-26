require Woodlock::Engine.root.join("app", "models", "woodlock", "user")

class Woodlock::User #< ActiveRecord::Base
  has_many :added_projects, class_name: "Project", foreign_key: "added_by_user_id"
  has_many :owned_projects, class_name: "Project", foreign_key: "owner_user_id"

  def photo_url
    github_photo_url || gravatar_url
  end

  def update_github_nickname(auth)
    return unless auth.provider == "github"
    self.github_username = auth.info.nickname

    save
  end

  def update_github_token(auth)
    return unless auth.provider == "github"

    token = auth.credentials.token

    raise "Couldn't find token in #{auth}" unless token
    self.github_token = token

    save
  end

  def github_repository_access?(repository_name)
    return false unless github_token

    client = Octokit::Client.new(access_token: github_token)
    return true if client.repository?(repository_name)

    last_response = client.last_response

    return true if last_response.data && last_reponse.data.name.eql?(repository_name)
  end

  def github_repositories
    return false unless github_token
    client = Octokit::Client.new(access_token: github_token)
    repositories = client.repositories
    last_response = client.last_response

    while last_response.rels[:next].present?
      last_response = last_response.rels[:next].get
      repositories.concat(last_response.data)
    end

    repositories.sort_by(&:name)
  end
end
