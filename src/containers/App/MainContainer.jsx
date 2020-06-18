import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
const HomePage = React.lazy(() => import('../Home/index'));
const AppOwnerCertification = React.lazy(() => import('../AppOwnerCertification/index'));
const Certification = React.lazy(() => import('../Certification/index'));
const ApplicationManage = React.lazy(() => import('../FileBoarding/ApplicationManage'));
const MappingApplication = React.lazy(() => import('../FileBoarding/MappingApplication'));
const UserManage = React.lazy(() => import('../FileBoarding/UserManage'));
const NewUser = React.lazy(() => import('../FileBoarding/NewUser'));
const AppOwner = React.lazy(() => import('../CreateCamping/AppOwner'));
const UserManager = React.lazy(() => import('../CreateCamping/UserManager'));
const UserManager2 = React.lazy(() => import('../CreateCamping/UserManager2'));
const AddAccess = React.lazy(() => import('../DelegatedAdmin/AddAccess'));
const ReviewAndApprove = React.lazy(() => import('../AppOwner/ReviewAndApprove'));
const Administration = React.lazy(() => import('../Notification/Administration'));
const EmailTemplates = React.lazy(() => import('../Notification/EmailTemplates'));
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
const Reporting= React.lazy(() => import('../Reporting/Reporting'));
const Direct= React.lazy(() => import('../Connector/Direct'));
const FileUpload= React.lazy(() => import('../Connector/FileUpload'));
const CreateUser= React.lazy(() => import('../User/CreateUser'));
const Jobs= React.lazy(() => import('../ScheduledJobs'));
const Users= React.lazy(() => import('../User/Users'));
const ManageUsers = React.lazy(() => import('../ManageUser/ManageUsers'));
const OrphanAccount= React.lazy(() => import('../OrphanAccount'));
const Request= React.lazy(() => import('../Request/Request'));
const RequestList= React.lazy(() => import('../Request/RequestList'));
const ReviewRequest= React.lazy(() => import('../ReviewRequest'));
const NewRequest= React.lazy(() => import('../NewRequest'));
const ManageRole = React.lazy(() => import('../ManageEntities/Role'));
const ManageApplications = React.lazy(() => import('../ManageEntities/Applications'));
const ManageEntitlements = React.lazy(() => import('../ManageEntities/Entitlements'));
const OCIPolicy = React.lazy(() => import('../OCIPolicies'));
const FailedTask = React.lazy(() => import('../Provisioning/FailedTask'));
const OwnerCertification = React.lazy(() => import('../OwnerCertification'));
const RoleCertification = React.lazy(() => import('../RoleCertification'));
const SelfCertification = React.lazy(() => import('../SelfCertification'));
const MyProfile = React.lazy(() => import('../MyProfile/Users'));
const IntelligentIdentity = React.lazy(() => import('../IntelligentIdentity'));
const ManageAdmin = React.lazy(() => import('../ManageAdmin'));
const GrantAccessByUsers = React.lazy(() => import('../GrantAccess/ByUsers'));
const GrantAccessByGroups = React.lazy(() => import('../GrantAccess/ByGroups'));
const RevokeAccessByUsers = React.lazy(() => import('../RevokeAccess/ByUsers'));
const RevokeAccessByGroups = React.lazy(() => import('../RevokeAccess/ByGroups'));

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
          <Route path="/:clientId/manage-admin" component={ManageAdmin} />
          <Route path="/:clientId/grant-access-by-users" component={GrantAccessByUsers} />
          <Route path="/:clientId/grant-access-by-groups" component={GrantAccessByGroups} />
          <Route path="/:clientId/revoke-access-by-users" component={RevokeAccessByUsers} />
          <Route path="/:clientId/revoke-access-by-groups" component={RevokeAccessByGroups} />
          <Route path="/:clientId/my-profile" component={MyProfile} />
          <Route path="/:clientId/certification/:id" component={HomePage} />
          <Route  path="/:clientId/request/request-for-others" component={Request}/>
          <Route  path="/:clientId/request/request-for-self" component={Request}/>
          <Route  path="/:clientId/request/request-list" component={RequestList}/>
          <Route path="/:clientId/owner-certification/:id" component={OwnerCertification} />
          <Route path="/:clientId/role-certification/:id" component={RoleCertification} />
          <Route path="/:clientId/self-certification/:id" component={SelfCertification} />
          <Route  path="/:clientId/reporting" component={Reporting} />
          <Route path="/:clientId/requests" component={NewRequest} />
          <Route path="/:clientId/certification" component={Certification} />
          <Route path="/:clientId/manage-users" component={ManageUsers} />
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
          <Route path="/:clientId/intelligent-identity" component={IntelligentIdentity} />
          <Route  path="/:clientId/admin/applist" component={ApplicationManage} />
          <Route  path="/:clientId/admin/user-manage" component={UserManage} />
          <Route  path="/:clientId/admin/attributemapping/:id" component={MappingApplication} />
          <Route  path="/:clientId/admin/user/new" component={NewUser} />
          <Route  path="/:clientId/admin/user/edit" component={NewUser} />
          <Route  path="/:clientId/admin/user/upload" component={NewUser} />
          <Route  exact path="/:clientId/admin/app-owner" component={AppOwner} />
          <Route  path="/:clientId/admin/manage-campaign" component={UserManager} />
          <Route  path="/:clientId/admin/user-manager2" component={UserManager2} />
          <Route  path="/:clientId/admin/delegated-admin/add-access" component={AddAccess} />
          <Route  path="/:clientId/admin/app-owner/review-and-approve" component={ReviewAndApprove} />
          <Route  path="/:clientId/admin/notification/administration" component={Administration} />
          <Route  path="/:clientId/admin/notification/email-templates" component={EmailTemplates} />
          <Route  path="/:clientId/admin/connector/direct" component={Direct}/>
          <Route  path="/:clientId/admin/connector/file-upload" component={FileUpload}/>
          <Route  path="/:clientId/admin/user/create-user" component={CreateUser}/>
          <Route  path="/:clientId/admin/users" component={Users}/>
          <Route  path="/:clientId/admin/orphan-account" component={OrphanAccount}/>
          <Route  path="/:clientId/admin/scheduled-jobs" component={Jobs}/>
          <Route  path="/:clientId/admin/entities/roles" component={ManageRole}/>
          <Route  path="/:clientId/admin/entities/applications" component={ManageApplications}/>
          <Route  path="/:clientId/admin/entities/entitlements" component={ManageEntitlements}/>
          <Route  path="/:clientId/admin/oci-policy" component={OCIPolicy}/>
          <Route  path="/:clientId/admin/provisioning/failed-task" component={FailedTask}/>
          <Route path="/:clientId/admin/intelligent-identity" component={IntelligentIdentity} />

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
