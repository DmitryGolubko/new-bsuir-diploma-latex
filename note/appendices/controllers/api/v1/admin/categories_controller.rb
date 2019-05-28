# categories_controller.rb

module Api
  module V1
    module Admin
      class CategoriesController < BaseController
        before_action :find_category, only: %i[update show destroy]

        def index
          @categories = Category.includes(:skills)
          render json: @categories
        end

        def create
          authorize_api Category do
            @category = Category.create(category_params)

            create_or_update_response
          end
        end

        def update
          authorize_api(@category, error_msg: "Can't delete skills. Some of them in use.",
                                   options: { skills_attributes: params[:category][:skills_attributes] }) do
            @category.update(category_params)

            create_or_update_response
          end
        end

        def show
          authorize_api @category do
            render json: @category
          end
        end

        def destroy
          authorize_api @category, error_msg: "Can't delete category. Some skills may be used." do
            @category.destroy

            render json: @category
          end
        end

        private

        def find_category
          @category = Category.includes(skills: [:technologies]).find(params[:id])
        end

        def create_or_update_response
          if @category.valid?
            render json: @category
          else
            render_model_errors(:unprocessable_entity, @category)
          end
        end

        def category_params
          params.require(:category).permit(:id, :name,
            skills_attributes: %i[id name _destroy])
        end
      end
    end
  end
end
