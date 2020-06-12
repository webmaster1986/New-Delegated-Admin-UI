import React, {Component} from 'react'
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import queryString from 'query-string'
import './createUser.scss';
import { message, Table, Switch, Spin, Popconfirm } from "antd";
import {ApiService} from "../../services";
import {getUserName} from "../../services/ApiService";

class MyUsers extends Component {
    constructor(props){
        super(props)
        const params = this.props.history.location.search || ""
        const query = queryString.parse(params) || {}
        this.state = {
            isEdit: false,
            identityUsersList: [],
            isLoading: false,
            isModifyUser: !!query.id,
            selectedRecord: {},
            profile: {},
            totalResource: 0,
            defaultCurrent: 1,
            id: query.id || "",
            activeKey: query.tab || '1'
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
            return identityUsersList.filter(x => x.Email && x.Manager).filter(x =>  x.UserName !== getUserName() && x.Manager === getUserName())
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
            data.resources.forEach((res, index) => {
                res.isAdmin = true
                res.status = "Locked"
                res.key = index
            })
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
            selectedRecord
        })
    }

    onCloseModifyUser = (selectedRecord, isModifyUser) =>{
        this.setState({
            selectedRecord,
            isModifyUser
        })
    }

    onChange = (index, key) => {
        let { identityUsersList } = this.state
        if(key === 'status') {
            identityUsersList[index][key] = identityUsersList[index][key] === "Locked" ? "Unlocked" : "Locked"
        }
        if(key === 'isAdmin') {
            identityUsersList[index][key] = !(identityUsersList[index][key])
        }
        this.setState({identityUsersList})
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
            columns.push(
                {
                    title: 'Status',
                    width: 150,
                    render: (record) => {
                        const checked = record.status === "Locked"
                        return (
                            <Popconfirm
                                title={checked ? 'Are you sure to make users Unlocked' : 'Are you sure to make users Locked'}
                                okText={'Yes'}
                                cancelText={'No'}
                                onConfirm={() => this.onChange(record.key, 'status')}
                            >
                                <Switch
                                    size="small"
                                    className="green w-80 red"
                                    checkedChildren={"Unlocked"}
                                    unCheckedChildren={"Locked"}
                                    checked={checked}
                                />
                            </Popconfirm>
                        )
                    }
                },
                {
                    title: 'Admin',
                    width: 150,
                    render: (record) => {
                        const checked = record.isAdmin
                        return (
                            <Popconfirm
                                title={checked ? 'Are you sure to disable the account' : 'Are you sure to make users Admin'}
                                okText={'Yes'}
                                cancelText={'No'}
                                onConfirm={() => this.onChange(record.key, 'isAdmin')}
                            >
                                <Switch
                                    size="small"
                                    className="green w-80 red"
                                    checkedChildren={'No'}
                                    unCheckedChildren={'Yes'}
                                    checked={checked}
                                />
                            </Popconfirm>
                        )
                    }
                },
            );
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

    render() {
        const {isLoading, isModifyUser, selectedRecord, profile, activeKey} = this.state;
        return(
            <div className="dashboard create-user">
                <Card className="mt-20">
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/user.png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">My Users</h4>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        {isLoading ? <Spin className='mt-50 custom-loading'/> :
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
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default MyUsers
