import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';

class Topbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clientId: props.match.params.clientId
    };
  }
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility, isSideBar } = this.props;
    const { clientId } = this.state;
    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            {
              isSideBar && <TopbarSidebarButton
                changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                changeSidebarVisibility={changeSidebarVisibility}
            />
            }

            <Link className="topbar__logo" to={`/${clientId}`} />
          </div>
          <div className="topbar__right">
            <TopbarProfile />
          </div>
          
        </div>
      </div>
    );
  }
}

export default withRouter(Topbar);
