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
    this.getCertificationsList(1)
  }

  getCertificationsList = async () => {
    this.setState({
      isLoading: true
    });
    const data = await ApiService.getCertificationsList();
    if (!data || data.error) {
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      this.setState({
        pendingCertifications: data || [],
        isLoading: false
      })
    }

  }

  render() {
    const {clientId} = this.props
    const {pendingApprovals, pendingRequests, pendingCertifications} = this.state
    return (
      <div>
        <Row>
          <Col className="mb-10" xs={12} md={6} lg={4}>
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
          <Col className="mb-10" xs={12} md={6} lg={4}>
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
          <Col className="mb-10" xs={12} md={6} lg={4}>
            <Card
              title={<Link to={`/${clientId}/certification`} style={{color: white}}>My Certifications</Link>}
              extra={<div className="total-digit">{pendingCertifications.length || 0}</div>}
              headStyle={customPanelStyle(green)}
            >
              {
                pendingCertifications.map((item, index)=> {
                  const { certificationId, campaignId, reviewerCertificationInfo, reviewerCertificateActionInfo } = item
                  let status = ""
                  if(reviewerCertificateActionInfo) {
                    status = reviewerCertificateActionInfo.percentageCompleted === 0 ? "New"
                      : reviewerCertificateActionInfo.percentageCompleted === 100 ? "Completed"
                        : "In Progress"
                  }
                  if(index > 1) return;
                  return (
                    <div key={campaignId}>
                      <Row>
                        <Col md={12} lg={12}>
                          <h4>
                            <b>{reviewerCertificationInfo.certificationName || ""}</b>
                          </h4>
                          <Tag className="mt-3" color={`${status === "New" ? "blue" : status === "Completed" ? "green" : "cyan" }`}>{status}</Tag>
                          <div className="mt-10">
                            <h5 className="mt-5"><b>Certification ID: </b>{certificationId || ""}</h5>
                            <h5 className="mt-7"><b>Type: </b>{reviewerCertificationInfo.certificationType || ""}</h5>
                            <h5 className="mt-5"><b>Date Created: </b>{moment(reviewerCertificationInfo.certificationCreatedOn).format("MM-DD-YYYY, h:mm:ss a")}</h5>
                          </div>
                          <div className="mt-10">
                            <h5 className="mt-5"><b>Progress:</b></h5>
                            <Progress format={() => ""} percent={reviewerCertificateActionInfo.percentageCompleted || 0} />
                          </div>
                        </Col>
                      </Row>
                      <Divider/>
                    </div>
                  )
                })
              }
              {
                this.state.pendingCertifications.length > 2 ?
                  <div className="text-right">
                    <Link to={`/${clientId}/certification`}>More</Link>
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
