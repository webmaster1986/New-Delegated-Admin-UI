import React, {Component} from 'react'
import {Card, CardBody, Col, Container, Row, CardHeader} from "reactstrap";
import './createUser.scss';
import {DatePicker, Input, Button,  Menu, Dropdown, Icon} from "antd";
const {TextArea} = Input;
class CreateUser extends Component {
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1">1st item</Menu.Item>
                <Menu.Item key="2">2nd item</Menu.Item>
                <Menu.Item key="3">3rd item</Menu.Item>
            </Menu>
        );
        return(
            <div className="dashboard create-user container">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/create-user.png")} style={{width: 40}} /></a></span>
                                <h4 className="mt-10">Create User</h4>
                            </Col>
                            <Col md={6} sm={12} xs={12}>
                                <div className="text-right">
                               <Button className="square ml-10" size={"large"} color="primary"><a><img src={require("../../images/cursor.png")} style={{width: 20}} /></a>&nbsp;Submit</Button>
                                    <Dropdown overlay={menu}>
                                        <Button className="square ml-10" size={"large"} color="primary">
                                            <a><img src={require("../../images/save.png")} style={{width: 20}} /></a>&nbsp;Save As <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                <Button className="square ml-10" size={"large"} color="primary">&nbsp;<a><img src={require("../../images/multiply.png")} style={{width: 20}} /></a></Button>
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row className="align-items-center">
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Effective Date</b></span>
                            </Col>
                            <Col md={11} sm={12} xs={12}>
                                <DatePicker style={{width: "30%"}}/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Description</b></span>
                            </Col>
                            <Col md={11} sm={12} xs={12}>
                                <TextArea className="mt-10"/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="align-items-center">
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>First Name</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Manager</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Middle Name</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Organization</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Last Name</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Last Name</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>E-mail</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Display Name</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="align-items-center">
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>User Login</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input/>
                            </Col>
                            <Col md={6} sm={12} xs={12}/>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Password</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Confirm Password</b></span>
                            </Col>
                            <Col md={5} sm={12} xs={12}>
                                <Input className="mt-10"/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="align-items-center">
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>Start Date</b></span>
                            </Col>
                            <Col md={2} sm={12} xs={12}>
                                <DatePicker style={{width: "100%"}}/>
                            </Col>
                            <Col md={1} sm={12} xs={12}>
                                <span className="mr-10"><b>End Date</b></span>
                            </Col>
                            <Col md={2} sm={12} xs={12}>
                                <DatePicker style={{width: "100%"}}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default CreateUser
