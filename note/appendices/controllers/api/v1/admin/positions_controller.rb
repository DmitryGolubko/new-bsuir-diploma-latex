# positions_controller.rb

module Api
  module V1
    module Admin
      class PositionsController < BaseController
        before_action :find_position, only: %i[update show destroy]

        def create
          authorize_api @position do
            @position = Position.create(position_params)
            create_or_update_response
          end
        end

        def update
          authorize_api @position do
            @position.update(position_params)
            create_or_update_response
          end
        end

        def show
          authorize_api @position do
            render json: @position
          end
        end

        def destroy
          authorize_api @position, error_msg: "Can't delete position, it has related users." do
            @position.destroy
            render json: @position
          end
        end

        private

        def create_or_update_response
          if @position.valid?
            render json: @position
          else
            render_model_errors(:unprocessable_entity, @position)
          end
        end

        def find_position
          @position = Position.find(params[:id])
        end

        def position_params
          params.require(:position).permit(:name, :department_id, technologies_attributes:
            %i[id skill_id technologable_id _destroy])
        end
      end
    end
  end
end
