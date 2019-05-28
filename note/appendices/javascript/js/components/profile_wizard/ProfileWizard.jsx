// ProfileWizard.jsx

import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Wizard, Steps, Step } from 'react-albus';
import moment from 'moment';
import classNames from 'classnames';
import { ToastStore } from 'react-toasts';
import _ from 'lodash';
import ProfileWizardStep1 from './ProfileWizardStep1';
import ProfileWizardStep2 from './ProfileWizardStep2';
import ProfileWizardStep3 from './ProfileWizardStep3';
import ProfileWizardStep4 from './ProfileWizardStep4';
import ProfilePreview from '../pages/ProfilePreview';
import { Profile, Skill, ProfileRulesBuilder } from './Profile';
import { getUsersList } from '../../actions';
import { updateProfile, uploadProfilePhoto } from '../../api/profiles';
import { updateProfileAndModerate } from '../../api/profiles_moderation';
import { FormValidator } from '../validations/FormValidator';
import Transition from './Transition';
import WizardNav from './WizardNav';
import { fetchPositionQuestions } from '../../api/positions';


class ProfileWizard extends React.Component {

  constructor(props) {
    super(props);

    const steps =  [
      {
        title:       'Step 1',
        description: 'Personal Information',
        id:          'personal_info',
      },
      {
        title:       'Step 2',
        description: 'Previous Experience',
        id:          'previous_experience',
      },
      {
        title:       'Step 3',
        description: 'SumatoSoft Experience',
        id:          'sumato_experience',
      },
      {
        title:       'Step 4',
        description: 'Skills Matrix',
        id:          'skills_matrix',
      },
      {
        title:       'Step 5',
        description: 'Profile Preview',
        id:          'profile_preview',
      }
    ];

    const { profile, email } = this.props;
    const state = {
      profileInfo:     !_.isEmpty(profile.info) ? profile.info : new Profile({ email }),
      steps,
      validation:      null,
      currentStepInd:  0,
      visitedStepsMap: steps.map((_step, ind) => { return ind === 0; }),
      photo:           profile.photo,
      file:            null,
    };

    this.state = state;

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);

    this.onInputChange = this.onInputChange.bind(this);
    this.onArrayExtend = this.onArrayExtend.bind(this);
    this.onArrayItemChange = this.onArrayItemChange.bind(this);
    this.setQuestionsAnswers = this.setQuestionsAnswers.bind(this);
    this.onDepartmentChange = this.onDepartmentChange.bind(this);
    this.generateSkillsMatrix = this.generateSkillsMatrix.bind(this);
    this.onSkillsMatrixItemChange = this.onSkillsMatrixItemChange.bind(this);
    this.onArrayItemRemove = this.onArrayItemRemove.bind(this);

    this.sumatoProjectsDataToProfile = this.sumatoProjectsDataToProfile.bind(this);

    this.technologiesOptions = this.technologiesOptions.bind(this);
    this.positionsOptions = this.positionsOptions.bind(this);
    this.departmentsOptions = this.departmentsOptions.bind(this);

    this.isFrontOffice = this.isFrontOffice.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
    this.markStateAsVisited = this.markStateAsVisited.bind(this);

    this.addSkill = this.addSkill.bind(this);
    this.deleteSkill = this.deleteSkill.bind(this);

