# profile_unpacker.rb

class ProfileUnpacker

  def initialize(params)
    @profile = params[:profile]
    @info = @profile.info
    @user = @profile.user
    @department = Department.find(@info['professional_profile_department']["value"])
    @position = Position.find(@info['professional_profile_position']["value"])
  end

  def unpack
    update_user
    update_departments
    update_projects
  end

  def update_user
    name = "#{@info['personal_information_name']} #{@info['personal_information_surname']}"
    @user.update_attributes(position: @position, name: name)
  end

  def update_departments
    DepartmentUser.where(user: @user, role: Role.employee.first).delete_all
    DepartmentUser.create!(user: @user, department: @department, role: Role.employee.first)
  end

  def update_projects
    projects_info = @info['sumato_projects']
    UserProject.where(user: @user).delete_all

    projects_info.each do |project_info|
      project = Project.find_by(title: project_info['name'])
      UserProject.create!(
        user: @user, 
        project: project,
        role: project_info['role'],
        responsibilities: project_info['responsibilities']
        )
    end
  end

end
