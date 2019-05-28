//profile.js

import moment from 'moment'
import validator from 'validator'
import _ from 'lodash'

export class Company {
  constructor() {
    this.start_year = {value: '', label: ''}
    this.end_year =   {value: '', label: ''}
    this.name = ''
  }
}

export class Project {
  constructor({company=''}) {
    this.name = ''
    this.description = ''
    this.responsibilities = ''
    this.start_date = moment()
    this.end_date = ''
    this.period = ''
    this.role = ''
    this.technologies = []
    this.company = company
    this.project = {value: '', label: ''}
  }

}


export class Education {
  constructor() {
    this.start_year = {value: '', label: ''}
    this.end_year = {value: '', label: ''}
    this.university_courses = ''
    this.specialization = ''
    this.degree_acquired = ''
  }
}

export class Skill {
  constructor({name='', group='', experience='', level='', last_used=''}) {
    this.name = name
    this.group = group
    this.experience = experience
    this.level = level
    this.last_used = last_used
  }
}

export class Profile {
  constructor({email=''}) {
    this["personal_information_name"] = '',
    this["personal_information_surname"] = '',
    this["personal_information_birth_date"] = moment('14/02/1994', 'DD/MM/YYYY'),
    this["personal_information_living_place"] = '',
    this["personal_information_phone"] = '',
    this["personal_information_email"] = email,

    this["education_study"] = [],
    this["education_level_of_english"] = {value: '', label: ''},

    this["professional_profile_department"] = {value: '', label: ''},
    this["professional_profile_position"] = {value: '', label: ''},
    this["professional_profile_office"] = {value: '', label: ''},
    this["professional_profile_questions_answers"] = [],
    this["additional_skills_skills"] = '',

    this.companies = [],
    this.previous_projects = [],
    this.sumato_projects = []

    this.skills_matrix = {}
  }
}

export class ProfileRulesBuilder {

  constructor(profile, step, technologiesList, profileStatus) {
    this.profile = profile;
    this.step = step;
    this.technologiesList = technologiesList;
    this.profileStatus = profileStatus;
  }

  rules() {
    switch(this.step) {
      case 0:
        return [...this.general(), ...this.education(), ...this.questions()]
      case 1:
        return [...this.companies(), ...this.previous_projects()]
      case 2:
        return [...this.sumato_projects()]
      case 3:
        return [...this.skills_matrix()]
    }
  }

  general() {
    return [
      { 
        field: 'personal_information_name', 
        method:    (field) => { return !_.isEmpty(field) || this.profileStatus === 'copy'; },
        validWhen: true,
        message: 'Name is required.' 
      },
      {
        field: 'personal_information_surname', 
        method:    (field) => { return !_.isEmpty(field) || this.profileStatus === 'copy'; },
        validWhen: true,
        message: 'Surname is required.' 
      },
      {
        field: 'personal_information_phone', 
        method:    (val) => { return validator.isMobilePhone(val, 'any') || this.profileStatus === 'copy'; },
        validWhen: true, 
        message: 'Phone is invalid.' 
      },
      {
        field: 'education_level_of_english', 
        method: (field) => _.isEmpty(field.value), 
        validWhen: false, 
        message: 'Level of english is required.' 
      },
      {
        field: 'professional_profile_department', 
        method: (field) => _.isEmpty(field.label), 
        validWhen: false, 
        message: 'Department is required.' 
      },
      {
        field: 'professional_profile_position', 
        method: (field) => _.isEmpty(field.label), 
        validWhen: false, 
        message: 'Position is required.' 
      }
    ]
  }

  education() {
    return _.flatten(this.profile["education_study"].map((edu, ind) => {
      return  [
        {
          field: `education_study[${ind}].start_year`, 
          method: (field) => _.isEmpty(field.value), 
          validWhen: false, 
          message: 'Start year is required.' 
        },
        {
          field: `education_study[${ind}].end_year`, 
          method: (field) => { 
           return !_.isEmpty(field.value) && 
            this.profile["education_study"][ind].start_year.value <= this.profile["education_study"][ind].end_year.value 
          }, 
          validWhen: true, 
          message: 'End year is invalid.'
        },
        {
          field: `education_study[${ind}].university_courses`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Field is required.' 
        },
        {
          field: `education_study[${ind}].specialization`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Specialization is required.' 
        },
        {
          field: `education_study[${ind}].degree_acquired`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Degree Acquired is required.' 
        }
      ]
    }))
  }

