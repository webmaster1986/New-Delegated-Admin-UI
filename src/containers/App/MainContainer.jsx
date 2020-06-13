import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
const HomePage = React.lazy(() => import('../Home/index'));
const MyProfile = React.lazy(() => import('../MyProfile/Users'));
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
const MyUsers = React.lazy(() => import('../MyUsers'));
const GrantAccessByUsers = React.lazy(() => import('../GrantAccess/ByUsers'));
const GrantAccessByGroups = React.lazy(() => import('../GrantAccess/ByGroups'));
const RevokeAccessByUsers = React.lazy(() => import('../RevokeAccess/ByUsers'));

const loading = () => <div className="load">
  <div className="load__icon-wrap text-center ">
    <svg className="load__icon">
      <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
    </svg>
  </div>
</div>

const Pages = () => (
  <Suspense fallback={loading()}>
    <Switch>
      <Route path="/" component={HomePage} />
    </Switch>
  </Suspense>
);

const wrappedRoutes = () => (
  <div>
    <div className="client-sidebar"><Layout isSideBar={true} isClient /></div>
    <div className="container__wrap sidebar-hidden pt-0 public-area">
      <Suspense fallback={loading()}>
        <Switch>
          <Route path="/:clientId/my-profile" component={MyProfile} />
          <Route path="/:clientId/grant-access-by-users" component={GrantAccessByUsers} />
          <Route path="/:clientId/grant-access-by-groups" component={GrantAccessByGroups} />
          <Route path="/:clientId/revoke-access-by-users" component={RevokeAccessByUsers} />
          <Route path="/:clientId/revoke-access-by-groups" component={RevokeAccessByUsers} />
          <Route path="/:clientId/manage-users" component={MyUsers} />
          <Route path="/:clientId/dashboard" component={Dashboard} />
          <Route path="/:clientId/" component={Dashboard} />
        </Switch>
      </Suspense>
    </div>
  </div>
);

const wrappedRoutesAdmin = () => (
  <div>
    <Layout isSideBar={true} />
    <div className="container__wrap admin-part">
      <Suspense fallback={loading()}>
        <Switch>
          {/*<Route path="/:clientId/intelligent-identity" component={IntelligentIdentity} />*/}
          {/*<Route  path="/:clientId/admin/applist" component={ApplicationManage} />*/}
          {/*<Route  path="/:clientId/admin/user-manage" component={UserManage} />*/}
          {/*<Route  path="/:clientId/admin/attributemapping/:id" component={MappingApplication} />*/}
          {/*<Route  path="/:clientId/admin/user/new" component={NewUser} />*/}
          {/*<Route  path="/:clientId/admin/user/edit" component={NewUser} />*/}
          {/*<Route  path="/:clientId/admin/user/upload" component={NewUser} />*/}
          {/*<Route  exact path="/:clientId/admin/app-owner" component={AppOwner} />*/}
          {/*<Route  path="/:clientId/admin/manage-campaign" component={UserManager} />*/}
          {/*<Route  path="/:clientId/admin/user-manager2" component={UserManager2} />*/}
          {/*<Route  path="/:clientId/admin/delegated-admin/add-access" component={AddAccess} />*/}
          {/*<Route  path="/:clientId/admin/app-owner/review-and-approve" component={ReviewAndApprove} />*/}
          {/*<Route  path="/:clientId/admin/notification/administration" component={Administration} />*/}
          {/*<Route  path="/:clientId/admin/notification/email-templates" component={EmailTemplates} />*/}
          {/*<Route  path="/:clientId/admin/connector/direct" component={Direct}/>*/}
          {/*<Route  path="/:clientId/admin/connector/file-upload" component={FileUpload}/>*/}
          {/*<Route  path="/:clientId/admin/user/create-user" component={CreateUser}/>*/}
          {/*<Route  path="/:clientId/admin/users" component={Users}/>*/}
          {/*<Route  path="/:clientId/admin/orphan-account" component={OrphanAccount}/>*/}
          {/*<Route  path="/:clientId/admin/scheduled-jobs" component={Jobs}/>*/}
          {/*<Route  path="/:clientId/admin/entities/roles" component={ManageRole}/>*/}
          {/*<Route  path="/:clientId/admin/entities/applications" component={ManageApplications}/>*/}
          {/*<Route  path="/:clientId/admin/entities/entitlements" component={ManageEntitlements}/>*/}
          {/*<Route  path="/:clientId/admin/oci-policy" component={OCIPolicy}/>*/}
          {/*<Route  path="/:clientId/admin/provisioning/failed-task" component={FailedTask}/>*/}
          {/*<Route path="/:clientId/admin/intelligent-identity" component={IntelligentIdentity} />*/}

        </Switch>
      </Suspense>
    </div>
  </div>
);

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, userinfo: null };
  }

  async componentDidMount() {
    window.onLogOut = () => {
    }
  }

  render() {
    return (
      <div>
           <Switch>
             <Route path="/:clientId/admin" component={wrappedRoutesAdmin}/>
             <Route path="/:clientId" component={wrappedRoutes}/>
           </Switch>
       </div>
    );
  }
}

export default MainContainer;
