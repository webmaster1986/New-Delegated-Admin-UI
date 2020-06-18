import React, {Component} from 'react';
import {Row, Col, Container,Card, CardHeader, CardBody} from "reactstrap"
import {
  InputNumber,
  Input, Radio, Checkbox
} from 'antd';

class IntelligentIdentity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      continuousCompliance: {
        accessType: 'all'
      },
      accessAdvisor: {
        accessType: 'all'
      },
      errors: {}
    };
  }

  onAccessAdvisorChange = (event) => {
    const {name, value, type, checked} = event.target
    let accessAdvisor = {
      ...(this.state.accessAdvisor || {}),
      [name]: type === "checkbox" ? checked : value
    }
    if(name === "accessType" && value === "disable" && checked) {
      accessAdvisor = {
        [name]: type === "checkbox" ? checked : value
      }
    }
    this.setState({accessAdvisor})
  }

  onContinuousComplianceChange = (event) => {
    const {name, value, type, checked} = event.target
    let continuousCompliance = {
        ...(this.state.continuousCompliance || {}),
      [name]: type === "checkbox" ? checked : value
    }
    if(name === "accessType" && value === "disable" && checked) {
      continuousCompliance = {
        [name]: type === "checkbox" ? checked : value
      }
    }
    this.setState({continuousCompliance})
  }

  render() {
    const { accessAdvisor, continuousCompliance } = this.state
    return (
        <Container className="dashboard application-manage">
        <Card>
          <CardHeader className='custom-card-header'>
            <Row className="align-items-center">
              <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/website (1).png")} style={{width: 40}}/></a></span>
                <h4 className="mt-10">Intelligent Identity</h4>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
          <Row>
            <Col sm={12} md={12} lg={6}>
              <Row>
                <Col className="mt-10" md={12} lg={12}>
                  <Radio.Group name="accessType" onChange={this.onAccessAdvisorChange} value={accessAdvisor.accessType || ""}>
                    <Radio value="all">All Users</Radio>
                    <Radio value="employees">Only employees</Radio>
                    <Radio value="disable">Disable</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <Row className="mt-10">
                <Col md={12} sm={12} xs={12}>
                  <span className="mr-10"><b>Access Advisor</b></span>
                </Col>
                <Col md={12} sm={12} xs={12}>
                  <Row className="align-items-center">
                    <Col md={4} sm={4} xs={12}>
                      <Input className="mt-10" value={"Intelligent Identity"} disabled/>
                    </Col>
                    <Col md={4} sm={4} xs={12}>
                      <label><b>Threshold:&nbsp;</b></label>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${accessAdvisor.threshold || 0}%`}
                        parser={value => value.replace('%', '')}
                        onChange={(value) => this.onAccessAdvisorChange({ target: { name: 'threshold', value }})}
                        disabled={accessAdvisor.accessType === 'disable'}
                      />
                    </Col>
                    <Col md={4} sm={4} xs={12}>
                      <Checkbox
                        checked={accessAdvisor.checkBox1 || false}
                        name="checkBox1"
                        onChange={this.onAccessAdvisorChange}
                        disabled={accessAdvisor.accessType === 'disable'}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col className="mt-10" md={12} sm={12} xs={12}>
                  <Row className="align-items-center">
                    <Col md={4} sm={4} xs={12}>
                      <Input.TextArea
                        placeholder="Text here..."
                        value={"Intelligent Identity"}
                        autosize={{minRows: 2, maxRows: 6}}
                        disabled
                      />
                    </Col>
                    <Col md={4} sm={4} xs={12} />
                    <Col md={4} sm={4} xs={12}>
                      <Checkbox
                        checked={accessAdvisor.checkBox2 || false}
                        name="checkBox2" onChange={this.onAccessAdvisorChange}
                        disabled={accessAdvisor.accessType === 'disable'}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-10">
                <Col md={3} sm={3} xs={6}>
                  <span className="mr-10"><b>Auto Approve</b></span>
                </Col>
                <Col md={2} sm={2} xs={6}>
                  <Checkbox
                    checked={accessAdvisor.checkBox3 || false}
                    name="checkBox3"
                    onChange={this.onAccessAdvisorChange}
                    disabled={accessAdvisor.accessType === 'disable'}
                  />
                </Col>
              </Row>

              <hr/>
              <Row>
                <Col className="mt-10" md={12} lg={12}>
                  <Radio.Group name="accessType" onChange={this.onContinuousComplianceChange} value={continuousCompliance.accessType || ""}>
                    <Radio value="all">All Users</Radio>
                    <Radio value="employees">Only employees</Radio>
                    <Radio value="disable">Disable</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <Row className="mt-10">
                <Col md={12} sm={12} xs={12}>
                  <span className="mr-10"><b>Continuous Compliance</b></span>
                </Col>
                <Col className="mt-10" md={12} sm={12} xs={12}>
                  <Row className="align-items-center">
                    <Col md={6} sm={6} xs={12}>
                      Disable User When
                    </Col>
                    <Col md={6} sm={6} xs={12}>
                      <Checkbox
                        checked={continuousCompliance.checkBox4 || false}
                        name="checkBox4"
                        onChange={this.onContinuousComplianceChange}
                        disabled={continuousCompliance.accessType === 'disable'}
                      >
                        High User Risk through SIEM/UEBA/CASB
                      </Checkbox>
                    </Col>
                  </Row>
                </Col>
                <Col className="mt-10" md={12} sm={12} xs={12}>
                  <Row className="align-items-center">
                    <Col md={6} sm={6} xs={12}>
                      Auto generate certification campaign when
                    </Col>
                    <Col md={6} sm={6} xs={12}>
                      <Checkbox
                        checked={continuousCompliance.checkBox5 || false}
                        name="checkBox5"
                        onChange={this.onContinuousComplianceChange}
                        disabled={continuousCompliance.accessType === 'disable'}
                      >
                        High User Risk through SIEM/UEBA/CASB
                      </Checkbox>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default IntelligentIdentity;
