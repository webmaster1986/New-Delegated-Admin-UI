import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import queryString from 'query-string'
import './createUser.scss';
import {Input, Button, message, Table, Switch, Spin, Tabs, Select, Popconfirm} from "antd";
// import {ApiService} from "../../services";
import {ApiService} from "../../services/ApiService1";
import ModifyUser from "./ModifyUser";
import SetupProxy from "./SetupProxy";
import {getUserName} from "../../services/ApiService";
const {Search} = Input;
const {TabPane} = Tabs;

class MyProfile extends Component {
    _apiService = new ApiService();
    constructor(props){
        super(props)
        const params = this.props.history.location.search || ""
        const query = queryString.parse(params) || {}
        this.state = {
            isEdit: false,
            identityUsersList: [],
            isLoading: false,
            isAddUser: false,
            isSaving: false,
            isModifyUser: false, // !!query.id,
            selectedRecord: {},
            newUser: {
                active: true
            },
            profile: {},
            totalResource: 0,
            defaultCurrent: 1,
            id: query.id || "",
            activeKey: query.tab || '2',
            searchUser: ''
        }
    }

    componentDidMount() {
        this.GetAllIdentityUsers(1)
    }

    getFilteredUsers = (isSelf) => {
        const {identityUsersList, searchUser} = this.state;
        if (isSelf && identityUsersList.length) {
            const data = identityUsersList.filter(x => x.userName === getUserName());
            if (data.length) {
                return data;
            } else {
                return identityUsersList.slice(0, 1);
            }
        } else {
            // return identityUsersList.filter(x => x.Email && x.Manager).filter(x =>  x.UserName !== getUserName() && x.Manager === getUserName())
        }
        if (!searchUser) {
            return identityUsersList;
        }
        let filteredUserData = identityUsersList || [];
        filteredUserData = filteredUserData.filter(x => {
            const displayName =  x.displayName || "";
            const emails =  x.emails || "";
            const userName =  x.userName || "";
            return (displayName.toLowerCase().includes(searchUser.toLowerCase())) || (emails.toLowerCase().includes(searchUser.toLowerCase())) || (userName.toLowerCase().includes(searchUser.toLowerCase()));
        });
        return filteredUserData;
    }

