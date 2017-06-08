# UserServiceClient.configure do |config|
#   begin
#     uri = URI.parse(Rails.configuration.x&.external_services&.user&.base_uri)

#     config.debugging = !Rails.env.production?
#     config.scheme = uri.scheme
#     config.host = uri.host
#     config.base_path = uri.path

#     # use ActiveSupport::Duration in config file! fixnums are not supported
#     config.timeout =
#       Rails.configuration.x&.external_services&.user&.timeout&.seconds || 5
#   rescue URI::InvalidURIError
#     raise 'Configuration missing or invalid: ' \
#           '\'running.external_services.user.base_uri\''
#   end
# end
