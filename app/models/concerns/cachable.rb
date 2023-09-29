# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength

module Cachable
  extend ActiveSupport::Concern

  included do
    include Serializable

    cattr_accessor :cache_expiry do
      2.hours
    end

    def update(**attrs)
      out = super(attrs)
      cache_if_id_present(out)
      out
    end

    def delete
      with_cache_retrieval do
        update_attributes(deleted: true)
      end
      succeeded = save
      clear_from_cache if succeeded
      succeeded
    end

    alias_method :destroy, :delete

    private

    def cache_if_id_present(object)
      return unless object.id.present?

      Rails.cache.redis.set(object.cache_key, object.serialize)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end

    def clear_from_cache
      Rails.cache.redis.del(cache_key)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end
  end

  class_methods do
    def set_cache_expiry(time)
      self.cache_expiry = time
    end

    def find(id)
      with_cache_retrieval { super(id) }
    end

    def create(**attrs)
      out = super(attrs)
      cache_if_id_present(out)
      out
    end

    def with_cache_retrieval(key = cache_key)
      cached = Rails.cache.redis.get(key&.to_s)
      return cached if cached.present?

      yield
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
      yield
    end

    def cache_if_id_present(object)
      return unless object.id.present?

      Rails.cache.redis.set(object.cache_key, object.serialize)
    rescue StandardError => e
      Bugsnag.notify("Redis Error: #{e.message}")
    end
  end
end

# rubocop:enable Metrics/BlockLength
