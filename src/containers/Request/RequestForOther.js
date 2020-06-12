import React, {Component} from 'react';
import { Col, Row,} from "reactstrap";
import {Select, Input, DatePicker, Transfer} from "antd";
const {Search} = Input;
import './request.scss'

class RequestForOther extends Component {

    render() {
        const {selectedUsers, userList, handleUserChange} = this.props;
        return (
            <div>
                <Row className="mt-10">
                    <Col md={3} sm={12} xs={12}>
                        <Search
                            placeholder="Search by Name"
                        />
                    </Col>
                    <Col md={3} sm={12} xs={12}>
                        <Select
                            style={{width: "100%"}}
                            placeholder="Select Department"
                        >
                        </Select>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col xl={4} md="6" sm="12">
                        <Row className="align-items-center">
                            <Col md={3} sm={12} xs={12}>
                                <span className="mr-10"><b>Request Name</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12} className="mt-10">
                                <Input/>
                            </Col>
                            <Col md={3} sm={12} xs={12}>
                                <span className="mr-10"><b>Start Date</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12} className="mt-10">
                                <DatePicker style={{width: "100%"}}/>
                            </Col>
                            <Col md={3} sm={12} xs={12}>
                                <span className="mr-10"><b>End Date</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12} className="mt-10">
                                <DatePicker style={{width: "100%"}}/>
                            </Col>
                            <Col md={3} sm={12} xs={12}>
                                <span className="mr-10"><b>Action</b></span>
                            </Col>
                            <Col md={9} sm={12} xs={12} className="mt-10">
                                <Select style={{width: "100%"}}>
                                    <option value={'add'}>Add</option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={8} md="6" sm="12">
                        <Transfer
                            dataSource={userList || []}
                            showSearch
                            listStyle={{
                                width: 300,
                                height: 300,
                            }}
                            operations={['Select', 'Unselect']}
                            targetKeys={selectedUsers}
                            onChange={handleUserChange}
                            render={(item) => `${item.displayName}`}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default RequestForOther
