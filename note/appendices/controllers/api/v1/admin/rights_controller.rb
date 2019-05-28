#rights_controller.rb

module Api
  module V1
    module Admin
      class RightsController < BaseController
        def index
          authorize_api RightsList do
            @rights = RightsList.all
            render json: @rights
          end
        end

        def update
          authorize_api @right do
            @right = RightsList.find(params[:id])
            @right.update(rights_params)

            @rights = RightsList.all
            render json: @rights
          end
        end

        def rights_all
          authorize_api RightsList do
            render json: RightsList::RIGHTS.map { |right| [right, I18n.t(right)] }
          end
        end

        private

        def rights_params
          params.require(:roleRights).permit(:role_id, rights: [])
        end
      end
    end
  end
end
