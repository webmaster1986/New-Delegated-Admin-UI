import React, {Component} from 'react';
import { Row, Col } from "reactstrap"
import {
  Card, Divider, Tag, Avatar, Progress, message
} from 'antd';
import moment from "moment";
import {Link} from "react-router-dom";
import {ApiService} from "../../services";
import GrantRevokeSection from "./GrantRevokeSection"

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
      recentGrantsList: [],
      recentRevokesList: [],
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
    const { clientId } = this.props
    const { pendingCertifications } = this.state
    return (
      <div>
        <Row>
          <GrantRevokeSection clientId={clientId}/>
          <Col className="mb-10" xs={12} md={6} lg={4}>
            <Card
              title={<Link to={`/${clientId}/certification`} style={{color: white}}>My Certifications</Link>}
              // extra={<div className="total-digit">{pendingCertifications.length || 0}</div>}
              headStyle={customPanelStyle(green)}
            >
              {
                (pendingCertifications || []).slice(0, 4).map((item, index)=> {
                  const { certificationId, campaignId, reviewerCertificationInfo, reviewerCertificateActionInfo } = item
                  let status = ""
                  if(reviewerCertificateActionInfo) {
                    status = reviewerCertificateActionInfo.percentageCompleted === 0 ? "New"
                      : reviewerCertificateActionInfo.percentageCompleted === 100 ? "Completed"
                        : "In Progress"
                  }
                  // if(index > 1) return;
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
              {/*{
                this.state.pendingCertifications.length > 2 ?
                  <div className="text-right">
                    <Link to={`/${clientId}/certification`}>More</Link>
                  </div>
                  : null
              }*/}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PendingSection;
