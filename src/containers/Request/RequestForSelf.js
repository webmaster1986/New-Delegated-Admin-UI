import React, {Component} from 'react';
import { Col, Row,} from "reactstrap";
import {Button, Select, Input, Table} from "antd";
const {Search} = Input;
import './request.scss'

class RequestForSelf extends Component {


    render() {
        const {selectedUsers, onReview, selectedItem, groupAndAppList, onSubmit } = this.props;
        return (
            <div>
                <Col xl={12} md="6" sm="12">
                    <Row className="align-items-center">
                        <Col md={12} sm={12} xs={12}>
                            <div className='user-header'>
                                {
                                    (selectedUsers || []).map((x, i) => {
                                        return <span
                                            className="mt-10 ml-10 fs-18">{x.displayName}</span>
                                    })
                                }
                                <Button
                                    className=" add-to-cart edit square mt-5 pull-right mr-10"
                                    size={"small"}
                                    color="primary">Edit</Button>
                            </div>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col md={3} sm={12} xs={12}>
                            <Search
                                placeholder="Search Catalog"
                            />
                        </Col>
                        <Col md={3} sm={12} xs={12}>
                            <Select
                                style={{width: "100%"}}
                                placeholder="Select Catalog Type"
                            >
                                <option value='Copy User Access'>Copy User
                                    Access
                                </option>
                                <option value='Entitlement'>Entitlement
                                </option>
                                <option value='Application'>Application
                                </option>
                            </Select>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <div className='text-right'>
                                <Button className="square ml-10"
                                        size={"large"}
                                        color="primary" onClick={onSubmit} disabled={!selectedItem.length}><a><img
                                    src={require('../../images/enter-arrow.png')}
                                    style={{width: 20}}
                                    className="ml-10 mr-10"/></a>Submit</Button>
                                <Button className="square ml-10"
                                        size={"large"}
                                        color="primary"
                                        onClick={onReview}
                                        disabled={!selectedItem.length}><a><img
                                    src={require('../../images/shopping-cart.png')}
                                    style={{width: 20}}
                                    className="ml-10 mr-10"/></a>Review
                                    ({selectedItem.length})</Button>
                            </div>
                        </Col>
                    </Row>
                    <Table dataSource={groupAndAppList} className="mt-20"
                           columns={this.getColumns()} showHeader={false}/>
                </Col>
            </div>
        )
    }
}

export default RequestForSelf
