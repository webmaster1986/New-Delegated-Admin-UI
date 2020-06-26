import React, {Component} from 'react';
import { Card, CardBody, Row, Col, CardHeader } from "reactstrap";
import clonedeep from "lodash.clonedeep"
import {Button, Table, Spin, message, Icon, Steps, Select, Input, Checkbox, Modal, Popover, List, TreeSelect} from "antd"
import {ApiService} from "../../services/ApiService1";

const {Step} = Steps;
const {Option} = Select;

const treeData = [
    {
        title: 'Update User',
        value: 'Update User',
        key: '0'
    },
    {
        title: 'Disable/Enable User',
        value: 'Disable/Enable User',
        key: '1'
    },
    {
        title: 'Delete User',
        value: 'Delete User',
        key: '2'
    },
    {
        title: 'Password Reset',
        value: 'Password Reset',
        key: '3'
    },
    {
        title: 'Add Users to Groups',
        value: 'Add Users to Groups',
        key: '4'
    },
    {
        title: 'Remove Users to Groups',
        value: 'Remove Users to Groups',
        key: '5'
    },
];

const treeData1 = [
    {
        title: 'ALL',
        value: 'ALL',
        key: '0'
    }
];

class ManageAdmin extends Component {
    _apiService = new ApiService()
    constructor(props){
        super(props)
        this.state={
            usersList: [],
            selectedUsers: [],
            adminRoleList: [
                {
                    roleName: 'Super Admin',
                    roles: [{role:'Scope of Users', value: ['ALL']},{role:'User Operation', value: ['ALL']},{role:'Scope of Groups', value: ['ALL']}]
                },
                {
                    roleName: 'Help Desk Admin',
                    roles: [{role:'Scope of Users', value: ['ALL']},{role:'User Operation', value: ['Disable/Enable Users', 'Password Reset']},{role:'Scope of Groups', value: ['ALL']}]
                },
            ],
            newAdmin: {
                scopeOfUsers: [],
                userOperation: [],
                scopeOfGroups: [],
                roleName: '',
            },
            isLoading: false,
            isAddNewAssignAdmin: false,
            isSearched: false,
            isAdminNewRole: false,
            isSaving: false,
            adminList: [],
            selectedType: '',
            isCheckedList: [],
            loginUser: {},
            current: 0
        }
    }

    componentDidMount() {
        this.getLoginUserId()
        this.getAllAdminUsers()
    }

