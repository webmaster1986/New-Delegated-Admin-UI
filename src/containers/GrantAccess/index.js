import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import {
    message,
    Spin,
    Button,
    Input,
    Table,
    Icon
} from "antd";
const {Search} = Input;
import {ApiService, getUserName} from "../../services/ApiService";
import './request.scss'
import '../Home/Home.scss'

import TableTransfer from "./TableTransfer";

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


class Request extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            isLoading: false,
            userList: [],
            selectedUsersKeys: [],
            selectedUsers: [],
            selectedItem: [],
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

    getUsersColumns = () => {
        return [
            {
                title: 'User Name',
                dataIndex: 'userName',
                width: '20%'
            },
            {
                title: 'Display Name',
                dataIndex: 'displayName',
                width: '20%'
            },
            {
                title: 'Department',
                dataIndex: 'department',
                width: '20%'
            },
            {
                title: 'Manager',
                dataIndex: 'managerDisplayName',
                width: '20%'
            }
        ]
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

    getFiltered = () => {
        return this.state.groupsList
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
                    return <div>
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
                    return <span>{record && (record.name)}</span>
                },
                width: "60%",
            },
            {
                title: 'Description',
                render: (record) => {
                    return <span>{record && (record.description)}</span>
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

    render() {
        const { isLoading, userList, selectedUsersKeys, current, selectedItem, selectedUsers } = this.state;

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
                    return <span>Name: <b>{record.displayName}</b><br/> UserName: <b>{record.userName}</b></span>
                },
                width: "60%",

            },
            {
                render: (record) => {
                    return (
                        <span>Email: <b>{record.email}</b></span>);
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

                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={10} sm={12} xs={12}>
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5"><a><img
                                                src={require("../../images/request.png")}
                                                style={{width: 40}}/></a></span>
                                            <h4 className="mt-10">Grant Access By Users</h4>
                                        </Col>
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
                                            className="float-right" type="primary" onClick={this.next}>
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
                                                    <div className='user-header'
                                                         style={{height: 35, paddingTop: 2}}>
                                                        {
                                                            (users || []).slice(0, 3).map((x, i) => {
                                                                return <span
                                                                    className="mt-10 ml-10 fs-18">{x.displayName}</span>
                                                            })

                                                        }
                                                        <span
                                                            className="mt-20 ml-10 fs-18 ">&nbsp;{users.length > 3 ? `+${users.length - 3} more` : null}</span>
                                                        <Button
                                                            className=" add-to-cart edit square mt-5 pull-right mr-10"
                                                            size={"small"}
                                                            color="primary"
                                                            onClick={() => this.setState({current: 1})}>Edit</Button>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row className="mt-10">
                                                <Col md={3} sm={12} xs={12}>
                                                    {/*<Search
                                                        placeholder="Search Catalog" value={searchUser}
                                                        name="searchUser" onChange={this.onChange}
                                                    />*/}
                                                </Col>
                                                <Col md={3} sm={12} xs={12}>
                                                    {/*<Select
                                                        style={{width: "100%"}}
                                                        placeholder="Select Catalog Type"
                                                        value={catalogType}
                                                        name="catalogType"
                                                        size="small"
                                                        onChange={this.onSelectChange}

                                                    >
                                                        <option value=''>All
                                                        </option>
                                                        <option value='Group'>Group
                                                        </option>
                                                        <option value='Application'>Application
                                                        </option>
                                                    </Select>*/}
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

                                                        <Button className="square ml-10"
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

                                            <Table
                                                dataSource={this.getFiltered()}
                                                className="mt-20 main-table"
                                                size="small"
                                                rowKey={"id"}
                                                columns={this.getColumns()}
                                                showHeader={false}
                                            />
                                        </Col>
                                    </Row>
                                }
                                {
                                    current === 3 &&
                                    <Row>
                                        <Col md={12} sm={12} xs={12}>
                                            <div className='text-right'>
                                                <Button className="square ml-10"
                                                        size={"large"}
                                                        color="primary" onClick={() => this.onSubmit(3)}
                                                        // disabled={this.isDisabled() || !(this.getUserMapping() || []).length}
                                                >
                                                    <span>
                                                        <img src={require('../../images/enter-arrow.png')} style={{width: 20}} className="ml-10 mr-10"/>
                                                    </span>
                                                    Submit
                                                </Button>
                                                <Button className="square ml-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={() => this.setState({current: 2})}><a><img
                                                    src={require('../../images/multiply.png')}
                                                    style={{width: 20}} className="ml-10 mr-10"/></a>Cancel</Button>
                                            </div>
                                        </Col>
                                        <Col md={12} sm={12} xs={12} className="mt-10">
                                            <div className="inner-profile-right">
                                                <Table
                                                    columns={columns}
                                                    size="medium"
                                                    rowKey={'userName'}
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

export default Request