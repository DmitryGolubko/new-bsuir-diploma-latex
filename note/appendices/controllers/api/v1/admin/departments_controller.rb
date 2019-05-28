# departments_controller.rb

module Api
  module V1
    module Admin
      class DepartmentsController < BaseController
        before_action :find_department, only: %i[update show destroy]

        def create
          authorize_api Department do
            @department = Department.create(department_params)
            create_or_update_response
          end
        end

        def show
          authorize_api @department do
            render json: @department, serializer: DepartmentWithAssociationsSerializer
          end
        end

        def update
          authorize_api @department do
            @department.update(department_params)
            create_or_update_response
          end
        end

        def destroy
          authorize_api @department, error_msg: "Can't delete department, please delete it's positions before." do
            @department.destroy
            render json: @department
          end
        end

        private

        def create_or_update_response
          if @department.valid?
            render json: @department
          else
            render_model_errors(:unprocessable_entity, @department)
          end
        end

        def find_department
          @department = Department.includes(department_users: { user: :position }).find(params[:id])
        end

        def department_params
          params.require(:department).permit(:name, :office)
        end
      end
    end
  end
end