    this.onPhotoSelected = this.onPhotoSelected.bind(this);
    this.onCrop = this.onCrop.bind(this);
  }

  onPhotoSelected(files) {
    if (files && files[0]) {
      const [file] = files;
      file.blob = URL.createObjectURL(files[0]);
      this.setState({ file, photo: null });
    }
  }

  onCrop(cropper) {
    cropper.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData();
      const { file } = this.state;
      const { profile } = this.props;
      formData.append('photo', blob, `${file.name.split('.')[0]}_${moment().format()}.jpg`);
      uploadProfilePhoto(profile.id, formData)
        .then((res) => {
          this.setState({ photo: res.data.photo, file: null });
        });
    }, 'image/jpeg');
  }

  static getSkillLevel(experience) {
    switch (experience) {
      case '0':
      case '1':
        return 'novice';
      case '2':
        return 'intermediate';
      case '3':
        return 'advanced';
      default:
        return 'expert';
    }
  }

  onNext(context) {
    const { currentStepInd, steps } = this.state;
    this.validate(() => {
      const { validation } = this.state;
      const { editedByOwner } = this.props;
      if (validation.isValid) {
        if (editedByOwner && this.isLastStep()) {
          this.sendToModeration();
        } else if (!editedByOwner && this.isLastStep()) {
          this.managerProfileUpdate();
        } else {
          this.saveProfile();
        }
        const transition = new Transition({
          context,
          steps,
          position:      this.getPosition(),
          isFrontOffice: this.isFrontOffice(),
          currentStepInd,
        });

        const nextStepId = transition.next();
        this.markStateAsVisited(nextStepId);
        this.setState({ currentStepInd: nextStepId });
      }
    });
  }

  onPrevious(context) {
    const { currentStepInd, steps } = this.state;
    const transition = new Transition({
      context,
      steps,
      position:      this.getPosition(),
      isFrontOffice: this.isFrontOffice(),
      currentStepInd,
    });

    const nextStepId = transition.prev();
    this.setState({ currentStepInd: nextStepId });
  }

  onGoTo(context, stepId) {
    const { currentStepInd, steps, visitedStepsMap } = this.state;
    const transition = new Transition({
      context,
      steps,
      position:      this.getPosition(),
      isFrontOffice: this.isFrontOffice(),
      currentStepInd,
      visitedStepsMap,
    });
    const nextStepId = transition.goTo(stepId);
    this.setState({ currentStepInd: nextStepId });
  }

  onInputChange(event, callback) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo, [event.target.name]: event.target.value };

    if (_.isFunction(callback)) {
      this.setState({ profileInfo: newProfileInfo }, callback);
    } else {
      this.setState({ profileInfo: newProfileInfo });
    }
  }

  onArrayExtend(arr, newItem) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    newProfileInfo[arr] = [...newProfileInfo[arr], newItem];

    this.setState({ profileInfo: newProfileInfo });
  }

  onArrayItemRemove(arr, ind) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    newProfileInfo[arr].splice(ind, 1);
    this.setState({ profileInfo: newProfileInfo });
  }

  onArrayItemChange(arr, ind, field, value) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    newProfileInfo[arr][ind][field] = value;
    this.setState({ profileInfo: newProfileInfo });
  }

  onSkillsMatrixItemChange(ind, field, value) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    const skill = newProfileInfo.skills_matrix.list[ind];
    skill[field] = value;

    if (field === 'name') {
      const technology = _.find(this.chosenPositionTechnologiesList(), (tech) => {
        return tech.skill.name === value.value;
      });
      skill.group = technology.skill.group;
      newProfileInfo.skills_matrix.groups = _.uniq(newProfileInfo.skills_matrix.list.map((skil) => {
        return skil.group;
      }));
    }

    if (field === 'experience' && !_.isEmpty(value)) {
      const level = ProfileWizard.getSkillLevel(skill.experience);
      skill.level = { value: level, label: level };
    }
    this.setState({ profileInfo: newProfileInfo });
  }

  // onTechnologyCreate(_projectInd, newTechnology) {
  //   const { dispatch } = this.props;
  //   dispatch(createTechnology({ group: '', name: newTechnology }));
  // }

  onDepartmentChange() {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    const department = this.getDepartment();
    newProfileInfo.professional_profile_position = { label: '', value: '' };
    newProfileInfo.professional_profile_office = department.office;
    this.setState({ profileInfo: newProfileInfo }, () => { return this.setQuestionsAnswers(); });
  }

  getPosition() {
    const { profileInfo } = this.state;
    const { positionsList } = this.props;
    const positionId = _.get(profileInfo.professional_profile_position, 'value', '');
    return _.find(positionsList, { id: positionId });
  }

  getDepartment() {
    const { profileInfo } = this.state;
    const { departmentsList } = this.props;
    const departmentId = _.get(profileInfo.professional_profile_department, 'value', '');
    return _.find(departmentsList, { id: departmentId });
  }

  setQuestionsAnswers() {
    const { profileInfo } = this.state;
    const departmentId = _.get(profileInfo.professional_profile_department, 'value', null);
    const positionId = _.get(profileInfo.professional_profile_position, 'value', null);
    const newProfileInfo = { ...profileInfo };
    if (_.isNumber(departmentId) && _.isNumber(positionId)) {
      const { positionsList } = this.props;
      const position = _.find(positionsList, { id: positionId });
      if (position.no_skills_matrix) {
        newProfileInfo.skills_matrix = {};
      }

      if (this.isFrontOffice()) {
        newProfileInfo.previous_projects = [];
        newProfileInfo.sumato_projects = [];
      }
      let questionsAnswers = [];
      fetchPositionQuestions(positionId).then((res) => {
        questionsAnswers = res.data.map((question) => {
          return {
            question:      question.description,
            answer:        '',
            answer_sample: question.answer_sample,
            summary:       question.summary,
          };
        });
        newProfileInfo.professional_profile_questions_answers = questionsAnswers;
        this.setState({ profileInfo: newProfileInfo });
      });
    } else {
      newProfileInfo.professional_profile_questions_answers = [];
      this.setState({ profileInfo: newProfileInfo });
    }
  }

  positionsOptions() {
    const { profileInfo } = this.state;
    const { positionsList } = this.props;
    const departmentId = _.get(profileInfo.professional_profile_department, 'value', '');
    return positionsList.filter((position) => { return position.department_id === departmentId; })
      .map((position) => {
        return { value: position.id, label: position.name };
      });
  }

  sumatoProjectsDataToProfile() {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    const { projectsList } = this.props;

    newProfileInfo.sumato_projects.forEach((sumatoProject) => {
      const projectInfo = _.find(projectsList, { id: sumatoProject.project.value });
      if (!_.isEmpty(projectInfo)) {
        // eslint-disable-next-line no-param-reassign
        sumatoProject.name = projectInfo.title;
        // eslint-disable-next-line no-param-reassign
        sumatoProject.description = projectInfo.description;
      }
    });
    this.setState({ profileInfo: newProfileInfo });
  }

  deleteSkill(ind) {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    newProfileInfo.skills_matrix.list.splice(ind, 1);
    newProfileInfo.skills_matrix.groups = _.uniq(newProfileInfo.skills_matrix.list.map((skill) => {
      return skill.group;
    }));

    this.setState({ profileInfo: newProfileInfo });
  }

  addSkill() {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    const group = 'UNCATEGORIZED';
    const skill = new Skill({
      name:       { value: '', label: '' },
      group,
      experience: '',
      level:      { value: '', label: '' },
      lastUsed:   { value: '', label: '' },
    });
    newProfileInfo.skills_matrix.list.push(skill);
    newProfileInfo.skills_matrix.groups = _.union(newProfileInfo.skills_matrix.groups, [group]);

    this.setState({ profileInfo: newProfileInfo });
  }

  generateSkillsMatrix() {
    const { profileInfo } = this.state;
    const newProfileInfo = { ...profileInfo };
    const projects = [...newProfileInfo.sumato_projects, ...newProfileInfo.previous_projects];
    const technologiesNames =  _.uniqBy(
      _.flatten(projects.map((project) => {
        return project.technologies.map((technology) => {
          return technology.value;
        });
      }))
    );
    const technologies = this.chosenPositionTechnologiesList().filter((technology) => {
      return technologiesNames.includes(technology.skill.name);
    });
    newProfileInfo.skills_matrix.groups = _.uniq(
      technologies.map((technology) => {
        return !_.isEmpty(technology.skill.group) ? technology.skill.group : 'UNCATEGORIZED';
      })
    );
    newProfileInfo.skills_matrix.list = [];
    technologies.forEach((technology) => {
      const projectsWithTech = projects.filter((project) => {
        return _.find(project.technologies, { value: technology.skill.name });
      });
      const firstUsed = moment(moment.min(projectsWithTech.map((project) => {
        return moment(project.start_date);
      })));
      const lastUsed = moment(moment.max(projectsWithTech.map((project) => {
        return _.isEmpty(project.end_date) ? moment() : project.end_date;
      })));
      let experience = moment.duration(lastUsed.diff(firstUsed)).years() || 1;
      experience = experience.toString();

      const level = ProfileWizard.getSkillLevel(experience);

      const skill = new Skill({
        name:      { label: technology.skill.name, value: technology.skill.name },
        group:     technology.skill.group,
        experience,
        level:     { value: level, label: level },
        last_used: { value: lastUsed.year(), label: lastUsed.year() },
      });
      newProfileInfo.skills_matrix.list.push(skill);
    });
    this.setState({ profileInfo: newProfileInfo });
  }

  nextStep() {
    const { currentStepInd, steps } = this.state;
    return steps[currentStepInd + 1];
  }

  saveProfile() {
    const { editedByOwner, profile } = this.props;
    const { profileInfo } = this.state;
    const status = editedByOwner ? 'draft' : profile.status;
    updateProfile(profile.id, profileInfo, status);
  }

  sendToModeration() {
    const { profile } = this.props;
    const { profileInfo } = this.state;
    updateProfileAndModerate(profile.id, profileInfo, 'tech')
      .then(() => {
        ToastStore.success('Profile sent to Tech manager');
        this.navigateAfterSave();
      });
  }

  navigateAfterSave() {
    const { dispatch, history, navigateAfter } = this.props;
    dispatch(getUsersList());
    history.push(navigateAfter);
  }

  managerProfileUpdate() {
    const { profile } = this.props;
    const { profileInfo } = this.state;
    if (profile.status === 'tech') {
      updateProfileAndModerate(profile.id, profileInfo, 'hr')
        .then(() => {
          ToastStore.success('Profile sent to HR manager');
          this.navigateAfterSave();
        });
    } else if (profile.status === 'hr') {
      updateProfileAndModerate(profile.id, profileInfo, 'sales')
        .then(() => {
          ToastStore.success('Profile sent to Sales manager');
          this.navigateAfterSave();
        });
    } else if (profile.status === 'sales') {
      updateProfile(profile.id, profileInfo, 'approved')
        .then(() => {
          ToastStore.success('Profile is approved');
          this.navigateAfterSave();
        });
    } else if (profile.status === 'copy') {
      updateProfile(profile.id, profileInfo, 'copy')
        .then(() => {
          ToastStore.success('Profile copy was updated');
          this.navigateAfterSave();
        });
    } else if (profile.status === 'approved') {
      updateProfile(profile.id, profileInfo, 'approved')
        .then(() => {
          ToastStore.success('Profile is updated');
          this.navigateAfterSave();
        });
    }
  }

  isFrontOffice() {
    const { profileInfo } = this.state;
    return profileInfo.professional_profile_office === 'Front Office';
  }

  isLastStep() {
    const { currentStepInd, steps } = this.state;
    return currentStepInd === steps.length - 1;
  }

  markStateAsVisited(stepInd) {
    const { visitedStepsMap } = this.state;
    visitedStepsMap[stepInd] = true;
    this.setState({ visitedStepsMap });
  }

  chosenPositionTechnologiesList() {
    const { profileInfo } = this.state;
    const { technologiesList } = this.props;

    return technologiesList.filter((technology) => {
      return technology.technologable.id === profileInfo.professional_profile_position.value;
    });
  }

  validate(callback) {
    const { profileInfo, currentStepInd } = this.state;
    const { profile } = this.props;
    const technologyList = this.chosenPositionTechnologiesList();
    const rulesBuilder = new ProfileRulesBuilder(profileInfo, currentStepInd, technologyList, profile.status);
    const validator = new FormValidator(rulesBuilder.rules());
    const validation = validator.validate(profileInfo);

    this.setState({ validation }, callback);
  }

  technologiesOptions() {
    const { profileInfo } = this.state;
    const { technologiesList } = this.props;
    return technologiesList.filter((technology) => {
      return technology.technologable.id === profileInfo.professional_profile_position.value;
    }).map((technology) => {
      return { value: technology.skill.name, label: technology.skill.name };
    });
  }

  departmentsOptions() {
    const { departmentsList } = this.props;
    return departmentsList.map((department) => {
      return { value: department.id, label: department.name };
    });
  }

  renderNavButtons(context) {
    const { currentStepInd } = this.state;

    return (
      <div className="row">
        {
          currentStepInd !== 0
          && (
            <div className="col-md-6">
              <button
                onClick={() => { this.onPrevious(context); }}
                type="button"
                className="btn btn-primary btn-lg pull-left"
              >
                Previous
              </button>
            </div>
          )
        }
        {
          <div className={classNames({ 'col-md-6': currentStepInd !== 0, 'col-md-12': currentStepInd === 0 })}>
            <button
              onClick={() => { this.onNext(context); }}
              type="button"
              className="btn btn-primary btn-lg pull-right"
            >
              Next
            </button>
          </div>
        }
      </div>
    );
  }


  render() {
    const {
      technologiesList,
      projectsList,
      positionsList,
      departmentsList,
      currentUser,
    } = this.props;

    const {
      currentStepInd, visitedStepsMap, steps, profileInfo, validation, photo, file,
    } = this.state;
    const { editedByOwner, profile } = this.props;

    const propsReady = !_.isEmpty(technologiesList)
      && !_.isEmpty(projectsList)
      && !_.isEmpty(positionsList)
      && !_.isEmpty(departmentsList)
      && !_.isEmpty(currentUser);

    return propsReady && (
      <div className="row wizard-container">
        <div className="col-md-offset-2 col-md-8">
          <Wizard>
            <WizardNav
              currentStepId={currentStepInd}
              onGoTo={this.onGoTo}
              visitedStepsMap={visitedStepsMap}
              steps={steps}
            />
            <Steps>
              <Step
                id="personal_info"
                render={(context) => {
                  return (
                    <div className="step-view">
                      <ProfileWizardStep1
                        profileInfo={profileInfo}
                        lastChanges={profile.last_changes}
                        onInputChange={this.onInputChange}
                        onArrayExtend={this.onArrayExtend}
                        onArrayItemChange={this.onArrayItemChange}
                        onArrayItemRemove={this.onArrayItemRemove}
                        setQuestionsAnswers={this.setQuestionsAnswers}
                        positionsOptions={this.positionsOptions}
                        departmentsOptions={this.departmentsOptions}
                        validation={validation}
                        onDepartmentChange={this.onDepartmentChange}
                        editedByOwner={editedByOwner}
                        photo={photo}
                        onPhotoSelected={this.onPhotoSelected}
                        onCrop={this.onCrop}
                        blob={_.get(file, 'blob')}
                      />
                      {this.renderNavButtons(context)}
                    </div>
                  );
                }}
              />
              <Step
                id="previous_experience"
                render={(context) => {
                  return (
                    <div className="step-view">
                      <ProfileWizardStep2
                        profileInfo={profileInfo}
                        lastChanges={profile.last_changes}
                        onInputChange={this.onInputChange}
                        onArrayExtend={this.onArrayExtend}
                        onArrayItemChange={this.onArrayItemChange}
                        onArrayItemRemove={this.onArrayItemRemove}
                        onTechnologyCreate={this.onTechnologyCreate}
                        technologiesOptions={this.technologiesOptions}
                        validation={validation}
                        isFrontOffice={this.isFrontOffice}
                        editedByOwner={editedByOwner}
                      />
                      {this.renderNavButtons(context)}
                    </div>
                  );
                }}
              />
              <Step
                id="sumato_experience"
                render={(context) => {
                  return (
                    <div className="step-view">
                      <ProfileWizardStep3
                        profileInfo={profileInfo}
                        lastChanges={profile.last_changes}
                        onInputChange={this.onInputChange}
                        onArrayExtend={this.onArrayExtend}
                        onArrayItemChange={this.onArrayItemChange}
                        onArrayItemRemove={this.onArrayItemRemove}
                        onTechnologyCreate={this.onTechnologyCreate}
                        technologiesOptions={this.technologiesOptions}
                        projectsList={projectsList}
                        sumatoProjectsDataToProfile={this.sumatoProjectsDataToProfile}
                        validation={validation}
                        editedByOwner={editedByOwner}
                      />
                      {this.renderNavButtons(context)}
                    </div>
                  );
                }}
              />
              <Step
                id="skills_matrix"
                render={(context) => {
                  return (
                    <div className="step-view">
                      <ProfileWizardStep4
                        profileInfo={profileInfo}
                        lastChanges={profile.last_changes}
                        onSkillsMatrixItemChange={this.onSkillsMatrixItemChange}
                        generateSkillsMatrix={this.generateSkillsMatrix}
                        technologiesOptions={this.technologiesOptions}
                        addSkill={this.addSkill}
                        deleteSkill={this.deleteSkill}
                        editedByOwner={editedByOwner}
                        validation={validation}
                      />
                      {this.renderNavButtons(context)}
                    </div>
                  );
                }}
              />
              <Step
                id="profile_preview"
                render={(context) => {
                  return (
                    <div className="step-view">
                      <ProfilePreview
                        profile={
                          {
                            info:   profileInfo,
                            status: profile.status,
                            photo,
                          }
                        }
                      />
                      {this.renderNavButtons(context)}
                    </div>
                  );
                }}
              />
            </Steps>
          </Wizard>
        </div>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    technologiesList: state.technologiesList,
    projectsList:     state.projectsList,
    positionsList:    state.positionsList,
    departmentsList:  state.departmentsList,
    currentUser:      state.currentUser,
  };
};

export default connect(mapStateToProps)(withRouter(ProfileWizard));
