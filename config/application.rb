require_relative 'boot'

require 'rails'

# require "active_record/railtie" rescue LoadError
# require "active_storage/engine" rescue LoadError
begin
  require 'action_controller/railtie'
rescue StandardError
  LoadError
end
begin
  require 'action_view/railtie'
rescue StandardError
  LoadError
end
begin
  require 'action_mailer/railtie'
rescue StandardError
  LoadError
end
begin
  require 'active_job/railtie'
rescue StandardError
  LoadError
end
begin
  require 'action_cable/engine'
rescue StandardError
  LoadError
end
# require "action_mailbox/engine" rescue LoadError
# require "action_text/engine" rescue LoadError
begin
  require 'rails/test_unit/railtie'
rescue StandardError
  LoadError
end

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HelpApp
  class Application < Rails::Application
    config.load_defaults 7.0
    config.active_job.queue_adapter = :sidekiq
    config.action_cable.mount_path = '/websocket'

    config.generators do |g|
      g.orm :active_record
    end

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
