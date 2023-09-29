# frozen_string_literal: true

module Api
  class UsersController < ApiController
    include JsonRenderable

    before_action :set_user, only: %i[show edit update destroy]
    render_json_for index: 'users', show: 'user', edit: 'user'

    def index; end
    def edit; end
    def show; end

    def create
      if (u = User.create(user_params))
        render json: u.serialize
      else
        render head: :unprocessable_entity
      end
    end

    def update
      if user&.update_attributes(user_params)
        render json: user.serialize
      else
        render head: :conflict
      end
    end

    def destroy
      if user&.delete
        render head: :ok
      else
        render head: :bad_request
      end
    end

    private

    def user
      @user ||= User.find_by_uid(params.require(:uid))&.serialize
    end

    def users
      @users ||= User.all.page(params.permit(:page)[:page] || 1).per(50)
    end

    def user_params
      params
        .require(:user)
        .permit(
          :uid, :email, :password, :password_conf, :phone, :newsletter_opt_in
        )
    end
  end
end
