import React, {Component} from 'react'
import {Card, CardBody, Col, Container, Row, CardHeader} from "reactstrap";
import './createUser.scss';
import {Input, Button, message, Table, Switch, Spin} from "antd";
import {ApiService} from "../../services";
import ModifyUser from "./ModifyUser";
const {Search} = Input;

class Users extends Component {
    state = {
        isEdit: false,
        identityUsersList: [],
        isLoading: false,
        isModifyUser: false,
        selectedRecord: {},
        totalResource: 0,
        defaultCurrent: 1
    };

    componentDidMount() {
        this.GetAllIdentityUsers(1)
    }

    getFilteredUsers = () => {
        const {identityUsersList, searchUser} = this.state;
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
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                identityUsersList: data.resources,
                totalResource: data.totalResource
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

    getColumns = () => {
        return [
            {
                title: 'User Id',
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
                title: 'Manager',
                width: '18%',
                dataIndex: 'Manager',
            },
            {
                title: 'Identity Status',
                width: '18%',
                render: (record) => (<span>{'Active'}</span>)
            },
            {
                title: 'Enable/Disable User',
                width: 150,
                render: (record) => (  <Switch size="small" defaultChecked />)
            },


        ];
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

    render() {
        const {isLoading, isModifyUser, selectedRecord, searchUser, totalResource, defaultCurrent} = this.state;
        return(
            <Container className="dashboard create-user">
                {
                    !isModifyUser ?
                        <Card>
                            <CardHeader>
                                <Row className="align-items-center">
                                    <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/user.png")} style={{width: 40}}/></a></span>
                                        <h4 className="mt-10">Users</h4>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        <div className="text-right">
                                            <Button className="square mr-10" size={"large"} color="primary"><a><img
                                                src={require("../../images/plus-symbol.png")}
                                                style={{width: 20}}/></a>&nbsp;Add User</Button>
                                            <Search
                                                size="large"
                                                placeholder="Search Name"
                                                style={{width: 220}}
                                                value={searchUser}
                                                onChange={this.onChangeSearchUser}
                                            />
                                        </div>
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
                                                pagination={{
                                                    onChange: this.handlePagination,
                                                    pageSize: 10,
                                                    total: totalResource,
                                                    defaultCurrent: defaultCurrent

                                                }}
                                            />
                                        </Col>
                                    </Row>
                                }
                            </CardBody>
                        </Card> :
                        <ModifyUser
                            selectedRecord={selectedRecord}
                            onCloseModifyUser={this.onCloseModifyUser}/>
                }

            </Container>
        )
    }
}
export default Users
