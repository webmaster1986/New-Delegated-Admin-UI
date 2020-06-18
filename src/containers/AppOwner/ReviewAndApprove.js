import React, {Component} from 'react';
import {Card, CardBody, Col, Container, Row,} from "reactstrap";
import {Button, Checkbox, DatePicker, Icon, Input, Progress, Table,message, Spin} from "antd";
import '../Home/Home.scss';
import Panel from "../../shared/components/Panel";
import {ApiService} from "../../services/ApiService";
const {TextArea} = Input;
const {RangePicker,} = DatePicker;

class ReviewAndApprove extends Component {
    _apiService = new ApiService();
    constructor(props) {
        super(props);
        this.state = {
            isPremiumCustomer: true,
            requestId : '',
            organizationId: '',
            startDate: '',
            endDate: '',
            reviewAndApproveList: [],
            isLoading: false,
            isSaving: false
        };
    }

    checkBoxChange = (e) => {
        this.setState({
            isPremiumCustomer: e.target.checked
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onTextChange = (event, rowIndex, selectedRoeIndex) => {
        const {reviewAndApproveList} = this.state;
        reviewAndApproveList[selectedRoeIndex]['userList'][rowIndex][event.target.name] = event.target.value;
        this.setState({
            reviewAndApproveList
        })
    }

    onDateChange = (date, dateString) => {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        })
    }

    onSearch = async () => {
        const {requestId, organizationId, startDate, endDate} = this.state;
        this.setState({
            isLoading: true
        });
        let data = await this._apiService.getReviewAndApproveData(requestId, organizationId, startDate, endDate);
        if(!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
          (data || []).forEach((x)=> {
            x.userList = [{
              euEmail :x.euEmail,
              euFirstName: x.euFirstName,
              euLastName: x.euLastName,
              accessType: x.accessType,
              appDesc: x.appDesc,
              appId: x.appId,
              appName: x.appName,
              appRole: x.appRole,
              closingComment: x.closingComment,
              createdDate: x.createdDate,
              decision: x.decision,
              orgId: x.orgId,
              requestId: x.requestId,
              specialInstruction: x.specialInstruction,
              userAppId: x.userAppId
            }]
          });
          this.setState({
            reviewAndApproveList : data,
            isLoading: false
          })
        }
    }

    editTextArea = () => {
        this.setState({
            isEditTextArea: !this.state.isEditTextArea,
        })
    }

    onApprove = (rowIndex, selectedRoeIndex) => {
        const {reviewAndApproveList} = this.state;
        reviewAndApproveList[selectedRoeIndex]['userList'][rowIndex].decision = "Y";
        this.setState({
            reviewAndApproveList
        })
    }

    onDeny = (rowIndex, selectedRoeIndex) => {
        const {reviewAndApproveList} = this.state;
        reviewAndApproveList[selectedRoeIndex]['userList'][rowIndex].decision = "N";
        this.setState({
            reviewAndApproveList
        })
    }

    onReset = () => {
        this.setState({
            startDate: '',
            endDate: '',
            requestId: '',
            organizationId: ''
        })
    }

    onSubmitReviewAndApprove = async () => {
        this.setState({
            isSaving: true
        });
        const {reviewAndApproveList} = this.state;
        let payload = [];
        (reviewAndApproveList || []).forEach((x) => {
            const userData = x.userList[0];
            const objPayload = {
                ...x,
                ...userData,
                userList: undefined,
            };
            payload.push(objPayload);
        });
        const data = await ApiService.putReviewAndApproveData(payload);
        if(!data || data.error) {
            this.setState({
                isSaving: false
            });
            return message.error('something is wrong! please try again');
        }else {
            this.setState({
                isSaving: false
            });
            return message.success('Review And Approve update successfully!');
        }
    }

    nestedTable = (mainRecord, selectedRoeIndex) => {
        const columns = [
            {
                title: 'User Detail',
                width:'20%',
                render: (record) => (
                    <div>
                        <div>{record.euFirstName} {record.euLastName}</div>
                        <div>{record.euEmail}</div>
                    </div>
                )
            },
            {
                title: 'Access Type',
                width:'10%',
                render: (record) => (
                    <span>{record.accessType}</span>)
            },
            {
                title: 'Special Instructions',
                width:'15%',
                render: (record) => (
                    <div>{record.specialInstruction}</div>
                )
            },
            {
                title: 'App ID',
                width:'12%',
                render: (record, data, rowIndex) => (
                    <Input size={'small'} name='appId' value={record && record.appId} onChange={(e)=>this.onTextChange(e,rowIndex, selectedRoeIndex)}/>)
            },
            {
                title: 'App Role',
                width:'12%',
                render: (record, data, rowIndex) => (
                    <Input size={'small'} name='appRole' value={record && record.appRole} onChange={(e)=>this.onTextChange(e,rowIndex, selectedRoeIndex)}/>)
            },
            {
                title: 'Closing Comment',
                width:'12%',
                render: (record, data, rowIndex) => (
                    <Input size={'small'} name='closingComment' value={record && record.closingComment} onChange={(e)=>this.onTextChange(e,rowIndex, selectedRoeIndex)}/>)
            },
            {
                title: '',
                width:'20%',
                render: (record, data, rowIndex) => (
                    <div>
                        <Button type='primary' size='small' className="mr-5 approve-btn" onClick={()=> this.onApprove(rowIndex, selectedRoeIndex)}>Approve</Button>
                        <Button size='small' onClick={()=> this.onDeny(rowIndex, selectedRoeIndex)}>Deny</Button>
                    </div>
                )

            },
        ];
        return (
            <Row>
                <Col md="12" sm="12">
                    <Table
                        columns={columns}
                        size="small"
                        dataSource={mainRecord.userList}
                    />
                </Col>
            </Row>

        );
    }

    mainTable = () => {
        const {reviewAndApproveList, isLoading} = this.state;
        const mainColumns = [
            {
                title: '',
                width: '33%',
                render: (record) => {
                    return (
                        <div>
                            <div><h4> {record.daFirstName} {record.daLastName}</h4></div>
                            <div><b>Email</b>: {record.daEmail}</div>
                            <div><b>Cell</b>: {record.daPhone}</div>
                        </div>
                    );
                }
            },
            {
                title: '',
                width: '33%',
                render: (record) => {
                    return (
                        <div>
                            <div><b>Request ID</b>: {record.requestId}</div>
                            <div><b>Number of Users</b>: 10</div>
                            <div><b>Org ID</b>: {record.orgId}</div>
                        </div>
                    );
                }
            },
            {
                width: '33%',
                render: (record) => {
                    return <div className="text-center"><Progress type="circle" percent={70} width={55}
                                                                  format={() => <small className="fs-14">7
                                                                      days</small>}/>
                    </div>;
                }
            }
        ];
        return <Table
            columns={mainColumns}
            size="small"
            className="main-table"
            showHeader={false}
            dataSource={reviewAndApproveList}
            selectedRowKeys={[0]}
            loading={isLoading}
            expandedRowRender={(record, rowIndex, ) => this.nestedTable(record, rowIndex)}
        />;
    }

    renderFilters = () => {
        const {requestId, organizationId} = this.state;
        return (
            <Panel xs={12} md={12} sm={12} title={' Filters '}>
                <Row className="align-items-center">
                    <Col xs={12} md={3} sm={12}>
                        <span><b>Organization Id</b></span>
                        <Input name="organizationId" value={organizationId} onChange={this.onChange}/>
                    </Col>
                    <Col xs={12} md={3} sm={12}>
                        <span><b>Request Id</b></span>
                        <Input name="requestId" value={requestId} onChange={this.onChange}/>
                    </Col>
                    <Col xs={12} md={3} sm={12}>
                        <span><b>Date Submitted</b></span>
                        <RangePicker name='dateSubmitted' onChange={this.onDateChange}/>
                    </Col>
                    <Col xs={12} md={3} sm={12}>
                        <Checkbox checked={this.state.isPremiumCustomer} onChange={this.checkBoxChange}>Is Premium
                            Customer ?</Checkbox>
                    </Col>
                </Row>
                <Row className="text-right">
                    <Col xs={12} md={12} sm={12}>
                        <Button type="primary" icon="search"  onClick={this.onSearch}>Search</Button>
                        <Button className="mb-0 ml-5" onClick={this.onReset}>Reset</Button>
                    </Col>
                </Row>
            </Panel>

        );
    }

    render() {
        const {isEditTextArea, reviewAndApproveList, isSaving} = this.state;
        return (
            <Container className="dashboard">
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={4} sm={12} xs={12}>
                                <h4>Application Information</h4>
                                <Row className="align-items-center">
                                    <Col md={12} xs={12} sm={12}>
                                        <Row>
                                            <Col md={12} xs={12} sm={12}>
                                                <p><b>App Name:</b> App Name</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} xs={12} sm={12}>
                                                <p><b>App Type:</b> App Type</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4} sm={12} xs={12}>
                                <h4>Application Request Instructions</h4>
                                <Row className="align-items-center">
                                    <Col md={12} xs={12} sm={12}>
                                        <Row>
                                            <Col md={12} xs={12} sm={12} className="d-flex">
                                                <TextArea disabled={!isEditTextArea}/>
                                                {isEditTextArea ?
                                                    <div><Icon type="save" className="ml-5" style={{fontSize: 16}}
                                                               onClick={this.editTextArea}/> <Icon type="close-circle"
                                                                                                   className="ml-5"
                                                                                                   style={{fontSize: 16}}
                                                                                                   onClick={this.editTextArea}/>
                                                    </div> : <Icon type="edit" className="ml-5" style={{fontSize: 16}}
                                                                   onClick={this.editTextArea}/>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4} sm={12} xs={12} className="p-50">
                                <h4 className="text-center">Total Licenses</h4>
                                <div className="dashboard__stat">
                                    <Progress type="circle" width={100} percent={80}
                                              format={() => <small className="fs-14">80 Avaialable</small>}/>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="mt-20 p-0">

                        {this.renderFilters()}
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="mt-20">
                        <Row>
                            <Col md="12" sm="12">
                                {this.mainTable()}
                            </Col>
                        </Row>
                        <Row className='text-right'>
                            <Col md="12" sm="12">
                                <Button type="primary" disabled={!reviewAndApproveList.length} size={"sm"} onClick={this.onSubmitReviewAndApprove} >{isSaving ? <Spin/> : 'Submit'}</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }


}

export default ReviewAndApprove
