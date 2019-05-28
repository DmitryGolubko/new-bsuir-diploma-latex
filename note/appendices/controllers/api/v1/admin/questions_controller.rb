# questions_controller.rb

module Api
  module V1
    module Admin
      class QuestionsController < BaseController
        before_action :find_question, only: %i[update show destroy]

        def create
          authorize_api Question do
            @question = Question.create(question_params)
            create_or_update_response
          end
        end

        def update
          authorize_api @question do
            @question.update(question_params)
            create_or_update_response
          end
        end

        def show
          render_response
        end

        def destroy
          authorize_api @question do
            @question.destroy
            render_response
          end
        end

        private

        def question_params
          params.require(:question).permit(
            :description,
            :answer_sample,
            :summary,
            position_ids: []
          )
        end

        def find_question
          @question = Question.find(params[:id])
        end

        def create_or_update_response
          if @question.valid?
            render_response
          else
            render_model_errors(:unprocessable_entity, @question)
          end
        end

        def render_response
          render json: @question, serializer: QuestionWithAssociationsSerializer, include: ['positions.department.name']
        end
      end
    end
  end
end
