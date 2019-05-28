# department_users_controller.rb

module Api
  module V1
    module Admin
      class DepartmentUsersController < BaseController
        def create_managers
          authorize_api DepartmentUser do
            DepartmentUser.where.not(role: Role.employee).destroy_all
            @managers = DepartmentUser.create!(department_managers_params)
            render json: @managers
          end
        end

        def managers
          authorize_api DepartmentUser do
            @managers = DepartmentUser.includes(user: :position).where.not(role: Role.employee)
            render json: @managers
          end
        end

        private

        def department_managers_params
          params.permit(departmentManagers: %i[department_id role_id user_id]).require(:departmentManagers)
        end
      end
    end
  end
end
