# profile_copies_controller.rb

module Api
  module V1
    module Admin
      class ProfileCopiesController < BaseController
        before_action :find_profile, only: %i[show destroy]

        def create
          authorize_api Profile do
            @parent = Profile.find(params[:id])
            @profile = @parent.dup
            @profile.update(parent_id: @parent.id)
            @profile.copy!

            if @profile.valid?
              render json: @profile
            else
              render_model_errors(:unprocessable_entity, @profile)
            end
          end
        end

        def index
          authorize_api Profile do
            @profiles = Profile.copies.includes(user: :position)
            render json: @profiles, include: ['user.position']
          end
        end

        def show
          authorize_api @profile do
            render json: @profile
          end
        end

        def destroy
          authorize_api @profile do
            @profile.destroy
            render json: @profile
          end
        end

        private

        def find_profile
          @profile = Profile.find(params[:id])
        end

      end
    end
  end
end
