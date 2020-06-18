import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            clientId: props.match.params.clientId
        };
    }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const {isClient} = this.props;
    const {clientId} = this.state;
    return (
      <div className="sidebar__content">
        {
          isClient ?
            <ul className="sidebar__block">
              <SidebarLink title="Dashboard" icon="diamond" route={`/${clientId}/dashboard`} onClick={this.hideSidebar}/>
                <SidebarLink title="Manage Users" icon="diamond" route={`/${clientId}/my-profile`} onClick={this.hideSidebar}/>
                <SidebarLink title="Manage Admin" icon="diamond" route={`/${clientId}/manage-admin`} onClick={this.hideSidebar}/>
                <SidebarCategory title="Grant Access" icon="diamond">
                    <SidebarLink title="By Users" route={`/${clientId}/grant-access-by-users`} onClick={this.hideSidebar} />
                    <SidebarLink title="By Groups" route={`/${clientId}/grant-access-by-groups`} onClick={this.hideSidebar} />
                </SidebarCategory>
                <SidebarCategory title="Revoke Access" icon="diamond">
                    <SidebarLink title="By Users" route={`/${clientId}/revoke-access-by-users`} onClick={this.hideSidebar} />
                    <SidebarLink title="By Groups" route={`/${clientId}/revoke-access-by-groups`} onClick={this.hideSidebar} />
                </SidebarCategory>
              {/*<SidebarLink title="My Profile" icon="diamond" route={`/${clientId}/my-profile`} onClick={this.hideSidebar}/>*/}
              {/*<SidebarCategory title="Request Access" icon="diamond">
                <a href={`/iga/${clientId}/request/request-for-self`}>
                  <li className="sidebar__link"><p className="sidebar__link-title">Self</p></li>
                </a>
                <a href={`/iga/${clientId}/request/request-for-others`}>
                  <li className="sidebar__link"><p className="sidebar__link-title">Others</p></li>
                </a>
              </SidebarCategory>*/}
              <SidebarLink title="Track Request" icon="diamond" route={`/${clientId}/request/request-list`} onClick={this.hideSidebar}/>
              <SidebarLink title="Approve Access" icon="diamond" route={`/${clientId}/requests`} onClick={this.hideSidebar}/>
              <SidebarLink title="Certifications" icon="diamond" route={`/${clientId}/certification`} onClick={this.hideSidebar}/>
              <SidebarLink title="Reporting" icon="diamond" route={`/${clientId}/reporting`} onClick={this.hideSidebar}/>
              {/*<SidebarLink title="Manage Users" icon="diamond" route={`/${clientId}/manage-users`} onClick={this.hideSidebar}/>*/}
            </ul>
            :
            <ul className="sidebar__block">
              <SidebarCategory title="Application"  icon="diamond">
                <SidebarLink title="Manage" route={`/${clientId}/admin/applist`} onClick={this.hideSidebar} />
              </SidebarCategory>
              {/*<SidebarCategory title="User">
              <SidebarLink title="Manage" route="/admin/user-manage" onClick={this.hideSidebar} />
            </SidebarCategory>*/}
              {/*<SidebarLink title="File OnBoarding" icon="diamond" route="/admin/application-manage" onClick={this.hideSidebar} />*/}
              <SidebarCategory title="Data Import" icon="diamond">
                <SidebarLink title="Direct" route={`/${clientId}/admin/connector/direct`} onClick={this.hideSidebar} />
                <SidebarLink title="File Upload" route={`/${clientId}/admin/connector/file-upload`} onClick={this.hideSidebar} />
              </SidebarCategory>
              {/* <SidebarCategory title="Create Campaign" icon="diamond">
              <SidebarLink title="App Owner" route="/admin/app-owner" onClick={this.hideSidebar} />
              <SidebarLink title="User Manager" route="/admin/user-manager" onClick={this.hideSidebar} />
          </SidebarCategory>*/}
              <SidebarLink title="Manage Campaign" icon="diamond" route={`/${clientId}/admin/manage-campaign`} onClick={this.hideSidebar}/>
              {/*<SidebarCategory title="Delegated Admin" icon="diamond">
              <SidebarLink title="Add Access" route={`/${clientId}/admin/delegated-admin/add-access`} onClick={this.hideSidebar} />
              <SidebarLink title="User Profile Mgmt" route={`/${clientId}/admin/user-manager`} onClick={this.hideSidebar} />
              <SidebarLink title="Check Status" route={`/${clientId}/admin/user-manager`} onClick={this.hideSidebar} />
          </SidebarCategory>*/}
              {/*<SidebarCategory title="App Owner" icon="diamond">
              <SidebarLink title="Review and Approve" route={`/${clientId}/admin/app-owner/review-and-approve`} onClick={this.hideSidebar} />
          </SidebarCategory>*/}
              <SidebarCategory title="Notification" icon="diamond">
                <SidebarLink title="Administration" route={`/${clientId}/admin/notification/administration`} onClick={this.hideSidebar} />
                <SidebarLink title="Email Templates" route={`/${clientId}/admin/notification/email-templates`} onClick={this.hideSidebar} />
              </SidebarCategory>
              <SidebarLink title="Users" icon="diamond" route={`/${clientId}/admin/users`} onClick={this.hideSidebar} />
              {/*<SidebarLink title="Reporting" icon="diamond" route={`/${clientId}/admin/reporting`} onClick={this.hideSidebar} />*/}
              <SidebarLink title="Scheduled Jobs" icon="diamond" route={`/${clientId}/admin/scheduled-jobs`} onClick={this.hideSidebar} />
              <SidebarLink title="Not Linked Account" icon="diamond" route={`/${clientId}/admin/orphan-account`} onClick={this.hideSidebar} />
              {/* <SidebarCategory title="Reporting" icon="diamond">
              <SidebarLink title="Reporting" route="/admin/reporting" onClick={this.hideSidebar} />
          </SidebarCategory>*/}
              <SidebarCategory title="Manage Entities" icon="diamond">
                <SidebarLink title="Role" route={`/${clientId}/admin/entities/roles`} onClick={this.hideSidebar} />
                <SidebarLink title="Application" route={`/${clientId}/admin/entities/applications`} onClick={this.hideSidebar} />
                <SidebarLink title="Entitlement" route={`/${clientId}/admin/entities/entitlements`} onClick={this.hideSidebar} />
              </SidebarCategory>
              <SidebarLink title="OCI Policies" icon="diamond" route={`/${clientId}/admin/oci-policy`} onClick={this.hideSidebar} />
              <SidebarCategory title="Provisioning" icon="diamond">
                <SidebarLink title="Failed Tasks" route={`/${clientId}/admin/provisioning/failed-task`} onClick={this.hideSidebar} />
              </SidebarCategory>
              <SidebarLink title="KP Intelligent Identity" icon="diamond" route={`/${clientId}/admin/intelligent-identity`} onClick={this.hideSidebar}/>
            </ul>
        }
      </div>
    );
  }
}

export default withRouter(SidebarContent);
