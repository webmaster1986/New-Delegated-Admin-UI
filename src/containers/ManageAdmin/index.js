import React, {Component} from 'react';
import { Card, CardBody, Container, Row, Col, CardHeader } from "reactstrap";
import clonedeep from "lodash.clonedeep"
import {Button, Table, Spin, message, Icon, Steps, Select, Input, Checkbox, Tooltip, Modal, Popover, List, TreeSelect} from "antd"
import {ApiService} from "../../services";

const {Step} = Steps;
const {Option} = Select;

const treeData = [
    {
        title: 'Update User',
        value: 'updateUser',
        key: '0'
    },
    {
        title: 'Disable/Enable User',
        value: 'disable/EnableUser',
        key: '1'
    },
    {
        title: 'Delete User',
        value: 'deleteUser',
        key: '2'
    },
    {
        title: 'Password Reset',
        value: 'passwordReset',
        key: '3'
    },
    {
        title: 'Add Users to Groups',
        value: 'addUsersToGroups',
        key: '4'
    },
    {
        title: 'Remove Users to Groups',
        value: 'removeUsersToGroups',
        key: '5'
    },
];

const treeData1 = [
    {
        title: 'ALL',
        value: 'all',
        key: '0'
    }
];

class ManageAdmin extends Component {
    constructor(props){
        super(props)
        this.state={
            usersList: [
                {
                    userID: 'AMURRAY',
                    firstName: 'Andy',
                    lastName: 'Murray',
                    email: 'adny@gmail.com',
                    id: 0
                },
                {
                    userID: 'DCRANE',
                    firstName: 'Dany',
                    lastName: 'Crane',
                    email: 'dany@gmail.com',
                    id: 1
                },
                {
                    userID: 'JDOE',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@gmail.com',
                    id: 2
                },
                {
                    userID: 'TUSER',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@gmail.com',
                    id: 3
                }
            ],
            selectedUsersList: [],
            selectedUsers: [],
            adminRoleList: [
                {
                    roleName: 'Super Admin',
                    roles: [{role:'Scope of Users', value: ['ALL']},{role:'User Operation', value: ['ALL']},{role:'Scope of Groups', value: ['ALL']}]
                },
                {
                    roleName: 'Help Desk Admin',
                    roles: [{role:'User Operation', value: ['Disable/Enable Users', 'Password Reset']}]
                }
            ],
            newAdmin: {
                scopeOfUsers: [],
                userOperation: [],
                scopeOfGroups: [],
                adminRoleName: '',
            },
            isLoading: false,
            isAddNewAssignAdmin: false,
            isSearched: false,
            isAdminNewRole: false,
            userList: [],
            current: 0
        }
    }

    componentDidMount() {
        this.getAllUsers()
    }