    GetAllIdentityUsers = async (page) => {
        this.setState({
            isLoading: true
        });
        const data = await this._apiService.getAllUsers()
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            const { id } = this.state
            const userId = id || getUserName()
            let selectedRecord = {}
            if(data && data.length && userId){
                selectedRecord = (data || []).find(item => item.userName === userId)
            }
            data.forEach((x, i) => {
                x.key = i
            })
            this.setState({
                identityUsersList: data || [],
                selectedRecord,
                isLoading: false,
            })
        }

    }

    modifyUser = (selectedRecord,isModifyUser) => {
        this.setState({
            isModifyUser,
            selectedRecord,
            newUser: selectedRecord
        })
    }

    onCloseModifyUser = (selectedRecord, isModifyUser) =>{
        this.setState({
            selectedRecord,
            isModifyUser
        })
    }

    getColumns = (isSelf) => {
        const columns = [
            {
                title: 'User Name',
                width: '18%',
                render: (record) => (<span className="cursor-pointer" style={{color: '#005293'}} onClick={() =>this.modifyUser(record, true)}>{record.userName}</span>)
            },
            {
                title: 'Display Name',
                width: '18%',
                render: (record) => (<span>{record.displayName}</span>)
            },
            {
                title: 'E-mail',
                width: '18%',
                dataIndex: 'emails',
            },
            {
                title: 'User Type',
                width: '18%',
                key: 'userType',
                render: (keyData, record, index) => (<span>{index%2 === 1 ? 'Employee' : 'Contractor'}</span>)
            },
        ];
        if (!isSelf) {
          columns.push({
            title: 'Locked',
            width: 150,
              render: (record) => (
                <>
                    {/*<Switch size="small" className="green w-80 red" checkedChildren={'Unlocked'} unCheckedChildren={"Locked"} defaultChecked />*/}
                    <Popconfirm
                        title={(!record.active || false) ? 'Are you sure to make users Unlocked?' : 'Are you sure to make users Locked?'}
                        okText={'Yes'}
                        cancelText={'No'}
                        onConfirm={() => this.onStatusChange(record.key, 'active')}
                    >
                        <Switch
                            size="small"
                            className="green w-80 red"
                            checkedChildren={"Unlocked"}
                            unCheckedChildren={"Locked"}
                            checked={record.active}
                        />
                    </Popconfirm>
                </>
              )
          });
        }
        return columns;
    }

    onChangeSearchUser = (event) => {
        this.setState({
            searchUser: event.target.value
        })
    }

    handlePagination = (page ) => {
        this.setState({
            defaultCurrent: page
        })
        this.GetAllIdentityUsers(page)
    }

    onTabChange = (activeKey) => {
        this.setState({
            activeKey
        })
    }

    onAddUser = () => {
        this.setState({
            isAddUser: false,
            isModifyUser: false,
            newUser: {}
        })
    }

    onSaveNewUser = async () => {
        const { newUser } = this.state
        newUser.locked = false
        newUser.department = "Accounting"
        this.setState({
            isSaving: true
        })
        const data = await this._apiService.createUser(newUser)
        if (!data || data.error) {
            message.error('something is wrong! please try again');
            this.setState({
                isSaving: false
            })
        } else {
            this.GetAllIdentityUsers()
            message.success("User created Successfully");
            this.setState({
                isSaving: false,
                isAddUser: false,
                isModifyUser: false,
                newUser: {
                    active: true
                },
                searchUser: ''
            })
        }
    }

    onChange = (event) => {
        this.setState({
            newUser: {
                ...this.state.newUser,
                [event.target.name]: event.target.value
            }
        })
    }

    onIdentityStatusSet = (value) => {
        this.setState({
            newUser: {
                ...this.state.newUser,
                active: value
            }
        })
    }

    onStatusChange = (index, key) => {
        let { identityUsersList } = this.state
        identityUsersList[index][key] = !(identityUsersList[index][key])
        this.setState({identityUsersList})
    }

    render() {
        const { isLoading, isModifyUser, selectedRecord, profile, activeKey, searchUser, isAddUser, newUser, isSaving } = this.state;
        const { firstname, manager, middleName, organization, lastName, emails, displayName, userType, userName, active, id = "" } = newUser || {}
        return(
          <div className="dashboard create-user">
              <Tabs defaultActiveKey={activeKey} onChange={this.onTabChange}>
                  <TabPane tab="Profile" key="1">
                      {
                          isLoading ? <Spin className='mt-50 custom-loading'/> :
                            <ModifyUser
                              isProfile
                              selectedRecord={selectedRecord || {}}
                              onCloseModifyUser={this.onCloseModifyUser}/>
                      }
                  </TabPane>
                  <TabPane tab="Manage Users" key="2">
                      {
                          !(isModifyUser && selectedRecord && selectedRecord.userId) ?
                            <Card className="mt-20">
                                <CardHeader>
                                    <Row className="align-items-center">
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5">
                                                <a><img src={require("../../images/user.png")} style={{width: 40}}/></a>
                                            </span>
                                            <h4 className="mt-10">{ isAddUser ? "Add User" : isModifyUser ? "Modify User" : "Manage Users"}</h4>
                                        </Col>
                                        <Col md={6} sm={12} xs={12}>
                                            { (!isAddUser && !isModifyUser) ?
                                                <div className="text-right">
                                                    <Button
                                                        className="square mr-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={() => this.setState({isAddUser: true})}
                                                    >
                                                        <a>
                                                            <img
                                                                src={require("../../images/plus-symbol.png")}
                                                                style={{width: 20}}
                                                            />
                                                        </a>
                                                        &nbsp;Add User
                                                    </Button>
                                                    <Button
                                                        className="square mr-10"
                                                        size={"large"}
                                                        color="primary"
                                                    >
                                                        <a>
                                                            <img
                                                                src={require("../../images/plus-symbol.png")}
                                                                style={{width: 20}}
                                                            />
                                                        </a>
                                                        &nbsp; CSV Upload
                                                    </Button>
                                                    <Search
                                                        size="large"
                                                        placeholder="Search Name"
                                                        style={{width: 220}}
                                                        value={searchUser}
                                                        name={'searchUser'}
                                                        onChange={this.onChangeSearchUser}
                                                    />
                                                </div> :
                                                <div className="text-right">
                                                    {
                                                        isModifyUser ?
                                                            <>
                                                                <Button className="square ml-10" size={"large"} color="primary">Disable</Button>
                                                                <Button className="square ml-10" size={"large"} color="primary">Lock</Button>
                                                                <Button className="square ml-10" size={"large"} color="primary">Delete</Button>
                                                                <Button className="square ml-10" size={"large"} color="primary">Update</Button>
                                                            </> : null
                                                    }
                                                    <Button
                                                        className="square ml-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={this.onSaveNewUser}
                                                    >
                                                        {
                                                            isSaving ?
                                                                <Spin className='color-white mr-10'/> : null
                                                        }
                                                        Submit
                                                    </Button>
                                                    <Button
                                                        className="square ml-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={this.onAddUser}
                                                    >
                                                        &nbsp;<a><img src={require("../../images/multiply.png")} style={{width: 20}} /></a>
                                                    </Button>
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {isLoading ? <Spin className='mt-50 custom-loading'/> :
                                        <>
                                            { (isAddUser || isModifyUser) ?
                                                <Row className="align-items-center">
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>First Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            name="firstname"
                                                            onChange={this.onChange}
                                                            value={firstname}
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Middle Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            className="mt-10"
                                                            onChange={this.onChange}
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
                                                            onChange={this.onChange}
                                                            className="mt-10"
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>User Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            className="mt-10"
                                                            onChange={this.onChange}
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
                                                            onChange={this.onChange}
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
                                                            onChange={this.onChange}
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
                                                            onChange={this.onChange}
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
                                                            onChange={(value) => this.onChange({
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
                                                        <Button type={active ? "primary" : ''} size="small" className="mt-10 mr-10" onClick={() => this.onIdentityStatusSet(true)}>Active</Button>
                                                        <Button type={!active ? "primary" : ''} size="small" className="mt-10" onClick={() => this.onIdentityStatusSet(false)}>Inactive</Button>
                                                    </Col>
                                                </Row> :
                                                <Row>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <Table
                                                            columns={this.getColumns()}
                                                            size="small"
                                                            dataSource={this.getFilteredUsers()}
                                                        />
                                                    </Col>
                                                </Row>
                                            }
                                        </>
                                    }
                                </CardBody>
                            </Card>
                            :
                            <ModifyUser
                              selectedRecord={selectedRecord}
                              onCloseModifyUser={this.onCloseModifyUser}/>

                      }
                  </TabPane>
                  <TabPane tab="Setup Proxy" key="3">
                      <SetupProxy />
                  </TabPane>
              </Tabs>
            </div>
        )
    }
}
export default MyProfile
