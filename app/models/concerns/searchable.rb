# frozen_string_literal: true

require 'kaminari'
require 'elasticsearch/model'
require 'elasticsearch/dsl'

module Searchable
  extend ActiveSupport::Concern

  class_methods do
    if instance_methods.include?(:bbox)
      def search_within_bbox
        query = {
          query: {
            geo_shape: {
              bbox: { shape: bbox, relation: 'within' }
            }
          }
        }
        search(query)
      end
    end

    def search_field(field, query, page = 1)
      params = { query: { match: { "#{field}": query } } }
      __elasticsearch__.search(params).page(page).results.to_a.map(&:to_hash)
    end

    def search(query, page = 1)
      Elasticsearch::Model.search(query&.to_s, [self]).page(page).results.to_a.map(&:to_hash)
    end

    def search_with_other_models(query, models = [], page = 1)
      Elasticsearch::Model.search(query&.to_s, models.push(self)).page(page).results.to_a.map(&:to_hash)
    end

    def es_client
      __elasticsearch__.client
    end
  end

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include Elasticsearch::DSL
  end
end
