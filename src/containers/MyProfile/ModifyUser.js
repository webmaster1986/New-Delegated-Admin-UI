import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import './createUser.scss';
import '../Home/Home.scss';
import { Input, Button, Table, Modal, Icon } from "antd";

const {TextArea} = Input;
class ModifyUser extends Component {
    state = {
        isEdit: false,
        identityUsersList: [],
        isLoading: false,
        isModifyUser: false,
        activeKey: '',
        Application: [],
        Department: '',
        Email: '',
        FirstName: '',
        LastName: '',
        Manager: '',
        PhoneNumber: '',
        TenantID: '',
        Title: '',
        UserName: '',
        Role: [],
        entitlements: [],
        expendedRows: [],
        isCommentModal: false,
        comment: {}
    };

    componentDidMount() {
        const {selectedRecord} = this.props;
        let entitlements  = [];
        (selectedRecord.Application || []).forEach((x) =>{
            (x.Entitlement || []).forEach((y) =>{
                entitlements.push({Category: 'Application', ApplicationName: x['Application Name'], Name: y.Name, Value: y.Value })
            })
        });

      this.setState({
        ...(selectedRecord || {}),
        Application: selectedRecord.Application,
        Department: selectedRecord.Department,
        Email: selectedRecord.Email,
        FirstName: selectedRecord.FirstName,
        LastName: selectedRecord.LastName,
        Manager: selectedRecord.Manager,
        PhoneNumber: selectedRecord.PhoneNumber,
        TenantID: selectedRecord.TenantID,
        Role: selectedRecord.Role,
        Title: selectedRecord.Title,
        UserName: selectedRecord.UserName,
        entitlements
      })
    }
  
    onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

    Attributes = () => {
    const {FirstName, Manager, LastName, Email, Title, UserType, MiddleName, LicenseID, LicenseName, LicenseExpiry, TrainingExpiry, TrainingCompletion, TrainingType} = this.state;
    const displayName = ` ${FirstName}${' '}${LastName}`
    return(
      <div>
          <Row className="align-items-center">
              <Col md={2} sm={12} xs={12}>
                  <span><b>First Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input name="FirstName" onChange={this.onChange} value={FirstName}/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Manager</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input name="Manager" onChange={this.onChange} value={Manager}/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Middle Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input className="mt-10" onChange={this.onChange} name="MiddleName" value={MiddleName}/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Organization</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input value={Title} onChange={this.onChange} name="Title" className="mt-10"/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Last Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input name="LastName" value={LastName} onChange={this.onChange} className="mt-10"/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>E-mail</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input name="Email" value={Email} onChange={this.onChange} className="mt-10"/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>Display Name</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input className="mt-10" value={displayName} name="displayName" onChange={this.onChange}/>
              </Col>
              <Col md={2} sm={12} xs={12}>
                  <span><b>User Type</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Input name="UserType" value={UserType} onChange={this.onChange} className="mt-10"/>
              </Col>
              <Col md={6} />
              <Col md={2} sm={12} xs={12}>
                  <span><b>Identity Status</b></span>
              </Col>
              <Col md={4} sm={12} xs={12}>
                  <Button type="primary" size="small" className="mt-10">Active</Button>
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
        return(
            <Card>
                {this.commentModal()}
                <CardHeader>
                    <Row className="align-items-center">
                        <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/create-user.png")} style={{width: 40}}/></a></span>
                            <h4 className="mt-10">Profile</h4>
                        </Col>
                        {   !this.props.isProfile ?
                            <Col md={6} sm={12} xs={12}>
                                <div className="text-right">
                                    <Button className="square ml-10" size={"large"} color="primary" onClick={() => this.onCancelModifyUser(false)}>&nbsp;<a><img src={require("../../images/multiply.png")} style={{width: 20}} /></a></Button>
                                </div>
                            </Col> : null
                        }
                    </Row>
                </CardHeader>
                <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                {this.Attributes()}
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