  questions() {
    return _.flatten(this.profile["professional_profile_questions_answers"].map((qa, ind) => {
      return [
        {
          field: `professional_profile_questions_answers[${ind}].answer`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Question answer is required.' 
        }
      ]
    }))
  }

  companies() {
    return _.flatten(this.profile["companies"].map((company, ind) => {
      return [
        {
          field: `companies[${ind}].start_year`, 
          method: (field) => _.isEmpty(field.value), 
          validWhen: false, 
          message: 'Start year is required.' 
        },
        {
          field: `companies[${ind}].end_year`, 
          method: (field) => {
            return !_.isEmpty(field.value) && 
              this.profile["companies"][ind].start_year.value <= this.profile["companies"][ind].end_year.value
          }, 
          validWhen: true, 
          message: 'End year is invalid.' 
        },
        {
          field: `companies[${ind}].name`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Name is required.' 
        }
      ]
    }))
  }

  previous_projects() {
    return _.flatten(this.profile["previous_projects"].map((project, ind) => {
      return [
        {
          field: `previous_projects[${ind}].name`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Name is required.' 
        },
        {
          field: `previous_projects[${ind}].description`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Description is required.'
        },
        {
          field: `previous_projects[${ind}].responsibilities`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Responsibilities is required.'
        },
        {
          field: `previous_projects[${ind}].role`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Role is required.'
        },
        {
          field: `previous_projects[${ind}].technologies`, 
          method: (field) => { 
            return  !_.isEmpty(this.technologiesList) ? !_.isEmpty(field) : true 
          },
          validWhen: true, 
          message: 'Technologies are required.'
        },
        {
          field: `previous_projects[${ind}].company`, 
          method: (field) => _.isEmpty(field.value),  
          validWhen: false, 
          message: 'Company is required.'
        },
        {
          field: `previous_projects[${ind}].end_date`, 
          method: (field) => {
            return (_.isEmpty(field) || moment(field).isAfter(moment(this.profile["previous_projects"][ind].start_date)))
          },
          validWhen: true, 
          message: 'End date must be after start date.'
        }
      ]
    }))
  }

  sumato_projects() {
    return _.flatten(this.profile["sumato_projects"].map((project, ind) => {
      return [
        {
          field: `sumato_projects[${ind}].project`, 
          method: field => _.isEmpty(field.label), 
          validWhen: false, 
          message: 'Project is required.' 
        },
        {
          field: `sumato_projects[${ind}].responsibilities`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Responsibilities is required.'
        },
        {
          field: `sumato_projects[${ind}].role`, 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Role is required.'
        },
        {
          field: `sumato_projects[${ind}].technologies`, 
          method: field => { 
            return  !_.isEmpty(this.technologiesList) ? !_.isEmpty(field) : true 
          },
          validWhen: true, 
          message: 'Technologies are required.'
        },
        {
          field: `sumato_projects[${ind}].end_date`, 
          method: (field) => {
            return (_.isEmpty(field) || moment(field).isAfter(moment(this.profile["sumato_projects"][ind].start_date)))
          },
          validWhen: true, 
          message: 'End date must be after start date.'
        }
      ]
    }))
  }

  skills_matrix() {
    return _.flatten(this.profile["skills_matrix"].list.map((skill, ind) => {
      return [
        {
          field: `skills_matrix.list[${ind}].name`,
          method: field => {
          return _.filter(this.profile["skills_matrix"].list.map((skill, ind) => {return skill.name}), field).length > 1
          },
          validWhen: false, 
          message: 'Skills must be unique.' 
        },
        {
          field: `skills_matrix.list[${ind}].name`, 
          method: field => _.isEmpty(field.value) ,
          validWhen: false, 
          message: 'Name is required.' 
        },
        {
          field: `skills_matrix.list[${ind}].level`, 
          method: field => _.isEmpty(field.value),
          validWhen: false, 
          message: 'Level is required.' 
        },
        {
          field: `skills_matrix.list[${ind}].experience`, 
          method: (field) => {
            return validator.isInt(field.toString(), {min: 0, max: 100})
          }, 
          validWhen: true, 
          message: 'Experience must be a number.' 
        },
        {
          field: `skills_matrix.list[${ind}].last_used`, 
          method: field => {
            return _.isEmpty(field.label.toString())},
          validWhen: false, 
          message: 'Last used year is required.' 
        }
      ]
    }))
  }

}
