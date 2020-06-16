import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import queryString from 'query-string'
import './createUser.scss';
import {Input, Button, message, Table, Switch, Spin, Tabs} from "antd";
import {ApiService} from "../../services";
import ModifyUser from "./ModifyUser";
import SetupProxy from "./SetupProxy";
import {getUserName} from "../../services/ApiService";
const {Search} = Input;
const {TabPane} = Tabs;

class MyProfile extends Component {
    constructor(props){
        super(props)
        const params = this.props.history.location.search || ""
        const query = queryString.parse(params) || {}
        this.state = {
            isEdit: false,
            identityUsersList: [],
            isLoading: false,
            isAddUser: false,
            isModifyUser: false, // !!query.id,
            selectedRecord: {},
            newUser: {},
            profile: {},
            totalResource: 0,
            defaultCurrent: 1,
            id: query.id || "",
            activeKey: query.tab || '1',
            searchUser: ''
        }
    }

    componentDidMount() {
        this.GetAllIdentityUsers(1)
    }

    getFilteredUsers = (isSelf) => {
        const {identityUsersList, searchUser} = this.state;
        if (isSelf && identityUsersList.length) {
            const data = identityUsersList.filter(x => x.UserName === getUserName());
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
            const name =  `${(x.FirstName || '')} ${(x.LastName || '')}`;
            return (name.toLowerCase().includes(searchUser.toLowerCase())) || (x.UserName.toLowerCase().includes(searchUser.toLowerCase())) || (x.Email.toLowerCase().includes(searchUser.toLowerCase()));
        });
        return filteredUserData;
    }

    GetAllIdentityUsers = async (page) => {
        this.setState({
            isLoading: true
        });
        const data = await ApiService.GetAllIdentityUsers(page);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            const { id } = this.state
            let selectedRecord = {}
            if(data && data.resources && id){
                selectedRecord = data.resources.find(item => item.userId === id)
            }
            this.setState({
                identityUsersList: data.resources,
                totalResource: data.totalResource,
                selectedRecord
            }, async () => {
                const filteredUserData = await this.getFilteredUsers(true)
                this.setState({
                    isLoading: false,
                    profile: filteredUserData.length ? filteredUserData[0] : {},
                })
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
                render: (record) => (<span className="cursor-pointer" style={{color: '#005293'}} onClick={() =>this.modifyUser(record, true)}>{record.UserName}</span>)
            },
            {
                title: 'Display Name',
                width: '18%',
                render: (record) => (<span>{record.FirstName}{' '}{record.LastName}</span>)
            },
            {
                title: 'E-mail',
                width: '18%',
                dataIndex: 'Email',
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
                <Switch size="small" className="green w-80 red" checkedChildren={'Unlocked'} unCheckedChildren={"Locked"} defaultChecked />
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
            isModifyUser: false
        })
    }

    onChange = (event) => {
        this.setState({
            newUser: {
                ...this.state.newUser,
                [event.target.name]: event.target.value
            }
        })
    }

    render() {
        const {isLoading, isModifyUser, selectedRecord, profile, activeKey, searchUser, isAddUser, newUser} = this.state;
        const { FirstName, Manager, MiddleName, Title, LastName, Email, displayName, UserType  } = newUser || {}
        return(
          <div className="dashboard create-user">
              <Tabs defaultActiveKey={activeKey} onChange={this.onTabChange}>
                  <TabPane tab="Profile" key="1">
                      {
                          isLoading ? <Spin className='mt-50 custom-loading'/> :
                            <ModifyUser
                              isProfile
                              selectedRecord={profile}
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
                                                    <Button className="square ml-10" size={"large"} color="primary" onClick={this.onAddUser}>Save</Button>
                                                    <Button className="square ml-10" size={"large"} color="primary" onClick={this.onAddUser}>&nbsp;<a><img src={require("../../images/multiply.png")} style={{width: 20}} /></a></Button>
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
                                                            name="FirstName"
                                                            onChange={this.onChange}
                                                            value={FirstName}
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Manager</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            name="Manager"
                                                            onChange={this.onChange}
                                                            value={Manager}
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Middle Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            className="mt-10"
                                                            onChange={this.onChange}
                                                            name="MiddleName"
                                                            value={MiddleName}
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Organization</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            value={Title}
                                                            onChange={this.onChange}
                                                            name="Title"
                                                            className="mt-10"
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Last Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            name="LastName"
                                                            value={LastName}
                                                            onChange={this.onChange}
                                                            className="mt-10"
                                                        />
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>E-mail</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input
                                                            name="Email" value={Email} onChange={this.onChange}
                                                               className="mt-10"/>
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Display Name</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input className="mt-10" value={displayName} name="displayName"
                                                               onChange={this.onChange}/>
                                                    </Col>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>User Type</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Input name="UserType" value={UserType} onChange={this.onChange}
                                                               className="mt-10"/>
                                                    </Col>
                                                    <Col md={6}/>
                                                    <Col md={2} sm={12} xs={12}>
                                                        <span><b>Identity Status</b></span>
                                                    </Col>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <Button type="primary" size="small" className="mt-10 mr-10">Active</Button>
                                                        <Button size="small" className="mt-10">Inactive</Button>
                                                    </Col>
                                                </Row> :
                                                <Row>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <Table
                                                            columns={this.getColumns()}
                                                            size="small"
                                                            dataSource={this.getFilteredUsers()}
                                                            pagination={false}
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
