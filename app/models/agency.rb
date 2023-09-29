# frozen_string_literal: true

# The Agency class represents a company or organization that employs users.
class Agency < ApplicationRecord
  include Cachable
  include Searchable

  set_cache_expiry 6.hours

  has_many :users

  scope :active, -> { where(deleted: false) }

  validates :name, :deleted, :specialty, :capacity, presence: true

  validates :specialty, inclusion: { in: SPECIALTIES }

  settings do
    mappings dynamic: 'false' do
      indexes :name, type: 'text', analyzer: 'english'
      indexes :description, type: 'text', analyzer: 'english'
      indexes :url, type: 'keyword'
      indexes :specialty, type: 'keyword'
      indexes :deleted, type: 'boolean'
      indexes :external_id, type: 'keyword'
    end
  end

  def slug
    "#{ENV['AWS_REGION' || 'us-west-2']}-#{name}"
  end
end
