# profile_packer.rb

class ProfilePacker
  def pack_project(project, users_was, users)
    if users.count > users_was.count
      users_add_to = users - users_was
      users_add_to.each do |user|
        add_project_to_profile(user, project)
      end
    elsif users.count < users_was.count
      users_remove_from = users_was - users
      users_remove_from.each do |user|
        remove_project_from_profile(user, project)
      end
    end
  end

  private

  def add_project_to_profile(user, project)
    profile = user.base_profile
    user_project = UserProject.find_by(user: user, project: project)

    profile.info['sumato_projects'] ||= []
    profile.info['sumato_projects'].delete_if { |proj| proj['name'] == project.title }

    profile_proj = {
      name: project.title,
      role: user_project.role,
      company: 'SumatoSoft',
      project: {
        label: project.title,
        value: project.id
      },
      # TODO: add to project create/edit page datepickers for users
      end_date: '',
      start_date: Time.now.to_s,
      description: project.description,
      responsibilities: user_project.responsibilities
    }

    profile_proj[:technologies] = project.technologies.includes(:skill).map do |technology|
      { value: technology.skill.name, label: technology.skill.name }
    end

    profile.info['sumato_projects'] << profile_proj
    profile.save!
  end

  def remove_project_from_profile(user, project)
    profile = user.base_profile
    profile.info['sumato_projects'].delete_if { |proj| proj['name'] == project.title }
    profile.save!
  end
end
