import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import './createUser.scss';
import '../Home/Home.scss';
import {
    DatePicker,
    Input,
    Button,
    Tabs,
    Table,
    Modal,
    Icon,
    Spin,
    Select,
    message
} from "antd";
import moment from "moment";
import { ApiService } from "../../services/ApiService1"

const {TextArea} = Input;
const { TabPane } = Tabs;

const userField = { active: true }

class ModifyUser extends Component {
    _apiService = new ApiService()
    state = {
        isSaving: false,
        activeKey: '',
        Application: [],
        PhoneNumber: '',
        TenantID: '',
        Role: [],
        entitlements: [],
        sodViolation: (this.props.selectedRecord || {}).UserName === "AJACKSON" ? [] : [
          {
            name: "HCM SoD Policy Violation",
            description: "User should not be granted Payroll Role and HR Role",
            details: [
                {
                    name: "Payroll Manager",
                    description: "Responsible for running and maintaining user payroll",
                    application: "HCM",
                    type: "Group",
                    endDate: "05/29/2020",
                    entity: {
                        requestorComments: 'Temp access required due to role transition',
                        approverComments: 'Temp access granted',
                        requestedOn: '05/06/2020',
                        startDate: '05/06/2020',
                        endDate: '05/29/2020',
                        approvalDetails: [
                            {
                                action: 'Request Submission',
                                date: '05/06/2020',
                                status: 'Submitted',
                                assignedTo: "NA",
                                comments: ''
                            },
                            {
                                action: 'Assigned to Manager',
                                date: '05/06/2020',
                                status: 'Assigned',
                                assignedTo: "AMURRAY",
                                comments: ''
                            },
                            {
                                action: "Manager Approval",
                                date: '05/06/2020',
                                status: "Approved",
                                assignedTo: "AMURRAY",
                                comments: ''
                            },
                            {
                                action: "Request Completed",
                                date: '',
                                status: "",
                                assignedTo: "",
                                comments: ''
                            },
                        ]
                    }
                },
                {
                    name: "Human Resource Manager",
                    description: "Manage Employee master data",
                    application: "HCM",
                    type: "Group",
                    endDate: "05/29/2020",
                    entity: {
                        requestorComments: '',
                        approverComments: '',
                        requestedOn: '05/06/2020',
                        startDate: '05/06/2020',
                        endDate: '05/29/2020',
                        approvalDetails: [
                            {
                                action: 'Request Submission',
                                date: "05/06/2020",
                                status: 'Submitted',
                                assignedTo: "NA",
                                comments: ''
                            },
                            {
                                action: 'Assigned to Manager',
                                date: "05/06/2020",
                                status: 'Assigned',
                                assignedTo: "AMURRAY",
                                comments: ''
                            },
                            {
                                action: "Manager Approval",
                                date: "05/06/2020",
                                status: "Approved",
                                assignedTo: "AMURRAY",
                                comments: ''
                            },
                            {
                                action: "Request Completed",
                                date: '',
                                status: "",
                                assignedTo: "",
                                comments: ''
                            },
                        ]
                    }
                }
            ]
          }
        ],
        expendedRows: [],
        isCommentModal: false,
        comment: {},
        userDetails: userField
    };

    componentDidMount() {
        const { selectedRecord = {} } = this.props;
        let entitlements  = [];
        (selectedRecord.Application || []).forEach((x) =>{
            (x.Entitlement || []).forEach((y) =>{
                entitlements.push({Category: 'Application', ApplicationName: x['Application Name'], Name: y.Name, Value: y.Value })
            })
        });

        this.setState({
            ...(selectedRecord || {}),
            Application: selectedRecord.Application,
            PhoneNumber: selectedRecord.PhoneNumber,
            TenantID: selectedRecord.TenantID,
            Role: selectedRecord.Role,
            entitlements,
            userDetails: selectedRecord && Object.keys(selectedRecord).length ? selectedRecord : userField
        })
}

    onTabChange = (activeKey) => {
        this.setState({
            activeKey
        })
    }
  
    onUserDetailsChange = (event) => {
    this.setState({
        userDetails: {
            ...this.state.userDetails,
            [event.target.name]: event.target.value
        }
    })
  }
  
    onDateChange = (name, dateString) => {
    this.setState({
      [name]: dateString
    })
  }
  
