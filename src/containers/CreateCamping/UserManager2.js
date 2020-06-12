import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col,} from "reactstrap";
import {Input, Select, Icon, Table, Checkbox, Radio, DatePicker, Steps, Button, InputNumber} from 'antd';

const {TextArea} = Input;
const Search = Input.Search;
const {Option} = Select;
const {Step} = Steps;


class UserManager2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      reminderFrequencyOption: ['Every', 'BeforeDueDate'],
      includedAppsOptions: ['App1', 'App2', 'App3', 'App4', 'App5'],
      reminderFrequencies: [{frequency: '', days: ''}],
      SendReminderEmail: false,
      IncludedApps: '',
      includedAppsData: [],
      certOwners: ['user 1', 'user 2', 'user 3', 'user 4'],
    };
  }
  
  next() {
    const current = this.state.current + 1;
    this.setState({current});
  }
  
  prev() {
    const current = this.state.current - 1;
    this.setState({current});
  }
  
  selectChange = (e) => {
    const {reminderFrequencies} = this.state;
    let {reminderFrequencyOption} = this.state;
    reminderFrequencies[e.target.index][e.target.name] = e.target.value;
    this.setState({
      reminderFrequencies,
      reminderFrequencyOption
    });
  }
  
  onAddFrequency = e => {
    let reminderFrequencies = this.state.reminderFrequencies.concat([{frequency: '', days: ''}])
    this.setState({
      reminderFrequencies
    })
  }
  onDeleteFrequency = (index) => {
    const {reminderFrequencies} = this.state;
    this.setState({
      reminderFrequencies: reminderFrequencies.filter((x, i) => i !== index)
    })
  }
  onCheckBoxCheck = (e) => {
    const newState = {};
    const {name, checked} = e.target;
    if (name === 'isOneTime' && checked) {
      newState.frequency = '';
    }
    if (name === 'isRunNow' && checked) {
      newState.startDate = null;
    }
    this.setState({
      [e.target.name]: e.target.checked,
      ...newState
    })
  }
  
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  onDatePickerChange = (date, dateString, name) => {
    this.setState({
      [name]: date,
    })
  }
  
  firstStep = () => {
    const {certOwners} = this.state;
    return (
      <Row className="align-items-center mt-20">
        <Col md={3} sm={12} xs={12}><b>Certification Name</b></Col>
        <Col md={9} sm={12} xs={12}><Input/></Col>
        <Col md={3} sm={12} xs={12}><b>Description</b></Col>
        <Col md={9} sm={12} xs={12} className="mt-10"><TextArea/></Col>
        <Col md={3} sm={12} xs={12}><b>Cert Owner</b></Col>
        <Col md={9} sm={12} xs={12} className="mt-10">
          <Select
            showSearch
            className="w-100-p"
            filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              certOwners.map(cert => <Option value={cert}>{cert}</Option>)
            }
          </Select>
        </Col>
        <Col md={3} sm={12} xs={12}><b>Certifier</b></Col>
        <Col md={9} sm={12} xs={12} className="mt-10">
          <Checkbox>Is User Manager</Checkbox>
        </Col>
      </Row>
    )
  }
  
  secondStep = () => {
    const {isOneTime, isRunNow, frequency, startDate} = this.state;
    return (
      <Row className="align-items-center mt-20">
        <Col md={3} sm={12} xs={12}><b>Frequency</b></Col>
        <Col md={7} sm={12} xs={12} className="mt-10">
          <Select disabled={isOneTime} value={frequency}
                  onChange={(value) => this.onChange({target: {name: 'frequency', value}})} style={{width: "100%"}}>
            <Option value="30">30 Days</Option>
            <Option value="60">60 Days</Option>
            <Option value="90">90 Days</Option>
          </Select>
        </Col>
        <Col md={2} sm={12} xs={12}><Checkbox checked={isOneTime} name="isOneTime" onChange={this.onCheckBoxCheck}>One
          Time</Checkbox></Col>
        <Col md={3} sm={12} xs={12}><b>Start Date</b></Col>
        <Col md={7} sm={12} xs={12} className="mt-10">
          <DatePicker disabled={isRunNow} value={startDate || null} className="w-100-p"
                      onChange={(date, dateString) => this.onDatePickerChange(date, dateString, 'startDate')}/>
        </Col>
        <Col md={2} sm={12} xs={12}>
          <Checkbox checked={isRunNow} name="isRunNow" onChange={this.onCheckBoxCheck}>
            Run Now
          </Checkbox>
        </Col>
        <Col md={3} sm={12} xs={12}><b>Campaign Duration</b></Col>
        <Col md={7} sm={12} xs={12} className="mt-10">
          <InputNumber className="w-100-p"/>
        </Col>
        <Col md={1} sm={12} xs={12} className="mt-10">
          <span>Days</span>
        </Col>
        
        <Col md={3} sm={12} xs={12}>
          <b>Undecided Access</b>
        </Col>
        <Col md={9} sm={12} xs={12} className="mt-10">
          <Radio.Group name="radiogroup">
            <Radio value={1}>Maintain access to undecided items</Radio>
            <Radio value={2}>Revoke access to undecided items</Radio>
          </Radio.Group>
        </Col>
      </Row>
    )
  }
  
  addIncludedApps = () => {
    const {selectedApp, includedAppsData} = this.state;
    if (selectedApp) {
      const data = {AppName: selectedApp};
      includedAppsData.push(data)
    }
    this.setState({
      includedAppsData,
      selectedApp: ''
    });
  }
  
  removeIncludedApps = (index) => {
    const {includedAppsData} = this.state;
    this.setState({
      includedAppsData: includedAppsData.filter((x, i) => i !== index)
    });
  }
  
  thirdStep = () => {
    const {selectedApp, includedAppsOptions, includedAppsData} = this.state;
    const includedAppsOptionList = includedAppsOptions.filter(x => {
      return includedAppsData.find(y => y.AppName === x) ? false : true;
    });
    const columns = [
      {
        title: "App Name",
        dataIndex: 'AppName',
        width: '20%'
      },
      {
        title: "Action",
        width: '20%',
        render: (record, el, index) => {
          return (
            <Icon type="delete" onClick={() => this.removeIncludedApps(index)}/>
          )
        }
      },
    ]
    
    return (
      <Row className="align-items-start mt-20">
        <Col md="6" sm="12">
          <Row className="align-items-center">
            <Col md={3} sm={12} xs={12}><b>Included Apps</b></Col>
            <Col md={6} sm={12} xs={12}>
              <Select name="selectedApp"
                      style={{width: "100%"}}
                      value={selectedApp}
                      filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      onChange={(value) => this.onChange({
                        target: {
                          name: 'selectedApp',
                          value
                        }
                      })}>
                {
                  includedAppsOptionList.map(x => <Option
                    value={x}>{x}</Option>)
                }
              </Select>
            </Col>
            <Col md={3} sm={12} xs={12}>
              <Button className="square mb-0" size={"sm"} color="primary" onClick={this.addIncludedApps}><p>Add</p>
              </Button>
            </Col>
            <Col md={12} sm={12} xs={12} className="mt-20">
              <Table columns={columns} dataSource={includedAppsData}/>
            </Col>
          </Row>
        </Col>
        <Col md="6" sm="12">
          <Row className="align-items-center">
            <Col md={12} sm={12} xs={12}><b>Included User</b></Col>
            <Col md={3} sm={12} xs={12} className="mt-10"><b>Department</b></Col>
            <Col md={2} sm={12} xs={12}>
              <Radio>All</Radio>
            </Col>
            <Col md={7} sm={12} xs={12} className="mt-20">
              <Search enterButton/>
            </Col>
            <Col md={3} sm={12} xs={12}><b>Roles</b></Col>
            <Col md={2} sm={12} xs={12}>
              <Radio>All</Radio>
            </Col>
            <Col md={7} sm={12} xs={12} className="mt-10">
              <Search enterButton/>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
  
  fourthStep = () => {
    const {reminderFrequencies = [], SendReminderEmailReviewers, reminderFrequencyOption} = this.state;
    const length = reminderFrequencies.length;
    const reminderFrequencyOptions = reminderFrequencies.find(x => x.frequency === 'Every') ? reminderFrequencyOption.filter(x => x !== 'Every') : reminderFrequencyOption;
    return (
      <Row className="mt-20 align-items-center  step-row">
        <Col md={12} sm={12} xs={12} className="mt-10">
          <Checkbox>Send Welcome Email to Reviewers</Checkbox>
        </Col>
        <Col md={12} sm={12} xs={12} className="mt-10">
          <Checkbox checked={SendReminderEmailReviewers} name="SendReminderEmailReviewers"
                    onChange={this.onCheckBoxCheck}>Send Reminder email to Reviewers</Checkbox>
        </Col>
        {
          SendReminderEmailReviewers ?
            <Col md={12} sm={12} xs={12} className="mt-10 ml-25">
              <Checkbox>cc Reminder email to Reviewer manager</Checkbox>
            </Col> : null
        }
        <Col md={2} sm={12} xs={12} className="mt-10"><b>Reminder Frequency</b></Col>
        <Col md={10} sm={12} xs={12} className="mt-10">
          {reminderFrequencies.map((reminderFrequency, index) => {
            return (
              <Row key={index}>
                <Col md={3} className="mt-10">
                  <Select className="w-100-p" name="frequency" value={reminderFrequency.frequency}
                          onChange={(value) => this.selectChange({target: {name: 'frequency', value, index}})}>
                    {
                      reminderFrequencyOptions.map(x => <Option
                        value={x}>{x}</Option>)
                    }
                  </Select>
                </Col>
                <Col md={3} className="mt-10">
                  <InputNumber name="days" className="w-80-p" value={reminderFrequency.days}
                               onChange={(value) => this.selectChange({target: {name: 'days', value, index}})}/> {' '}Days
                </Col>
                <Col md={1} className="mt-10">
                  {index > 0 &&
                  <Icon type="delete" className="fs-18 mr-10" onClick={() => this.onDeleteFrequency(index)}
                        theme="twoTone"/> }
                  {length - 1 === index ?
                    <Icon type="plus-circle" className="fs-18" onClick={this.onAddFrequency} theme="twoTone"/> : null}
                </Col>
              </Row>
            )
          })}
        </Col>
      </Row>
    )
  }
  
  render() {
    const {current} = this.state;
    return (
      <Container className="dashboard">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Steps size="small" current={current}>
                  <Step title="Basic Definition"/>
                  <Step title="Campaign Schedule"/>
                  <Step title="Campaign Scope"/>
                  <Step title="Campaign Notification"/>
                </Steps>
                {current === 0 && this.firstStep()}
                {current === 1 && this.secondStep()}
                {current === 2 && this.thirdStep()}
                {current === 3 && this.fourthStep()}
                <div className="mt-20">
                  {current >= -1 && current < 3 &&
                  
                  <Button className="float-right" type="primary" onClick={() => this.next()}>
                    Next
                  </Button>
                  }
                  {
                    current === 3 &&
                    <>
                    <Button type="primary float-right">Save as Draft</Button>
                    <Button type="primary float-right" className="mr-5">Submit / Create</Button>
                    </>
                  }
                  {current > 0 && (
                    <Button onClick={() => this.prev()}>
                      Previous
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserManager2