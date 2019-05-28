# projects_controller.rb

module Api
  module V1
    module Admin
      class ProjectsController < BaseController
        before_action :find_project, only: %i[update show destroy]

        def create
          authorize_api Project do
            @project = Project.create(project_params)
            if @project.valid?
              ProfilePacker.new.pack_project(@project, [], @project.users.to_a)
              render_project
            else
              render_model_errors(:unprocessable_entity, @project)
            end
          end
        end

        # rubocop:disable Metrics/AbcSize
        def update
          authorize_api @project do
            users_was = @project.users.to_a
            @project.update(project_params)
            errors = []
            errors = @project.errors.full_messages if @project.invalid?
            @project.reload
            ProfilePacker.new.pack_project(@project, users_was, @project.users.to_a) if errors.empty?

            if errors.present?
              render_error(:unprocessable_entity, errors)
            else
              render_project
            end
          end
        end
        # rubocop:enable Metrics/AbcSize

        def show
          authorize_api @project do
            render_project
          end
        end

        def destroy
          authorize_api @project do
            @project.destroy
            render_project
          end
        end

        private

        def render_project
          render json: @project, serializer: ProjectWithAssociationsSerializer,
                 include: 'technologies.skill.category,user_projects.technologies'
        end

        def find_project
          @project = Project.includes(technologies: { skill: :category }).find(params[:id])
        end

        def project_params
          params.require(:project).permit(
            :title,
            :description,
            :status,
            user_projects_attributes: %i[id user_id responsibilities role _destroy],
            technologies_names: []
          )
        end
      end
    end
  end
end
