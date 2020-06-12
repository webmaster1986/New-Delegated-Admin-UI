import React, {Component} from 'react';
import { Card } from 'antd';
import { Row, Col } from "reactstrap"

import './Dashboard.scss';

import CustomHeader from "../Layout/CustomHeader";
import DirectReports from "./DirectReports";
import PendingSection from "./PendingSection";
import {getUserName} from "../../services/ApiService";

const gray = '#525f68'
const blue = 'rgb(0, 157, 219)'
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


class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userName: "",
      identityUsersList: []
    };
  }

  componentDidMount() {
    this.setState({
      userName: getUserName()
    })
  }

  render() {
    const { clientId } = this.props.match.params;
    const { userName } = this.state

    return (
      <div className="dashboard mt-5">
        <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon" style={{marginRight: 300}} /> Dashboard</span>}/>
        <div className="pt-50">
          <Row>
            <Col md={12} lg={6}>
              <Card
                title="What's New"
                headStyle={customPanelStyle(blue)}
                style={{
                  height: '100%',
                  minHeight: 350
                }}
              >Attributes
                <Row>
                  <Col md={12} lg={12}>
                    <div>
                      <h3><b>Here's what you can do:</b></h3>
                    </div>
                    <ul className="mt-10 mb-60 ml-10">
                      <li className="mt-5">OnBoarding Users and Groups</li>
                      <li className="mt-5">OnBoarding Applications</li>
                      <li className="mt-5">Auditing the System, Users, and Groups</li>
                      <li className="mt-5">Managing Security Setting</li>
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={12} lg={6}>
              {
                userName && <DirectReports {...this.props} clientId={clientId} customPanelStyle={customPanelStyle} userName={userName} />
              }
            </Col>
          </Row>
          <br/>
          <PendingSection clientId={clientId} {...this.props} />
        </div>
      </div>
    )
  }
}

export default HomePage;
