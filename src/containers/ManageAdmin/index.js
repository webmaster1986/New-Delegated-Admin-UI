import React, {Component} from 'react';
import { Card, CardBody, Container, Row, Col, CardHeader } from "reactstrap";
import {Button, Table, Spin, message} from "antd"
import {ApiService} from "../../services";

class ManageAdmin extends Component {
    constructor(props){
        super(props)
        this.state={
            isLoading: false,
            userList: []
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

    render() {
        const { isLoading, userList } = this.state
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
                                        <Button
                                            type="primary"
                                            className="square"
                                            size="small"
                                            // onClick={() => this.onAddCampaign(true)}
                                        >
                                            <a><img src={require("../../images/plus-symbol.png")} style={{width: 18}}/></a>
                                            &nbsp;Assign New Admin
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ? <Spin className='custom-loading mt-50'/> :
                                        <Row>
                                            <Col md={12} sm={12} xs={12} className='mt-10'>
                                                <Table
                                                    columns={this.getColumns()}
                                                    size='small'
                                                    dataSource={userList}
                                                />
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

export default ManageAdmin