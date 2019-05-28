# routes.rb

Rails.application.routes.draw do
  devise_for :users

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  authenticated :user, lambda { |user| user.admin? } do
    require 'sidekiq/web'
    mount Sidekiq::Web => '/sidekiq'
  end

  root to: 'home#index'
  get 'front/*path', to: 'home#index'
  namespace :api do
    namespace :v1 do
      namespace :admin, defaults: { format: :json } do
        resources :users, only: %i[index]
        resources :profile_copies, except: %i[new]
        resources :statuses, only: %i[index]
        resources :skills, only: %i[index]
        resources :roles, only: %i[index]
        resources :rights, only: %i[index update]
        resources :departments, only: %i[create show update destroy]
        resources :questions, only: %i[create update show destroy]
        resources :projects
        resources :positions, except: %i[new]
        resources :categories, except: %i[new]
        post 'departments_managers', to: 'department_users#create_managers'
        get 'managers', to: 'department_users#managers'
        get 'rights/rights_all', to: 'rights#rights_all'
      end
      resources :current_user, only: %i[index]
      resources :users, only: %i[show]
      resources :technologies, only: [:index]
      resources :departments, only: %i[index]
      resources :positions, only: %i[index] do
        resources :questions, only: %i[index], controller: 'positions/questions'
      end
      resources :projects, only: [:index]
      resources :profiles, only: %i[create update show]
      resources :questions, only: %i[index]
      resources :profiles_moderation, only: %i[update]
      resources :cv, only: %i[show]
      resources :profile_photo, only: %i[update]
    end
  end
end
