# frozen_string_literal: true

require 'oj'

module Serializable
  extend ActiveSupport::Concern

  included do
    def serialize
      Oj.dump(to_h)
    rescue StandardError => e
      Rails.logger.error("Serialization Error: #{e.message}")
      nil
    end
  end

  class_methods do
    def deserialize(json_dump)
      Oj.load(json_dump)
    rescue StandardError => e
      Rails.logger.error("Deserialization Error: #{e.message}")
      nil
    end
  end
end
