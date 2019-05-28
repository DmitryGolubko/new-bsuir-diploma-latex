import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ToastContainer, ToastStore } from 'react-toasts';
import UserList from './components/admin/User/UserList';
import Sidebar from './components/layouts/Sidebar';
import Navbar from './components/layouts/Navbar';
import {
  getDepartmentsList,
  getCurrentUser,
  getPositionsList,
  getStatusesList,
  getProjectsList,
  getQuestionsList,
  getCategoriesList,
  getTechnologiesList,
} from './actions';
import UserPage from './components/pages/UserPage';
import UserEditPage from './components/pages/UserEditPage';
import CurrentUserEditPage from './components/pages/CurrentUserEditPage';
import CurrentUserPage from './components/pages/CurrentUserPage';
import ProfileCopiesList from './components/admin/ProfileCopy/ProfilesCopiesList';
import ProfileCopy from './components/admin/ProfileCopy/ProfileCopy';
import ProjectList from './components/admin/Project/ProjectList';
import Project from './components/admin/Project/Project';
import ProjectForm from './components/admin/Project/ProjectForm';
import { managerOrAdmin } from './auth';
import ManagersAssignment from './components/admin/ManagersAssignment';
import PositionsList from './components/admin/Position/PositionsList';
import DepartmentsList from './components/admin/Department/DepartmentsList';
import Department from './components/admin/Department/Department';
import Position from './components/admin/Position/Position';
import PositionForm from './components/admin/Position/PositionForm';
import DepartmentForm from './components/admin/Department/DepartmentForm';
import ProfileCopyEdit from './components/admin/ProfileCopy/ProfileCopyEdit';
import { PROFILE_STATUS } from './constants/constants';
import QuestionsList from './components/admin/Question/QuestionsList';
import Question from './components/admin/Question/Question';
import QuestionForm from './components/admin/Question/QuestionForm';
import Rights from './components/admin/Rights';
import Skills from './components/admin/Category/Skills';
import NotFound from './components/pages/NotFound';
import withAuthorization from './Authorize';
import { withFormEdit, withFormNew } from './components/Form';
import CategoryForm from './components/admin/Category/CategoryForm';


class App extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getCurrentUser());
    dispatch(getDepartmentsList());
    dispatch(getPositionsList());
    dispatch(getProjectsList());
    dispatch(getQuestionsList());
    dispatch(getTechnologiesList());
  }

  componentDidUpdate() {
    const { currentUser, dispatch } = this.props;
    if (managerOrAdmin(currentUser)) {
      dispatch(getStatusesList());
      dispatch(getCategoriesList());
    }

    if (!_.isEmpty(currentUser) && currentUser.profile_status === PROFILE_STATUS.DRAFT) {
      ToastStore.success('Please, edit your profile.');
    }

  }

  render() {
    const { currentUser } = this.props;

    return !_.isEmpty(currentUser) && (
      <BrowserRouter basename="/front">
        <div className="page-container">
          <ToastContainer store={ToastStore} />
          <Sidebar />
          <div className="page-content">
            <Navbar />
            <Switch>

              <Route
                exact
                path="/"
                render={() => {
                  let route = null;
                  if (currentUser.profile_status === PROFILE_STATUS.DRAFT) {
                    route = <Redirect to="/current_user/edit" />;
                  } else if (managerOrAdmin(currentUser)) {
                    route = <Redirect to="/admin/users" />;
                  } else {
                    route = <Redirect to="/current_user" />;
                  }
                  return route;
                }}
              />

              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/users"
                  component={
                    withAuthorization(currentUser, ['profiles_management_profiles_list'])(UserList)}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/users/:userId" component={UserPage} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/users/:userId/edit" component={UserEditPage} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/copies" component={ProfileCopiesList} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/profile_copies/:profileId" component={ProfileCopy} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/profile_copies/:profileId/edit" component={ProfileCopyEdit} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/projects"
                  component={
                    withAuthorization(currentUser, ['project_management_list_of_projects'])(ProjectList)}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/projects/:projectId"
                  component={
                    withAuthorization(currentUser, ['project_management_list_of_projects'])(Project)}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/project/new/"
                  component={
                    withAuthorization(currentUser, ['project_management_add_edit_project_details'])(
                      withFormNew(ProjectForm)
                    )}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/projects/:projectId/edit"
                  component={
                    withAuthorization(currentUser, ['project_management_add_edit_project_details'])(
                      withFormEdit(ProjectForm)
                    )}
                />
                )
              }
              { currentUser.admin
                && (
                <Route exact path="/admin/managers_assignment" component={ManagersAssignment} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/departments" component={DepartmentsList} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/departments/:departmentId" component={Department} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/department/new/"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_departments_management'])(
                      withFormNew(DepartmentForm)
                    )}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/departments/:departmentId/edit"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_departments_management'])(
                      withFormEdit(DepartmentForm)
                    )}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/positions" component={PositionsList} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/positions/:positionId" component={Position} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/position/new"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_positions_management'])(
                      withFormNew(PositionForm)
                    )}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/positions/:positionId/edit"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_positions_management'])(
                      withFormEdit(PositionForm)
                    )}
                />
                )
              }

              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/questions" component={QuestionsList} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/questions/:questionId" component={Question} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/question/new/"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_positions_management'])(
                      withFormNew(QuestionForm)
                    )}
                />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/questions/:questionId/edit"
                  component={
                    withAuthorization(currentUser, ['departments_positions_management_positions_management'])(
                      withFormEdit(QuestionForm)
                    )}
                />
                )
              }

              { managerOrAdmin(currentUser)
                && (
                <Route
                  exact
                  path="/admin/rights"
                  component={
                    withAuthorization(currentUser, ['rights_management_rights_management'])(Rights)}
                />
                )
              }

              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/skills" component={Skills} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/category/new" component={withFormNew(CategoryForm)} />
                )
              }
              { managerOrAdmin(currentUser)
                && (
                <Route exact path="/admin/categories/:categoryId/edit" component={withFormEdit(CategoryForm)} />
                )
              }

              <Route exact path="/current_user/edit" component={CurrentUserEditPage} />
              <Route exact path="/current_user" component={CurrentUserPage} />

              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
  };
};

export default connect(mapStateToProps)(App);