    Attributes = () => {
    const { LicenseID, LicenseName, LicenseExpiry, TrainingExpiry, TrainingCompletion, TrainingType, userDetails } = this.state;
    const { firstname, middleName, organization, lastName, emails, displayName, userType, userName, active, id } = userDetails || {};
    return(
      <div>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span><b>First Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      name="firstname"
                      onChange={this.onUserDetailsChange}
                      value={firstname}
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Middle Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      className="mt-10"
                      onChange={this.onUserDetailsChange}
                      name="middleName"
                      value={middleName}
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Last Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      name="lastName"
                      value={lastName}
                      onChange={this.onUserDetailsChange}
                      className="mt-10"
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>User Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      className="mt-10"
                      onChange={this.onUserDetailsChange}
                      name="userName"
                      value={userName}
                      disabled={id}
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Organization</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      value={organization}
                      onChange={this.onUserDetailsChange}
                      name="organization"
                      className="mt-10"
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>E-mail</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      name="emails"
                      value={emails}
                      onChange={this.onUserDetailsChange}
                      className="mt-10"
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Display Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input
                      className="mt-10"
                      value={displayName}
                      name="displayName"
                      onChange={this.onUserDetailsChange}
                  />
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>User Type</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Select
                      className="w-100-p mt-10"
                      name="userType"
                      value={userType}
                      onChange={(value) => this.onUserDetailsChange({
                          target: {
                              name: 'userType',
                              value
                          }
                      })}
                  >
                      <Select.Option value="employee">Employee</Select.Option>
                      <Select.Option value="contractor">Contractor</Select.Option>
                      <Select.Option value="intern">Intern</Select.Option>
                      <Select.Option value="temporary">Temporary</Select.Option>
                      <Select.Option value="service">Service</Select.Option>
                      <Select.Option value="external">External</Select.Option>
                      <Select.Option value="generic">Generic</Select.Option>
                  </Select>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Identity Status</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Button type={active ? "primary" : ''} size="small" className="mt-10 mr-10" onClick={() => this.onUserDetailsChange({target: {name: 'active', value: true}})}>Active</Button>
                  <Button type={!active ? "primary" : ''} size="small" className="mt-10" onClick={() => this.onUserDetailsChange({target: {name: 'active', value: false}})}>Inactive</Button>
              </Col>
          </Row>
          <hr/>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span className="mr-10"><b>License</b></span>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>ID</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <Input value={LicenseID} name="LicenseID" onChange={this.onChange} />
                      </Col>
                  </Row>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>Name</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <Input value={LicenseName} name="LicenseName" onChange={this.onChange} />
                      </Col>
                  </Row>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>Expiry Date</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <DatePicker value={LicenseExpiry ? moment(LicenseExpiry): null} onChange={(date, dateStr) => this.onDateChange('LicenseExpiry', dateStr)} format="MM/DD/YYYY"  style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
          </Row>
          <hr/>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span className="mr-10"><b>Training</b></span>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>Type</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <Select style={{width: "100%"}} value={TrainingType} onChange={(value) => this.onChange({target: {name: 'TrainingType', value}})}>
                              <Option value={""}>Select</Option>
                              <Option value={"Security & Awareness Training"}>Security & Awareness Training</Option>
                              <Option value={"Role Based Security Training"}>Role Based Security Training</Option>
                              <Option value={"Contingency Training"}>Contingency Training</Option>
                              <Option value={"Incident Response Training"}>Incident Response Training</Option>
                              <Option value={"Privacy Awareness Training"}>Privacy Awareness Training</Option>
                          </Select>
                      </Col>
                  </Row>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>Completion Date</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <DatePicker value={TrainingCompletion ? moment(TrainingCompletion): null} onChange={(date, dateStr) => this.onDateChange('TrainingCompletion', dateStr)} format="MM/DD/YYYY" style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
              <Col md={3} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={4} sm={12} xs={12}>
                          <span><b>Expiry Date</b></span>
                      </Col>
                      <Col md={8} sm={12} xs={12}>
                          <DatePicker value={TrainingExpiry ? moment(TrainingExpiry): null} onChange={(date, dateStr) => this.onDateChange('TrainingExpiry', dateStr)} format="MM/DD/YYYY" style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
          </Row>
          <hr/>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span className="mr-10"><b>Account Effective</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>Start Date</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <DatePicker style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>End Date</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <DatePicker style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
          </Row>
          <hr/>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span className="mr-10"><b>Provisioning Effective</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>Start Date</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <DatePicker style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>End Date</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <DatePicker style={{width: '100%'}}/>
                      </Col>
                  </Row>
              </Col>
          </Row>
          <hr/>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span className="mr-10"><b>Contact Information</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>Telephone</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <Input/>
                      </Col>
                  </Row>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Row className="align-items-center">
                      <Col md={3} sm={12} xs={12}>
                          <span><b>Postal Code</b></span>
                      </Col>
                      <Col md={9} sm={12} xs={12}>
                          <Input/>
                      </Col>
                  </Row>
              </Col>
          </Row>
      </div>
    )
  }

