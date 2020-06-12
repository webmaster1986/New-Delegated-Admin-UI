import React, {Component} from 'react';
import { Row, Col } from "reactstrap"
import {
  Card, Divider, Tag, Avatar, Progress, message
} from 'antd';
import moment from "moment";
import {Link} from "react-router-dom";
import {ApiService} from "../../services";
import Cookies from "universal-cookie";
import ThumbsUp from "../../images/thumbs-up.png"
import ThumbsDown from "../../images/thumbs-down.png"

const cookies = new Cookies();
const getUserName = () => {
  return cookies.get('LOGGEDIN_USERID');
}

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
  const i = index % 5;
  return colors[i] ? colors[i] : colors[0];
}

const blue = 'rgb(215, 37, 40)'
const gray = 'rgb(0, 157, 219)'
const green = 'rgb(12, 36, 97)'
const white = '#ffffff'
const customPanelStyle = (bgColor) => ({
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  backgroundColor: bgColor,
  color: white,
  fontWeight: 400,
  fontSize: 16,
});

class PendingSection extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.state = {
      pendingApprovals: [],
      pendingRequests: [],
      pendingCertifications: [],
    };
  }

  componentDidMount() {
    this.getMyRequestList()
    this.getMyApprovalList("request")
  }

  getMyRequestList = async () => {
    this.setState({
      isLoading: true
    })

    const payload = {
      requestedBy: getUserName()
    }
    const data = await ApiService.getRequestsTasks(payload);
    if (!data || data.error) {
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {

      (data || []).forEach(x => {
        x.entityName = x.entity.entityName;
        x.entityType = x.entity.entityType;
        if (x.status === 'Approved') {
          x.daysOpen = ''
        } else {
          const a = moment();
          const b = moment(x.requestedOn);
          x.daysOpen = a.diff(b, 'days') // 1
        }
      })

      this.setState({
        pendingRequests: (data || []),
        isLoading: false
      })
    }
  }

  getMyApprovalList = async (key) => {
    if (!key) {
      key = 'users';
    }

    this.setState({
      isLoading: true,
      isSidebarLoading: true,
      selectedRequests: [],
    });
    const members = []

    const body = {
      userName: getUserName(),
      managerRequired:""
    }

    const userData = await ApiService.getUsersWorkflow(body)

    let payload = {}
    if(userData && userData.length) {
      payload = {
        managerID: userData[0].id
      }
    }

    let data = await this._apiService.getRequests(payload);
    if(!data || data.error){
      this.setState({
        isLoading: false,
        isSidebarLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      data = (data || []).map(x => {
        return {
          ...x,
          entityID: x.entity.entityID,
          entityName: x.entity.entityName,
          entityType: x.entity.entityType,
          dummyId: 108,
          action: x.status && x.status !== 'Submitted' ? x.status : 'Add'
        }
      });
      (data || []).forEach(obj => {
        if (!((members || []).some(mem => mem.name === obj.dummyId))) {
          members.push({
            name: obj.dummyId,
            displayName: obj.requestName || "Request",
            id: (members.length + 1),
            color: getColor(members.length)
          })
        }
      });
      let firstUserName = this.state.activeKey || (members.length > 0 ? members[0].name : '');

      let keyFilter = key === 'request' ? 'dummyId' : key === 'entity' ? 'entityID' : 'requestedForID';
      const newApps = [];
      data.filter(x => x[keyFilter] === firstUserName).forEach((obj) => {
        obj.prevAction = obj.action ? obj.action : 'Add';
        obj.action = obj.action ? obj.action : 'Add';
        newApps.push(obj);
      });
      this.setState({
        pendingApprovals: (newApps || []).reverse(),
      });

    }
  }

  render() {
    const {clientId} = this.props
    const {pendingApprovals, pendingRequests} = this.state
    return (
      <div>
        <Row>
          <Col className="mb-10" md={12} lg={6}>
            <Card
              title={<Link to={`/${clientId}/request/request-list`} style={{color: white}}>Recent Grants</Link>}
              extra={<div className="total-digit">{pendingRequests.length || 0}</div>}
              headStyle={customPanelStyle(blue)}
            >
              {
                (pendingRequests || []).slice(0, 2).map((item,index) => (
                  <div key={index}>
                    <Row>
                      <Col md={12} lg={12}>
                        <div className="d-flex">
                          <h4 className="mb-5">
                            <b style={{whiteSpace: 'nowrap'}}>{item.requestedForDisplayName}</b>
                          </h4>
                          <div className="text-right w-100-p">
                            <span className={"mr-10 row-action-btn-a text-initial"}>
                              Remove
                            </span>
                          </div>
                        </div>

                        <div className="mt-10">
                          <h5 className="mt-5"><b>Entity Type: </b>{item.entityType}</h5>
                          <h5 className="mt-5"><b>Entity Name: </b>{item.entityName}</h5>
                          <h5 className="mt-5"><b>Status: </b>{item.status}</h5>
                          <h5 className="mt-7"><b>Request ID: </b>{item.id}</h5>
                          <h5 className="mt-5"><b>Requested On: </b>{ item && item.requestedOn && moment(item.requestedOn).format('MM-DD-YYYY, h:mm:ss a') }</h5>
                        </div>
                      </Col>
                    </Row>
                    <Divider/>
                  </div>
                ))
              }
              {
                (pendingRequests || []).length > 2 ?
                    <div className="text-right">
                      <Link to={`/${clientId}/request/request-list`}>More</Link>
                    </div>
                    : null
              }
            </Card>
          </Col>
          <Col className="mb-10" md={12} lg={6}>
            <Card
                title={<Link to={`/${clientId}/requests`} style={{color: white}}>Recent Revokes</Link>}
                extra={<div className="total-digit">{pendingApprovals.length || 0}</div>}
                headStyle={customPanelStyle(gray)}
            >
              {

                (pendingApprovals || []).slice(0, 2).map((item,index) => {
                  const entityName = item.entityName
                  let icon = ThumbsUp
                  if(entityName === "OCI_Administrators" || entityName === "Oracle Fusion Applications" || entityName === "Payroll Manager" || entityName === "Human Resource Manager") {
                    icon = ThumbsDown
                  }

                  return(
                    <div key={index}>
                      <Row>
                        <Col md={2} lg={1}>
                          <Avatar src={icon} className="image"/>
                        </Col>
                        <Col md={10} lg={11}>
                          <div className="d-flex">
                            <h4 className="mb-5">
                              <b style={{whiteSpace: 'nowrap'}}>{item.requestedForDisplayName}</b>
                            </h4>
                            <div className="text-right w-100-p">
                          <span className={`mr-10 row-action-btn ${item.action === 'Approved' ? 'text-success' : 'text-initial'}`}>
                           {item.action === 'Approved' ? 'Approved' : 'Approve'}
                          </span>
                              <span className={`mr-10 row-action-btn-a ${item.action === 'Rejected' ? 'text-success' : 'text-initial'}`}>
                            {item.action === 'Rejected' ? 'Rejected' : 'Reject'}
                          </span>
                            </div>
                          </div>

                          <div className="mt-10">
                            <h5 className="mt-5"><b>Entity Type: </b>{item.entityType}</h5>
                            <h5 className="mt-5"><b>Entity Name: </b>{item.entityName}</h5>
                            <h5 className="mt-7"><b>Request ID: </b>{item.id}</h5>
                            <h5 className="mt-5"><b>Requested On: </b>{ item && item.requestedOn && moment(item.requestedOn).format('MM-DD-YYYY, h:mm:ss a') }</h5>

                          </div>
                        </Col>
                      </Row>
                      <Divider/>
                    </div>
                  )
                })
              }
              {
                (pendingApprovals || []).length > 2 ?
                    <div className="text-right">
                      <Link to={`/${clientId}/requests`}>More</Link>
                    </div>
                    : null
              }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PendingSection;
