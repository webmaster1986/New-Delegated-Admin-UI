import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import {
  DatePicker, Input, Radio, Form, Button
} from 'antd';
import moment from "moment";

const dateFormat = 'YYYY/MM/DD';

class SetupProxy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proxyForm: {
        type: "manager"
      },
      errors: {}
    };
  }

  onChange = (event) => {
    const {name, value} = event.target
    this.setState((prevState) => ({
      proxyForm: {
        ...(prevState.proxyForm || {}),
        [name]: value
      }
    }))
  }

  onDateChange = (name, dateString) => {
    this.setState((prevState) => ({
      proxyForm: {
        ...(prevState.proxyForm || {}),
        [name]: dateString
      }
    }))
  }

  handleReset = () => {
    this.setState({
      proxyForm: {
        type: "manager"
      },
      errors: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {proxyForm} = this.state
    let errors = {}
    const fields = ["type", "name", "startDate", "endDate"]
    fields.forEach((key) => {
      if(!proxyForm[key]){
        errors = {
          ...errors,
          [key]: "Required"
        }
      }
    })
    if(Object.keys(errors).length) {
      this.setState({
        errors
      })
      return
    }
    this.setState({
      proxyForm: {
        type: "manager"
      },
      errors: {}
    })
    alert("Submitted successfully")
  }

  render() {
    const { proxyForm, errors } = this.state
    return (
      <Card className="mt-20">
        <CardHeader>
          <Row className="align-items-center">
            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                          src={require("../../images/user.png")} style={{width: 40}}/></a></span>
              <h4 className="mt-10">Setup Proxy</h4>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col sm={12} md={6} lg={6}>
                <Row>
                  <Col className="mt-10" md={12} lg={12}>
                    <Radio.Group name="type" onChange={this.onChange} value={proxyForm.type || ""}>
                      <Radio value="manager">My Manager</Radio>
                      <Radio value="someone">I have someone else in mind</Radio>
                    </Radio.Group>
                    <p className="text-danger m-0">{errors.type || ""}</p>
                  </Col>
                  {
                    proxyForm.type === "someone" ?
                      <Col className="mt-10" md={12} lg={12}>
                        <label>* Proxy Name</label>
                        <Input name="name" placeholder="Enter Name to search" value={proxyForm.name || ""} onChange={this.onChange}/>
                        <p className="text-danger m-0">{errors.name || ""}</p>
                      </Col> : null
                  }
                  <Col className="mt-10" md={12} sm={12} xs={12}>
                    <label>* Start Date</label>
                    <DatePicker name="startDate" value={proxyForm.startDate ? moment(proxyForm.startDate, dateFormat) : ""} format={dateFormat} style={{width: '100%'}} onChange={(date, dateString) => this.onDateChange('startDate',dateString)} required/>
                    <p className="text-danger m-0">{errors.startDate || ""}</p>
                  </Col>
                  <Col className="mt-10" md={12} sm={12} xs={12}>
                    <label>* End Date</label>
                    <DatePicker name="endDate" value={proxyForm.endDate ? moment(proxyForm.endDate, dateFormat) : ""} format={dateFormat} style={{width: '100%'}} onChange={(date, dateString) => this.onDateChange('endDate',dateString)} required/>
                    <p className="text-danger m-0">{errors.endDate || ""}</p>
                  </Col>
                  <Col className="mt-10" md={12} sm={12} xs={12}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    )
  }
}

export default SetupProxy;
