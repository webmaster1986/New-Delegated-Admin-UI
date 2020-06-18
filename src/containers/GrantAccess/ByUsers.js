import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import clonedeep from "lodash.clonedeep";
import {
    message,
    Spin,
    Button,
    Input,
    Table,
    Icon,
    Tabs,
    Radio
} from "antd";
const {Search} = Input;
const {TabPane} = Tabs;
import {ApiService, getUserName} from "../../services/ApiService";
import CopyUsersModal from "./CopyUsersModal"
import '../GlobalComponents/Access.scss'
import '../Home/Home.scss'

import TableTransfer from "../GlobalComponents/TableTransfer";

const groupsListArray = [
    { name: 'Group 1', description: 'Group 1 description', id: 0 },
    { name: 'Group 2', description: 'Group 2 description', id: 1 },
    { name: 'Group 3', description: 'Group 3 description', id: 2 },
    { name: 'Group 4', description: 'Group 4 description', id: 3 },
    { name: 'Group 5', description: 'Group 5 description', id: 4 },
    { name: 'Group 6', description: 'Group 6 description', id: 5 },
    { name: 'Group 7', description: 'Group 7 description', id: 6 },
    { name: 'Group 8', description: 'Group 8 description', id: 7 },
    { name: 'Group 9', description: 'Group 9 description', id: 8 },
    { name: 'Group 10', description: 'Group 10 description', id: 9 },
    { name: 'Group 11', description: 'Group 11 description', id: 10 },
]