    getAllUsers = async () => {
        const {userList} = this.state
        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });
        const payload = {
            userName: "",
            managerRequired: ""
        };
        const data = await ApiService.getUsersWorkflow(payload)

        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    key: i,
                    id: i
                };
                userList.push(obj)
            })
            this.setState({
                userList,
                isLoading: false,
            })
        }
    }

    getColumns = () => {
        return [
            {
                title: 'User ID',
                render: (record) => (<span>{record.userName}</span>)
            },
            {
                title: 'Display Name',
                render: (record) => (<span>{record.displayName}</span>)
            },
            {
                title: 'Email',
                render: (record) => (<span>{record.email}</span>)
            },
            {
                title: 'Department Admin Type',
                render: (record) => (<span>{record.department}</span>)
            }
        ];
    }

    onChange = (event) => {
        let { newAdmin } = this.state
        const { name, value } = event.target
        let object = { [name]: value }
        if(name === 'adminRoleName'){
            newAdmin[name] = value
            this.setState({
                ...newAdmin
            })
        } else {
            this.setState({
                [name]: value
            })
        }

    }

    onSave = () => {
        const { newAdmin } = this.state
    }

    onAddAssignNewAdmin = (isAddNewAssignAdmin) => {
        this.setState({
            isAddNewAssignAdmin,
            current: 0
        })
    }

    onSelectUser = (checked, key) => {
        let { selectedUsers } = this.state
        if(checked) {
            selectedUsers.push(key)
        } else {
            selectedUsers = selectedUsers.filter(x => x !== key)
        }
        this.setState({selectedUsers})
    }

    getUserList = (isSelected) => {
        const { selectedUsers, usersList, isSearched } = this.state
        let arrayList = clonedeep(usersList)
        if(isSelected) {
            return (arrayList || []).filter(x => ((selectedUsers || []).some(y => x.id === y)))
        }
        if(!isSearched) {
            arrayList = []
        } else {
            arrayList = (arrayList || []).filter(x => !((selectedUsers || []).some(y => x.id === y)))
        }
        return arrayList
    }

    getSearchTable = (isActive) => {
        const { selectedUsers } = this.state;
        const columns = [
            {
                title: 'User Name',
                dataIndex: 'userID',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
        ];
        if(!isActive){
            columns.unshift(
                {
                    width: 10,
                    render: (record) => {
                        return <Checkbox checked={selectedUsers.includes(record.id)} onChange={(event) => this.onSelectUser(event.target.checked, record.id)} />
                    }
                }
            )
        } else {
            columns.push(
                {
                    width: 10,
                    render: (record) => {
                        return <Button type="danger" onClick={() => this.setState({selectedUsers: selectedUsers.filter(x => x !== record.id)})}>Remove</Button>
                    }
                }
            )
        }
        return (
            <Table
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={this.getUserList(isActive)}
            />
        );
    }

    onNewAdminRoleChange = () => {
        this.setState({
            isAdminNewRole: !this.state.isAdminNewRole
        })
    }

    firstStep = () => {
        const { isSearched, selectedUsers } = this.state
        return(
            <>
                <Row>
                    <Col md="2" sm="12"><span>Search Criteria</span></Col>
                    <Col md="3" sm="12">
                        <Select className="w-100-p d-inline-block">
                            <Option value="firstName">First Name</Option>
                            <Option value="lastName">Last Name</Option>
                            <Option value="email">Email</Option>
                            <Option value="userID">User Name</Option>
                        </Select>
                    </Col>
                    <Col md="3" sm="12">
                        <Input name="search" value={this.state.search} onChange={this.onChange}/>
                    </Col>
                    <Col md="4" sm="12">
                        <Button type="primary" className="square" disabled={!this.state.search} onClick={() => this.setState({isSearched: true})}>Search</Button>
                    </Col>
                </Row>
                {
                    isSearched ?
                        <Row>
                            <div className="w-100-p mt-30">
                                <p>Users List</p>
                                {this.getSearchTable(false)}
                            </div>
                        </Row> : null
                }
                {
                    (selectedUsers || []).length ?
                        <Row>
                            <div className="w-100-p mt-30">
                                <p>Selected Users List</p>
                                {this.getSearchTable(true)}
                            </div>
                        </Row> : null
                }
            </>
        )
    }

    secondStep = () => {
        const { adminRoleList } = this.state
        const content = (data) => {
         return <Table
             size="small"
             bordered={true}
             rowKey="role"
             showHeader={false}
             columns={[
                 {
                     title: 'User Name',
                     dataIndex: 'role',
                 },
                 {
                     title: 'User Name',
                     // dataIndex: 'value',
                     render: (record) => {
                         return(
                             <ul style={{listStyle: 'bullet'}}>
                                 {
                                     (record.value || []).map((value, index) => (
                                         <li key={index.toString()}>{value}</li>
                                     ))
                                 }
                             </ul>
                         )
                     },
                 },
             ]}
             dataSource={data}
             pagination={false}
         />
        }
        return(
            <Row>
                <Col md="12" sm="12">

                    <List
                        header={<b>Admin Roles</b>}
                        footer={<div>
                            <Button
                                className="square mr-10"
                                size={"large"}
                                color="primary"
                                onClick={this.onNewAdminRoleChange}
                            >
                                Add a new Admin Role
                            </Button>
                        </div>}
                        bordered
                        dataSource={adminRoleList}
                        renderItem={item => (
                            <List.Item>
                                <Popover className="cursor-pointer" content={content(item.roles)} arrowPointAtCenter>
                                    {item.roleName}
                                </Popover>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        )
    }

    onCheckboxChange = (name, value) => {
        this.state.newAdmin[name] = value
        this.setState({
            ...this.state.newAdmin
        })
    }

    render() {
        const { isLoading, userList, current, isAddNewAssignAdmin, selectedUsers, isAdminNewRole, newAdmin } = this.state
        const { userOperation, scopeOfGroups, scopeOfUsers, adminRoleName } = newAdmin || {}

        const tProps = {
            treeData,
            treeCheckable: true,
            placeholder: 'Please select',
            style: {
                width: '100%',
            },
        };

        return(
            <div className="dashboard">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={10} sm={12} xs={12}>
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/campaign.png")} style={{width: 40}}/></a></span>
                                            <h4 className="mt-10">Manage Admin</h4>
                                        </Col>
                                    </Col>
                                    <Col md={2} sm={12} xs={12} className="text-right">
                                        {
                                            !isAddNewAssignAdmin ?
                                                <Button
                                                    type="primary"
                                                    className="square"
                                                    size="small"
                                                    onClick={() => this.onAddAssignNewAdmin(true)}
                                                >
                                                    <a><img src={require("../../images/plus-symbol.png")} style={{width: 18}}/></a>
                                                    &nbsp;Assign New Admin
                                                </Button> : null
                                        }
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ? <Spin className='custom-loading mt-50'/> :
                                        <>
                                            {!isAddNewAssignAdmin ?
                                                <Row>
                                                    <Col md={12} sm={12} xs={12} className='mt-10'>
                                                        <Table
                                                            columns={this.getColumns()}
                                                            size='small'
                                                            dataSource={userList}
                                                        />
                                                    </Col>
                                                </Row> :

                                                <>
                                                    <Row>
                                                        <Col md="3" sm="12">
                                                            <span className="fs-18 text-primary cursor-pointer"
                                                                  onClick={() => this.onAddAssignNewAdmin(false)}><Icon type="arrow-left"/></span>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="3" sm="12" className="mt-10">
                                                            <Steps direction="vertical" size="small" current={current}>
                                                                <Step
                                                                    title="Search User" onClick={() => this.setState({current: 0})}/>
                                                                <Step
                                                                    title="Assign Admin Roles" onClick={() => this.setState({current: 1})}/>
                                                            </Steps>
                                                        </Col>
                                                        <Col md="9" sm="12">
                                                            {current === 0 && this.firstStep()}
                                                            {current === 1 && this.secondStep()}
                                                        </Col>
                                                    </Row>
                                                    <div className="text-right">
                                                        <Button
                                                            className="square mr-10"
                                                            size={"large"}
                                                            color="primary"
                                                            disabled={!(selectedUsers || []).length}
                                                            onClick={() => this.setState({current: 1})}
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </>
                                            }
                                        </>

                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Add new Admin Role"
                    visible={isAdminNewRole}
                    onCancel={this.onNewAdminRoleChange}
                    onOk={this.onNewAdminRoleChange}
                    okButtonProps={{disabled: !adminRoleName}}
                >
                    <div className="mb-10">
                        <p>
                            Admin Role Name
                        </p>
                        <Input name="adminRoleName" value={adminRoleName} onChange={this.onChange}/>
                    </div>
                    <div className="mb-10">
                        <p>
                            Scope of Users
                        </p>
                        <TreeSelect
                            {...tProps}
                            treeData={treeData1}
                            onChange={(value) => this.onCheckboxChange("scopeOfUsers", value)}
                            value={scopeOfUsers}
                        />
                    </div>
                    <div className="mb-10">
                        <p>
                            User Operation
                        </p>
                        <TreeSelect
                            {...tProps}
                            onChange={(value) => this.onCheckboxChange("userOperation", value)}
                            value={userOperation}
                        />
                    </div>
                    <div>
                        <p>
                            Scope of Groups
                        </p>
                        <TreeSelect
                            {...tProps}
                            treeData={treeData1}
                            onChange={(value) => this.onCheckboxChange("scopeOfGroups", value)}
                            value={scopeOfGroups}
                        />
                    </div>
                </Modal>

            </div>
        )
    }
}

export default ManageAdmin