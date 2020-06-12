import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import './createUser.scss';
import {DatePicker, Input, Button, Tabs, Table, Select,} from "antd";
const {Option} = Select;
import moment from 'moment';

const { TabPane } = Tabs;
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

    };

    componentDidMount() {
        const {selectedRecord} = this.props;
        let entitlements  = [];
        (selectedRecord.Application || []).forEach((x) =>{
            (x.Entitlement || []).forEach((y) =>{
                entitlements.push({Category: 'Application', ApplicationName: x['Application Name'], Name: y.Name, Value: y.Value })
            })
        });
        (selectedRecord.Role || []).forEach((z) => {
            entitlements.push({Category: 'Role', ApplicationName: '', Name: z.RoleName, Value: '' })
        })
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
    
    onDateChange = (name, dateString) => {
        this.setState({
          [name]: dateString
        })
    }

    onTabChange = (activeKey) => {
        this.setState({
            activeKey
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
                        <Input name="FirstName" onChange={this.onChange} value={FirstName} disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Manager</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input name="Manager" onChange={this.onChange} value={Manager} disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Middle Name</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input className="mt-10" onChange={this.onChange} name="MiddleName" value={MiddleName} disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Organization</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input value={Title} onChange={this.onChange} name="Title" className="mt-10" disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Last Name</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input name="LastName" value={LastName} onChange={this.onChange} className="mt-10" disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>E-mail</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input name="Email" value={Email} onChange={this.onChange} className="mt-10" disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Display Name</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input className="mt-10" value={displayName} name="displayName" onChange={this.onChange} disabled/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span><b>User Type</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Input name="UserType" value={UserType} onChange={this.onChange} className="mt-10" disabled/>
                    </Col>
                    <Col md={6} />
                    <Col md={2} sm={12} xs={12}>
                        <span><b>Identity Status</b></span>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Button type="primary" size="small" className="mt-10">Active</Button>
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
                                <DatePicker value={LicenseExpiry ? moment(LicenseExpiry): null} onChange={(date, dateStr) => this.onDateChange('LicenseExpiry', dateStr)} format="MM/DD/YYYY" style={{width: '100%'}}/>
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
                                <DatePicker value={TrainingCompletion ? moment(TrainingCompletion): null} onChange={(date, dateStr) => this.onDateChange('TrainingCompletion', dateStr)} format="MM/DD/YYYY"   style={{width: '100%'}}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} sm={12} xs={12}>
                        <Row className="align-items-center">
                            <Col md={4} sm={12} xs={12}>
                                <span><b>Expiry Date</b></span>
                            </Col>
                            <Col md={8} sm={12} xs={12}>
                                <DatePicker value={TrainingExpiry ? moment(TrainingExpiry): null} onChange={(date, dateStr) => this.onDateChange('TrainingExpiry', dateStr)} format="MM/DD/YYYY"  style={{width: '100%'}}/>
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
                               <DatePicker style={{width: '100%'}} disabled/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Row className="align-items-center">
                            <Col md={3} sm={12} xs={12}>
                                <span><b>End Date</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12}>
                                <DatePicker style={{width: '100%'}} disabled/>
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
                                <DatePicker style={{width: '100%'}} disabled/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Row className="align-items-center">
                            <Col md={3} sm={12} xs={12}>
                                <span><b>End Date</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12}>
                                <DatePicker style={{width: '100%'}} disabled/>
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
                                <Input disabled/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Row className="align-items-center">
                            <Col md={3} sm={12} xs={12}>
                                <span><b>Postal Code</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12}>
                                <Input disabled/>
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
                title: 'Name',
                dataIndex: 'Application Name',
            },
            {
                title: 'Account ID',
                dataIndex: 'Account ID',
            },
            {
                title: 'Account',
                dataIndex: 'Account Type',
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
                title: 'Category',
                dataIndex: 'Category',
            },
            {
                title: 'Name',
                dataIndex: 'Name',
            },
            {
                title: 'Value',
                render: (record) => (<span>{record.Value || '-'}</span>)
            },
            {
                title: 'Application Name',
                render: (record) => (<span>{record.ApplicationName || '-'}</span>)
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

    onCancelModifyUser = (isModifyUser,) => {
        this.props.onCloseModifyUser({}, isModifyUser)
    }

    render() {
        return(
            <Card>
                <CardHeader>
                    <Row className="align-items-center">
                        <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/create-user.png")} style={{width: 40}}/></a></span>
                            <h4 className="mt-10">Modify User</h4>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <div className="text-right">
                                <Button className="square ml-10" size={"large"} color="primary">Disable</Button>
                                <Button className="square ml-10" size={"large"} color="primary">Lock</Button>
                                <Button className="square ml-10" size={"large"} color="primary">Delete</Button>
                                <Button className="square ml-10" size={"large"} color="primary">Update</Button>
                                <Button className="square ml-10" size={"large"} color="primary" onClick={() => this.onCancelModifyUser(false)}>&nbsp;<a><img src={require("../../images/multiply.png")} style={{width: 20}} /></a></Button>
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
                                </Tabs>
                            </Col>
                        </Row>
                </CardBody>
            </Card>
        )
    }
}
export default ModifyUser
