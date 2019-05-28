# schema.rb

ActiveRecord::Schema.define(version: 20190225071319) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "aasm_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "aasm_loggable_type"
    t.bigint "aasm_loggable_id"
    t.string "from_state"
    t.string "to_state"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["aasm_loggable_type", "aasm_loggable_id"], name: "index_aasm_logs_on_aasm_loggable_type_and_aasm_loggable_id"
    t.index ["user_id"], name: "index_aasm_logs_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "department_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "department_id"
    t.bigint "role_id"
    t.index ["department_id"], name: "index_department_users_on_department_id"
    t.index ["role_id"], name: "index_department_users_on_role_id"
    t.index ["user_id", "department_id", "role_id"], name: "index_department_users_on_user_id_and_department_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_department_users_on_user_id"
  end

  create_table "departments", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.integer "office", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_departments_on_name", unique: true
  end

  create_table "position_questions", force: :cascade do |t|
    t.bigint "question_id"
    t.bigint "position_id"
    t.index ["position_id"], name: "index_position_questions_on_position_id"
    t.index ["question_id"], name: "index_position_questions_on_question_id"
  end

  create_table "positions", force: :cascade do |t|
    t.string "name"
    t.bigint "department_id"
    t.boolean "no_skills_matrix", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_positions_on_department_id"
    t.index ["name"], name: "index_positions_on_name"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id"
    t.jsonb "info"
    t.integer "status", default: 0
    t.bigint "parent_id"
    t.string "photo"
    t.index ["parent_id"], name: "index_profiles_on_parent_id"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
  end

  create_table "questions", force: :cascade do |t|
    t.text "description"
    t.string "summary"
    t.string "answer_sample"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rights_lists", force: :cascade do |t|
    t.jsonb "rights"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_rights_lists_on_role_id"
  end

  create_table "roles", force: :cascade do |t|
    t.integer "name", default: 0
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "skills", force: :cascade do |t|
    t.string "name"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_skills_on_category_id"
    t.index ["name"], name: "index_skills_on_name", unique: true
  end

  create_table "technologies", force: :cascade do |t|
    t.integer "technologable_id"
    t.string "technologable_type"
    t.bigint "skill_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["skill_id", "technologable_id", "technologable_type"], name: "index_technologies_on_skill_id_and_technologable", unique: true
    t.index ["skill_id"], name: "index_technologies_on_skill_id"
  end

  create_table "user_projects", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "project_id"
    t.text "role"
    t.text "responsibilities"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_user_projects_on_project_id"
    t.index ["user_id", "project_id"], name: "index_user_projects_on_user_id_and_project_id"
    t.index ["user_id"], name: "index_user_projects_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", default: "", null: false
    t.bigint "position_id"
    t.boolean "admin", default: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["position_id"], name: "index_users_on_position_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "department_users", "departments"
  add_foreign_key "department_users", "users"
  add_foreign_key "position_questions", "positions"
  add_foreign_key "position_questions", "questions"
  add_foreign_key "positions", "departments"
  add_foreign_key "profiles", "profiles", column: "parent_id"
  add_foreign_key "profiles", "users"
  add_foreign_key "skills", "categories"
  add_foreign_key "technologies", "skills"
  add_foreign_key "user_projects", "projects"
  add_foreign_key "user_projects", "users"
  add_foreign_key "users", "positions"
end
