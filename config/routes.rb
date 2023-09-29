# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    # mount_devise_token_auth_for 'User', at: 'auth'
    resources :tasks, only: %i[index show create update destroy]
    resources :soapstones
    resources :commands
    resources :users
    # resources :users do
    #   resources :commands
    #   resources :soapstones
    # end
  end

  devise_for :users

  post 'upload', to: 'incidents#create', as: 'upload'
  root 'home#index'
end

if Rails.env.production?
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username),
                                                ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_USERNAME'])) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password),
                                                  ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_PASSWORD']))
  end
end