    Account = () => {
        const {Application} =this.state;
        const columns = [
            {
                title: 'Application Name',
                dataIndex: 'Application Name',
            },
            {
                title: 'Account ID',
                render: (record) => (<span>{record['Account ID']}
                    {
                        record.ApplicationProfile && Object.keys(record.ApplicationProfile).length ?
                        <Icon type="info-circle" className="ml-5" theme="twoTone"
                              onClick={() => this.onToggleModal(record.ApplicationProfile)}/> : null

                    }</span>)
            },
            {
                title: 'Action',
                render: (record) => (<span><Button>Remove</Button></span>)
            },
            
        ];
        return(
            <Row>
                <Col md={12} sm={12} xs={12}>
                    <Table columns={columns} size="small" dataSource={Application}/>
                </Col>
            </Row>
        )
    }

    Entitlement = () => {
        const {entitlements} =this.state;
        const columns = [
            {
                title: 'Name',
                render: (record) => (<span>{record.Value || '-'}</span>)
            },
            {
                title: 'Description',
                render: (record) => (<span>{record.Value || '-'}</span>)
            },
            {
                title: 'Application',
                render: (record) => (<span>{record.ApplicationName || '-'}</span>)
            },
              {
                title: 'Type',
                render: (record) => (<span>{record.Name || '-'}</span>)
              },
            {
                title: 'Action',
              render: (record) => (<span><Button>Remove</Button></span>)
            },
        ];
        return(
            <Row>
                <Col md={12} sm={12} xs={12}>
                    <Table columns={columns} size="small" dataSource={entitlements}/>
                </Col>
            </Row>
        )
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onExpandedRowsChange = (data) => {
        const d = []
        d.push(data[data.length-1])
        this.setState({
            expendedRows: d,
            selectedIndex: null,
        });
    }

    onExpand = (record) => {
        const keys = ['Date Requested', 'Requestor comments', 'Start date', 'End date', 'Approver comments']
        const values = ['requestedOn', 'requestorComments', 'startDate', 'endDate', 'approverComments']
        return(
          <div className="expand-header">
              <Row className="mt-10">
                  <Col md={6} sm={12} xs={12}>
                      <h4 style={{color: 'gray'}}>Entity Details</h4>
                      <Row className="mt-10">
                          {
                              keys.map((key, index) => (
                                <>
                                    <Col md={6} sm={12} xs={12}>
                                        <p><b>{key}: </b></p>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        <p>{record.entity[values[index]]}</p>
                                    </Col>
                                </>
                              ))
                          }
                      </Row>
                  </Col>
                  <Col md={6} sm={12} xs={12}>
                      <h4 style={{color: 'gray'}}>Approval Details</h4>
                      <Table
                        className="mr-10"
                        columns={[
                            {
                                title: 'Action',
                                dataIndex: 'action'
                            },
                            {
                                title: 'Date',
                                dataIndex: 'date'
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status'
                            },
                            {
                                title: 'Assigned To',
                                dataIndex: 'assignedTo'
                            },
                            {
                                title: 'Comments',
                                dataIndex: 'comments',
                                render: (record, data) => (
                                  <Icon type="eye" className="color-blue" onClick={() => this.onToggleComment(data)}/>
                                )
                            }

                        ]}
                        rowKey={"id"}
                        size="small"
                        dataSource={record.entity.approvalDetails}
                      />
                  </Col>
              </Row>
          </div>
        )
    }

    expandedRowRender = (mainRecord) => {
        const {expendedRows} = this.state
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name'
            },
            {
                title: 'Description',
                dataIndex: 'description'
            },
            {
                title: 'Application',
                dataIndex: 'application'
            },
            {
                title: 'Type',
                dataIndex: 'type'
            },
            {
                title: 'End date',
                dataIndex: 'endDate'
            },
            {
                title: 'Action',
                dataIndex: 'action',
                render: (record) => (
                  <span>
                      <Button size={"default"} type="danger" onClick={() => {}}>Remove</Button>
                  </span>
                )
            }
        ];
        return (
          <Card className="antd-table-nested">
              <Table
                columns={columns}
                size="small"
                dataSource={(mainRecord && mainRecord.details) || []}
                pagination={false}
                expandIcon={this.customExpandIcon}
                onExpandedRowsChange={this.onExpandedRowsChange}
                expandedRowRender={(record) => {
                    return (
                      <div>
                          {this.onExpand(record)}
                      </div>
                    )
                }}
                expandedRowKeys={expendedRows}
                onRow={
                    (record, index) => {
                        return {
                            className: expendedRows.includes(index) ? 'expanded-tr' : ''
                        };
                    }
                }
              />
          </Card>
        );
    };

    SODViolations = () => {
        const {sodViolation} =this.state;
        const columns = [
            {
                key: 'name',
                title: 'Application',
                width: "100%",
                render: (record, data) => (
                  <div>
                      <b>{record.name}</b>
                      <div><small>{data.description}</small></div>
                  </div>
                )
            }
        ]
        return(
          <Row>
              <Col md={12} sm={12} xs={12}>
                  <div className="inner-profile-right certification-owner">
                      <Table
                        columns={columns}
                        size="medium"
                        className={`user-profile-data no-padding-table`}
                        expandedRowRender={this.expandedRowRender}
                        expandIcon={this.customExpandIcon}
                        dataSource={sodViolation || []}
                        defaultExpandAllRows={true}
                        pagination={false}
                        showHeader={false}
                        onRow={
                            (record, index) => {
                                return {
                                    className: this.state.expendedRows.includes(index) ? 'expanded-tr' : ''
                                };
                            }
                        }
                      />
                  </div>
              </Col>
          </Row>
        )
    }

    onCancelModifyUser = (isModifyUser,) => {
        this.props.onCloseModifyUser({}, isModifyUser)
    }

    onToggleModal = (appData) => {
        this.setState({
            isModal: !this.state.isModal,
            appData: appData || null
        })
    }

    onToggleComment = (record) => {
        this.setState({
            isCommentModal: !this.state.isCommentModal,
            comment: !this.state.isComment ? record : null
        });
    }

    onUpdateUser = async () => {
        const { userDetails } = this.state
        this.setState({
            isSaving: true
        })
        const data = await this._apiService.updateUser(userDetails)
        if (!data || data.error) {
            message.error('something is wrong! please try again');
            this.setState({
                isSaving: false
            })
        } else {
            message.success("User updated Successfully");
            this.setState({
                isSaving: false
            })
        }
    }

    commentModal = () => {
        const {comment, isCommentModal} = this.state;
        return (
          <Modal
            width={400}
            onCancel={this.onToggleComment}
            visible={isCommentModal}
            footer={
                <div>
                    <Button  onClick={this.onToggleComment}>Cancel</Button>
                </div>
            }
          >
              <div className="mr-15"><TextArea placeholder='Comments..' value={comment.text || "Comments here.."} rows={4} cols={5} disabled/></div>
          </Modal>
        )
    }

    render() {
        const { isSaving, userDetails = {} } = this.state
        return(
            <Card>
                {this.commentModal()}
                <CardHeader>
                    <Row className="align-items-center">
                        <Col md={6} sm={12} xs={12} className="d-flex">
                            <span className="cursor-pointer ml-5 mr-5">
                                <a>
                                    <img src={require("../../images/create-user.png")} style={{width: 40}}/>
                                </a>
                            </span>
                            <h4 className="mt-10">Profile</h4>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <div className="text-right">
                                <Button
                                    className="square ml-10"
                                    size={"large"}
                                    color="primary"
                                    onClick={this.onUpdateUser}
                                    disabled={isSaving || userDetails && !userDetails.id}
                                >
                                    {
                                        isSaving ?
                                            <Spin className='color-white mr-10'/> : null
                                    }
                                    Submit
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={12} sm={12} xs={12}>
                            <Tabs defaultActiveKey="attributes" onChange={this.onTabChange} size="small">
                                <TabPane tab="Attributes" key="attributes">
                                    {this.Attributes()}
                                </TabPane>
                                <TabPane tab="Accounts" key="account">
                                    {this.Account()}
                                </TabPane>
                                <TabPane tab="Entitlement" key="entitlement">
                                    {this.Entitlement()}
                                </TabPane>
                                <TabPane tab="Risk Score" key="riskScore">
                                    Risk Score To be implement
                                </TabPane>
                                <TabPane tab="SoD Violations" key="SODValidation">
                                    {this.SODViolations()}
                                </TabPane>
                                <TabPane tab="Activities" key="activities">
                                    Activities To be implement
                                </TabPane>
                            </Tabs>
                        </Col>
                        </Row>
                </CardBody>
                {
                    this.state.isModal &&
                    <Modal
                        visible={this.state.isModal}
                        onCancel={this.onToggleModal}
                        title={null}
                        footer={
                            null
                        }
                        width={810}
                    >
                            {
                                this.state.appData && Object.keys(this.state.appData).map(x => {
                                    return (
                                        <div><b>{x}:</b> {' '+ this.state.appData[x]}</div>
                                    );
                                })
                            }
                    </Modal>
                }

            </Card>
        )
    }
}
export default ModifyUser
