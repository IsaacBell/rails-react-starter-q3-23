source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.2'

gem 'area', '~> 0.10.0'
gem 'aws-sdk-comprehend'
gem 'bootsnap', require: false
gem 'bson_ext'
gem 'bugsnag', '~> 6.26'
gem 'cancancan', '~> 3.5'
gem 'counter_culture', '~> 3.2'
gem 'devise'
gem 'devise_token_auth', '~> 1.2.2'
gem 'dotenv-rails'
gem 'ejs'

# rubocop:disable convention:Bundler/OrderedGems
gem 'kaminari' # always include before elasticsearch gems
# rubocop:enable convention:Bundler/OrderedGems

gem 'elasticsearch-dsl'
gem 'elasticsearch-model'
gem 'elasticsearch-rails'
gem 'faraday'
gem 'faraday-detailed_logger'
gem 'geocoder', '~> 1.8'
gem 'google-cloud-language'
gem 'haml', '~> 6.1'
gem 'haml_coffee_assets'
gem 'httparty', '~> 0.21.0'
gem 'importmap-rails'
gem 'jbuilder'
gem 'jwt'
# gem 'mongoid', '~> 8.1.0'
gem 'oj', '~> 3.15'
gem 'pg', '~> 1.2'
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.6'
gem 'redis'
gem 'sidekiq', '~> 7.1'
gem 'sidekiq-unique-jobs', '>= 7.0'
gem 'spring'
gem 'sprockets-rails'
gem 'statesman', '~> 10.0.0'
# gem 'statesman_mongoid'
gem 'tailwindcss-rails', '~> 2.0'
gem 'tzinfo-data', platforms: %i[ mingw mswin x64_mingw jruby ]

group :development do
  gem 'erb2haml', '~> 0.1.5'
  gem 'web-console'
end

group :test do
  gem 'capybara'
  gem 'cucumber-rails'
  gem 'database_cleaner-active_record'
  # gem 'database_cleaner-mongoid'
  # gem 'mongoid-rspec'
  gem 'selenium-webdriver'
  gem 'webdrivers'
  gem 'webmock'
end

group :development, :test do
  gem 'debug', '>= 1.0.0'
  gem 'rspec-rails'
  gem 'rubocop', '~> 1.54'
end


