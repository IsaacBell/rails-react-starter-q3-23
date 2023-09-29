# frozen_string_literal: true

class ApplicationController < ActionController::Base
  rescue_from StandardError, with: :report_error
  before_bugsnag_notify :add_diagnostics_to_bugsnag

  protected

  def with_cache_retrieval(key)
    cached = Rails.cache.redis.get(key)
    return cached if cached.present?

    yield
  end

  def with_cache_storage(key, val)
    cached = Rails.cache.redis.set(key, val)

    yield

    cached
  end

  def current_user
    auth
  end

  def auth
    return @auth_data if @auth_data.present?

    token = decode_jwt(params[:token])

    @auth_data = token[0]
    @auth_metadata = token[1]
    # @geolocation = auth_data['geolocation']
    # @example = auth_data['example']

    reject_unauthorized_connection unless @auth_data.present?

    @auth_data
  end

  def encode_jwt(payload)
    JWT.encode(
      payload,
      Rails.application.secrets.secret_key_base,
      'HS256'
    )
  end

  def decode_jwt(token)
    JWT.decode(
      token,
      Rails.application.secrets.secret_key_base,
      true,
      { algorithm: 'HS256' }
    )
  end

  private

  def report_error(exception)
    Bugsnag.notify(exception)
    # rubocop:disable Style/SingleLineMethods
    exception.instance_eval { def skip_bugsnag; true; end }
    # rubocop:enable Style/SingleLineMethods

    # Now this won't be sent a second time by the exception handlers
    raise exception
  end

  def add_diagnostics_to_bugsnag(event)
    event.add_metadata(:diagnostics, {add_custom_attrs: 'here'} })
  end
end