    getAllAdminUsers = async () => {

        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });

        const data = await this._apiService.getAllUsers("type=admin")

        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            (data || []).forEach((x, i) => {
                x.key = i
            })
            this.setState({
                adminList: data || [],
                isLoading: false,
            })
        }
    }

    getLoginUserId = async () => {
        const data = await this._apiService.getTenantGroupIds()
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                loginUser: data || [],
                isLoading: false,
            })
        }
    }

    getColumns = () => {
        return [
            {
                title: 'User ID',
                dataIndex: 'userName'
            },
            {
                title: 'Display Name',
                dataIndex: 'displayName'
            },
            {
                title: 'Email',
                dataIndex: 'emails'
            },
            {
                title: 'Department',
                dataIndex: 'department'
            },
            {
                title: 'Admin Type',
                render: () => <span>Super Admin</span>
            }
        ];
    }

    onChange = (event) => {
        let { newAdmin } = this.state
        const { name, value } = event.target
        if(name === 'roleName'){
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
        let { newAdmin, adminRoleList } = this.state
        let object = { roleName: newAdmin.roleName, roles: [] }
        const array = ['scopeOfUsers', 'userOperation', 'scopeOfGroups']
        array.forEach(x => {
            if(newAdmin && newAdmin[x] && newAdmin[x].length){
                const role = x === 'scopeOfUsers' ? 'Scope of Users' : x === 'userOperation' ? 'User Operation' : x === 'scopeOfGroups' ? 'Scope of Groups' : ''
                object.roles.push({role, value: newAdmin[x]})
            }
        })
        adminRoleList.push(object)
        this.setState({
            adminRoleList,
            isAdminNewRole: !this.state.isAdminNewRole,
            newAdmin: {
                scopeOfUsers: [],
                userOperation: [],
                scopeOfGroups: [],
                roleName: '',
            },
        })
    }

    onAddAssignNewAdmin = (isAddNewAssignAdmin) => {
        if(isAddNewAssignAdmin) {
            this.getUsers()
        }
        this.setState({
            isAddNewAssignAdmin,
            current: 0
        })
    }

    getUsers = async () => {

        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });

        const data = await this._apiService.getAllUsers()

        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            (data || []).forEach((x, i) => {
                x.key = i
            })
            this.setState({
                usersList: data || [],
                isLoading: false
            })
        }
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
        const { selectedUsers, usersList, isSearched, search, selectedType } = this.state
        let arrayList = clonedeep(usersList)
        if(isSelected) {
            return (arrayList || []).filter(x => ((selectedUsers || []).some(y => x.id === y)))
        }
        if(!isSearched) {
            arrayList = []
        } else if(search && selectedType) {
            arrayList = (arrayList || []).filter(obj => [selectedType].some(key => obj[key] && obj[key].toLowerCase().includes(search.toLowerCase())))
            arrayList = (arrayList || []).filter(x => !((selectedUsers || []).some(y => x.id === y)))
        } else {
            arrayList = []
        }
        return arrayList
    }

    getSearchTable = (isActive) => {
        const { selectedUsers } = this.state;
        const columns = [
            {
                title: 'User Name',
                dataIndex: 'userName',
            },
            {
                title: 'First Name',
                dataIndex: 'firstname',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
            },
            {
                title: 'Email',
                dataIndex: 'emails',
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
        const { isSearched, selectedUsers, selectedType, search } = this.state
        return(
            <>
                <Row>
                    <Col md="2" sm="12"><span>Search Criteria</span></Col>
                    <Col md="3" sm="12">
                        <Select className="w-100-p d-inline-block" value={selectedType} onChange={(value) => this.onChange({target: {name: 'selectedType', value}})}>
                            <Option value="firstname">First Name</Option>
                            <Option value="lastName">Last Name</Option>
                            <Option value="emails">Email</Option>
                            <Option value="userName">User Name</Option>
                        </Select>
                    </Col>
                    <Col md="3" sm="12">
                        <Input name="search" value={search} onChange={this.onChange}/>
                    </Col>
                    <Col md="4" sm="12">
                        <Button type="primary" className="square" disabled={!search || !selectedType} onClick={() => this.setState({isSearched: true})}>Search</Button>
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
        const { adminRoleList, isCheckedList } = this.state
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
                                Add New Admin Role
                            </Button>
                        </div>}
                        bordered
                        dataSource={adminRoleList}
                        renderItem={item => (
                            <List.Item>
                                <Checkbox checked={(isCheckedList || []).includes(item.roleName)} onChange={() => this.onRoleSelect(item.roleName)}>
                                    <Popover className="cursor-pointer" content={content(item.roles)} arrowPointAtCenter>
                                        {item.roleName}
                                    </Popover>
                                </Checkbox>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        )
    }

    onRoleSelect = (roleName) => {
        let { isCheckedList } = this.state
        if(isCheckedList.includes(roleName)) {
            isCheckedList = isCheckedList.filter(x => x !== roleName)
        } else {
            isCheckedList.push(roleName)
        }
        this.setState({
            isCheckedList
        })
    }

    onCheckboxChange = (name, value) => {
        this.setState({
            newAdmin: {
                ...this.state.newAdmin,
                [name]: value
            }
        })
    }

    onSubmit = async () => {
        const { selectedUsers, loginUser } = this.state
        const payload = { groups: [] }
        let object = {
            groupId: loginUser.adminID || '',
            users: []
        }
        selectedUsers.forEach(id => {
            object.users.push({userId: id})
        })
        payload.groups.push(object)
        this.setState({
            isSaving: true
        })
        const data = await this._apiService.addUserToGroup(payload)
        if (!data || data.error) {
            this.setState({
                isLoading: false,
                isSaving: false
            });
            return message.error('something is wrong! please try again');
        } else {
            message.success("Role assign Successfully");
            this.setState({
                isSaving: false,
                isAddNewAssignAdmin: false,
                isSearched: false,
                selectedType: '',
                search: '',
                isCheckedList: [],
                current: 0,
                selectedUsers: [],
                usersList: []
            }, () => this.getAllAdminUsers())
        }
    }

    render() {
        const { isLoading, adminList, current, isAddNewAssignAdmin, selectedUsers, isAdminNewRole, newAdmin, isCheckedList, isSaving } = this.state
        const { userOperation, scopeOfGroups, scopeOfUsers, roleName } = newAdmin || {}

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
                            <CardBody style={{height: 800}}>
                                {
                                    isLoading ? <Spin className='custom-loading mt-50'/> :
                                        <>
                                            {!isAddNewAssignAdmin ?
                                                <Row>
                                                    <Col md={12} sm={12} xs={12} className='mt-10'>
                                                        <Table
                                                            columns={this.getColumns()}
                                                            size='small'
                                                            dataSource={adminList}
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
                                                    {
                                                        current === 0 ?
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
                                                            </div> : null
                                                    }
                                                    {
                                                        current === 1 ?
                                                            <div className="text-right">
                                                                <Button
                                                                    className="square mt-10"
                                                                    size={"large"}
                                                                    color="primary"
                                                                    disabled={!(isCheckedList || []).length || isSaving}
                                                                    onClick={this.onSubmit}
                                                                >
                                                                    { isSaving ? <Spin style={{color: '#fff'}}/> : null} Submit
                                                                </Button>
                                                            </div> : null
                                                    }
                                                </>
                                            }
                                        </>

                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Add New Admin Role"
                    visible={isAdminNewRole}
                    onCancel={this.onNewAdminRoleChange}
                    onOk={this.onSave}
                    okButtonProps={{disabled: !roleName}}
                >
                    <div className="mb-10">
                        <p>
                            Admin Role Name
                        </p>
                        <Input name="roleName" value={roleName} onChange={this.onChange}/>
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