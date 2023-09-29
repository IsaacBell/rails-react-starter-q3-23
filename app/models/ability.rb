# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    if user.admin?
      can :manage, :all
      can :read, :all
      cannot :delete, :all
    else
      cannot :manage, :all
    end
  end
end
