# profile_moderation_service.rb

class ProfileModerationService
  def initialize(params)
    @user = params[:user]
    @profile = params[:profile]
    @base_url = params[:base_url]
  end

  def assign_department
    dep_name = @profile.info['professional_profile_department']['label']
    @department = Department.find_by(name: dep_name)
  end

  def moderate
    @status = @profile[:status]
    assign_department
    # return department manager due to status profile status
    manager = @department.public_send(@status)
    ModerationMailer.notify_manager(manager, @user, @base_url).deliver_later
  end
end