class ByUsers extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            isLoading: false,
            copyUserModal: false,
            userList: [],
            selectedUsersKeys: [],
            selectedUsers: [],
            selectedItem: [],
            search: '',
            selectedAdvisor: '',
            groupsList: groupsListArray,
        };
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

    handleUserChange = selectedUsersKeys => {
        const { userList } = this.state
        let selectedUsers = []
        if(selectedUsersKeys.length) {
            selectedUsersKeys.forEach(select => {
                selectedUsers.push(userList[select])
            })
        } else {
            selectedUsers = []
        }
        this.setState({
            selectedUsersKeys,
            selectedUsers
        });
    };

    getUsersColumns = (isSelect) => {
        const columns = [
            {
                title: 'User Name',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.userName)}</span>
                },
                width: '20%'
            },
            {
                title: 'Display Name',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.displayName)}</span>
                },
                width: '20%'
            },
            {
                title: 'Department',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.department)}</span>
                },
                width: '20%'
            },
            {
                title: 'Manager',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.managerDisplayName)}</span>
                },
                width: '20%'
            }
        ]
        if(!isSelect){
            columns.unshift({
                title: '',
                dataIndex: 'id',
                width: '5%',
                render: (record, data) => {
                    return (
                        <Radio.Group name="selectedUser"  onChange={this.onChange} value={this.state.selectedUser}>
                            <Radio value={data.displayName} />
                        </Radio.Group>
                    )
                }
            })
        }
        return columns
    }

    filterOption = (inputValue, option) => {
        return  option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    };

    next = () => {
        const current = this.state.current + 1;
        this.setState({
            current,
        });
    }

    getFiltered = (isRecommand) => {
        const { search, groupsList } = this.state
        let arrayList = clonedeep(groupsList) || [];
        if(!search) {
            if(!isRecommand) {
                arrayList = arrayList.slice(0, 5)
            }
            return arrayList
        }

        arrayList = arrayList.filter(x => {
            const name = x && x.name;
            const description = x && x.description;
            return name.toLowerCase().includes(search.toLowerCase()) || description.toLowerCase().includes(search.toLowerCase());
        });
        if(!isRecommand) {
            arrayList = arrayList.slice(0, 5)
        }
        return arrayList || []
    }

    addToCart = (record) => {
        let {selectedItem} = this.state;
        const isExists = selectedItem.findIndex(item => item.id === record.id)
        if(isExists === -1) {
            selectedItem.push(record);
        }else {
            selectedItem.splice(isExists,1)
        }
        this.setState({
            selectedItem
        })
    }

    getColumns = () => {
        return [
            {
                render: (record) => (<span className='cursor-pointer ml-5'>
                    <a><img src={require('../../images/group.png')} style={{width: 40}}/></a></span>),
                width: 100
            },

            {
                render: (record) => {
                    return <div className="ws-nowrap">
                        <h4>{record.name}</h4>
                        <h6>Description Of {record.description}</h6>
                    </div>

                },
                width: "80%"
            },
            {
                render: (record) => {
                    return <div>
                        <Button
                            className={this.state.selectedItem.some((x) => x.id === record.id) ? "add-to-cart-select square" : "  square "}
                            size={"small"} color="primary"
                            style={{minWidth: 240}}
                            onClick={() => this.addToCart(record)}><img
                            src={require('../../images/shopping-cart.png')} style={{width: 20}}
                            className="ml-10 mr-20"/>{this.state.selectedItem.some((x) => x.id === record.id) ? "Remove From Cart" : "Add To Cart"}  &nbsp;&nbsp;</Button>
                    </div>

                },
                width: "5%"
            }
        ]
    }

    expandedRowRender = (mainRecord) => {
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.name)}</span>
                },
                width: "60%",
            },
            {
                title: 'Description',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.description)}</span>
                },
                width: "20%",
            },
            {
                title: "",
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() => this.onDeleteGroup(mainRecord.key, record.id)}>Remove</Button>
                },
                width: "10%",
            },
            {
                title: "",
                width: '10%'
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={(mainRecord && mainRecord.groups) || []}
                    pagination={{pageSize: 20}}
                />
            </Card>
        );
    };

    onReview = () => {
        const { selectedUsers, selectedItem } = this.state
        selectedUsers.forEach(f => {
            f.groups = Object.assign([], selectedItem);
        })
        this.setState({
            current: 3,
            selectedUsers
        })
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onDeleteUser = (key) => {
        let { selectedUsers, selectedUsersKeys } = this.state
        selectedUsers = selectedUsers.filter(x => x.key !== key)
        selectedUsersKeys = selectedUsersKeys.filter(x => x !== key)
        this.setState({
            selectedUsers,
            selectedUsersKeys
        })
    }

    onDeleteGroup = (index, childIndex) => {
        let { selectedUsers } = this.state
        const userIndex = selectedUsers.findIndex(x => x.key === index)
        if(userIndex !== -1) {
            selectedUsers[userIndex].groups = selectedUsers[userIndex].groups.filter(x => x.id !== childIndex)
        }
        this.setState({
            selectedUsers
        })
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onCopyUserModal = () => {
        this.setState({
            copyUserModal: !this.state.copyUserModal
        })
    }

    onTabChange = (key) => {
        if(key === "2"){
            this.onChange({target: {name: 'selectedAdvisor', value: 1}})
        }
    }

    getFilteredUsersList = () => {
        const { userList, searchAdvisorUser } = this.state;
        if(!searchAdvisorUser){
            return userList
        }

        let filteredData = clonedeep(userList);

        if(searchAdvisorUser){
            filteredData = userList.filter(x => {
                return ['displayName'].some(y =>  (x[y] || '').toLowerCase().includes(searchAdvisorUser.toLowerCase()))
            });
        }

        return filteredData;
    }

    render() {
        const { isLoading, userList, selectedUsersKeys, current, selectedItem, selectedUsers, search, copyUserModal, selectedAdvisor, searchAdvisorUser } = this.state;

        const users = [];
        userList.forEach(user => {
            if (selectedUsersKeys.indexOf(user.key) !== -1) {
                users.push({
                    ...user,
                })

            }
        });

        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span className="ws-nowrap">Name: <b>{record.displayName}</b><br/> UserName: <b>{record.userName}</b></span>
                },
                width: "60%",

            },
            {
                render: (record) => {
                    return (
                        <span className="ws-nowrap">Email: <b>{record.email}</b></span>);
                },
                width: "20%",

            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() => this.onDeleteUser(record.key)}>Remove</Button>
                },
                width: "10%",

            },
            {
                title: "",
                width: "10%",
            }

        ];

        return (
            <div className="dashboard request">
                { copyUserModal ? <CopyUsersModal userList={userList} onClose={this.onCopyUserModal}/> : null }
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={6} sm={12} xs={12}>
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5">
                                                <a>
                                                    <img src={require("../../images/request.png")} style={{width: 40}}/>
                                                </a>
                                            </span>
                                            <h4 className="mt-10">Grant Access By Users</h4>
                                        </Col>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        {
                                            current === 1 ?
                                                <div className="text-right">
                                                    <Button
                                                        className="square mr-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={this.onCopyUserModal}
                                                    >
                                                        Copy Users from another Group
                                                    </Button>
                                                </div> : null
                                        }
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ?
                                        <Spin className='custom-loading mt-50'/> :
                                        <Row className="mt-10">
                                            <Col md="12" sm="12">
                                                <Row>
                                                    <Col md="12" sm="12">
                                                        {
                                                            current === 1 ?
                                                                <TableTransfer
                                                                    className="mt-20"
                                                                    dataSource={userList || []}
                                                                    targetKeys={selectedUsersKeys}
                                                                    showSearch
                                                                    listStyle={{
                                                                        width: 525,
                                                                        // height: 300,
                                                                        overflowY: 'auto'
                                                                    }}
                                                                    operations={['Select', 'Unselect']}
                                                                    onChange={this.handleUserChange}
                                                                    filterOption={this.filterOption}
                                                                    leftColumns={this.getUsersColumns(true)}
                                                                    rightColumns={this.getUsersColumns(true)}
                                                                /> : null
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                }
                                <div className="mt-20">
                                    { current === 1 &&
                                        <Button
                                            disabled={!selectedUsersKeys.length}
                                            className="square float-right"
                                            type="primary"
                                            onClick={this.next}
                                        >
                                            Next
                                        </Button>
                                    }
                                </div>
                                {
                                    current === 2 &&
                                    <Row>
                                        <Col md="12" sm="12">
                                            <Row className="align-items-center">
                                                <Col md={12} sm={12} xs={12}>
                                                    <div className='user-header' style={{height: 35, paddingTop: 2}}>
                                                        {
                                                            (users || []).slice(0, 3).map((x, i) => {
                                                                return <span className="mt-10 ml-10 fs-18">{x.displayName}{i === 2 ? "" : ","}</span>
                                                            })
                                                        }
                                                        <span className="mt-20 ml-10 fs-18 ">&nbsp;{users.length > 3 ? `+${users.length - 3} more` : null}</span>
                                                        <Button
                                                            className=" add-to-cart edit square mt-5 pull-right mr-10"
                                                            size={"small"}
                                                            color="primary"
                                                            onClick={() => this.setState({current: 1})}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row className="mt-10">
                                                <Col md={3} sm={12} xs={12}>
                                                    <Search
                                                        placeholder="Search Group"
                                                        value={search}
                                                        name="search"
                                                        onChange={this.onChange}
                                                    />
                                                </Col>
                                                <Col md={3} sm={12} xs={12}>
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <div className='text-right'>
                                                        {/*<Button className="square ml-10"
                                                                size={"large"}
                                                                color="primary"
                                                                onClick={() => this.onSubmit(2)}
                                                                disabled={!selectedItem.length}><span><img
                                                            src={require('../../images/enter-arrow.png')}
                                                            style={{width: 20}}
                                                            className="ml-10 mr-10"/></span>Submit</Button>*/}

                                                        <Button
                                                            className="square ml-10"
                                                            size={"large"}
                                                            color="primary"
                                                            key={'btn'}
                                                            onClick={() => this.onReview()}
                                                            disabled={!selectedItem.length}><a><img
                                                            src={require('../../images/shopping-cart.png')}
                                                            style={{width: 20}}
                                                            className="ml-10 mr-10"/></a>Review
                                                            {selectedItem.length ? <span className="btn-round-label">{selectedItem.length}</span> : null}</Button>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                                                <TabPane tab="Standard" key="1">
                                                    <Table
                                                        dataSource={this.getFiltered(true)}
                                                        className="mt-20 main-table"
                                                        size="small"
                                                        rowKey={"id"}
                                                        columns={this.getColumns()}
                                                        showHeader={false}
                                                    />
                                                </TabPane>
                                                <TabPane tab="Access Advisor" key="2">
                                                    <Radio.Group name="selectedAdvisor" onChange={this.onChange} value={selectedAdvisor}>
                                                        <Radio.Button value={1}>Recommendation</Radio.Button>
                                                        <Radio.Button value={2}>Mirror access</Radio.Button>
                                                    </Radio.Group>
                                                    {
                                                        selectedAdvisor === 2 ?
                                                            <div className="mt-20">
                                                                <Search
                                                                    className="w-260"
                                                                    placeholder="Search Users"
                                                                    value={searchAdvisorUser}
                                                                    name="searchAdvisorUser"
                                                                    onChange={this.onChange}
                                                                />
                                                                <div className="mt-20" style={{overflowY: 'auto', height: 500}}>
                                                                    <Table
                                                                        className="mr-10"
                                                                        columns={this.getUsersColumns(false)}
                                                                        rowKey={"userName"}
                                                                        size="small"
                                                                        // loading={this.state.isLoadingUsers}
                                                                        dataSource={(this.getFilteredUsersList() || [])}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            <Table
                                                                dataSource={this.getFiltered(false)}
                                                                className="mt-20 main-table"
                                                                size="small"
                                                                rowKey={"id"}
                                                                columns={this.getColumns()}
                                                                showHeader={false}
                                                            />
                                                    }
                                                </TabPane>
                                            </Tabs>

                                        </Col>
                                    </Row>
                                }
                                {
                                    current === 3 &&
                                    <Row>
                                        <Col md={12} sm={12} xs={12}>
                                            <div className='text-right'>
                                                <Button
                                                    className="square ml-10"
                                                    size={"large"}
                                                    color="primary" onClick={() => this.onSubmit(3)}
                                                    // disabled={this.isDisabled() || !(this.getUserMapping() || []).length}
                                                >
                                                    <span>
                                                        <img src={require('../../images/enter-arrow.png')} style={{width: 20}} className="ml-10 mr-10"/>
                                                    </span>
                                                    Submit
                                                </Button>
                                                <Button
                                                    className="square ml-10"
                                                    size={"large"}
                                                    color="primary"
                                                    onClick={() => this.setState({current: 2})}
                                                >
                                                    <a>
                                                        <img src={require('../../images/multiply.png')} style={{width: 20}} className="ml-10 mr-10"/>
                                                    </a>Cancel
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col md={12} sm={12} xs={12} className="mt-10">
                                            <div className="inner-profile-right">
                                                <Table
                                                    columns={columns}
                                                    size="medium"
                                                    rowKey={'id'}
                                                    className={`user-profile-data no-padding-table`}
                                                    expandedRowRender={this.expandedRowRender}
                                                    expandIcon={this.customExpandIcon}
                                                    dataSource={selectedUsers}
                                                    defaultExpandAllRows
                                                    showHeader={false}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default ByUsers