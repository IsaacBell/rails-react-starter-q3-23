# frozen_string_literal: true

# Represents a user of the application.
class User < ApplicationRecord
  include Cachable
  include Serializable

  paginates_per 50

  USER_TYPES = %w[responder investigator admin user].freeze

  # devise :database_authenticatable, :registerable,
  #        :recoverable, :rememberable, :trackable, :validatable

  belongs_to :agency, optional: true

  scope :active, -> { where(deleted: false) }

  validates :email, :radar_user_id, :device_id, presence: true
  validates :uid, uniqueness: { scope: :provider_id }
  validates :email, uniqueness: true
  validates :type, inclusion: { in: USER_TYPES }
  validate :ensure_responder_has_agency

  index({ phone: 'text' })
  index({ email: 1 }, { unique: true })
  index({ uid: 1, provider: 1 }, { unique: true })

  USER_TYPES.each do |type|
    type = type.to_s.demodulize.parameterize
    scope :"#{type.pluralize}", -> { where(type:) }
    scope :"active_#{type.pluralize}", -> { active.where(type:) }

    define_method("#{type}?") do
      self.type == type
    end
  end

  def self.find(id)
    active.where(id:).to_a.first
  end

  def self.find_by_uid(uid)
    active.where(uid:).to_a.first
  end

  def self.find_by_name(name)
    active.where(name:).to_a.first
  end
end
