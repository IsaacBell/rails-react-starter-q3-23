# frozen_string_literal: true

# The ApplicationRecord class is the base class for all models in the application.
# It provides default behavior for models, such as database connectivity and attribute accessors.
class ApplicationRecord < ActiveRecord::Base
  scope :with_non_empty_string, ->(field) { where(Arel::Nodes::NamedFunction.new('LENGTH', [arel_table[field]]).gt(0)) }
end
