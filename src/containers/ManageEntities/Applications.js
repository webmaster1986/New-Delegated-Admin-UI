import React, { Component } from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import {Button, Input, message, Select, Spin, Table} from "antd";
import {ApiService} from "../../services";


class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            entitiesList: [],
            expendedRows: [],
        };
    }

    componentDidMount() {
        this.getAllApplications()
    }

    getAllApplications = async () => {
        this.setState({
            isLoading: true
        });
        const data = await ApiService.getAllEntities();
        if(!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                entitiesList: data && data.applications || [],
                isLoading: false
            })
        }

    }

    onEdit = (record) => {
        const arr = [];
        arr.push(record.application)
        this.setState({
            selectedRecord: {
                entityType: 'application',
                ...record
            },
            expendedRows: arr,
        });
    }

    onChange = (event) => {
        const { value, name } = event.target
        this.setState({
            selectedRecord: {
                ...this.state.selectedRecord,
                [name]: value
            }
        })
    }

    getColumns = () => {
        return [
            {
                title: 'Application',
                dataIndex: 'application'
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
            {
                title: 'Owner Name',
                dataIndex: 'ownerName'
            },
            {
                title: 'Risk Level',
                dataIndex: 'risk',
            },
            {
                title: 'ACTIONS',
                render: (record, data, index) => {
                    return <div>
                        <span className="mr-5 cursor-pointer" onClick={() => this.onEdit(record, index)}><img src={require("../../images/edit-icon.png")} style={{width: 20}}/></span>
                    </div>
                }
            }
        ];
    }

    onSave = async () => {
        const { selectedRecord } = this.state
        const data = await ApiService.postEntity(selectedRecord)
        console.log({data})
    }

    onCancel = () => {
        this.setState({
            expendedRows: [],
            selectedRecord: {}
        })
    }


    render() {
        const { entitiesList, expendedRows, selectedRecord, isLoading } = this.state
        return (
            <Container className="dashboard application-manage">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/website (1).png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">Application</h4>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <Card>
                                    <CardBody>
                                        { isLoading ? <Spin className='mt-50 custom-loading'/> :
                                            <Row>
                                                <Col>
                                                    <Table className="mr-10"
                                                           columns={this.getColumns()}
                                                           size="small"
                                                           dataSource={entitiesList}
                                                           rowKey={'application'}
                                                           expandIcon={() => null}
                                                           expandedRowRender={(record) => {
                                                               return (
                                                                   <div className="expand-header">
                                                                       <Row>
                                                                           <Col md={6} sm={12} xs={12}>
                                                                               <Row className="mt-10">
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <p><b>Owner Name: </b></p>
                                                                                   </Col>
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <Input
                                                                                           value={selectedRecord.ownerName}
                                                                                           type={"text"}
                                                                                           name={"ownerName"}
                                                                                           onChange={this.onChange}
                                                                                       />
                                                                                   </Col>
                                                                               </Row>
                                                                               <Row className="mt-10">
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <p><b>Owner Id: </b></p>
                                                                                   </Col>
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <Input
                                                                                           value={selectedRecord.ownerID}
                                                                                           type={"text"}
                                                                                           name={"ownerID"}
                                                                                           onChange={this.onChange}
                                                                                       />
                                                                                   </Col>
                                                                               </Row>
                                                                           </Col>
                                                                           <Col md={6} sm={12} xs={12}>
                                                                               <Row className="mt-10">
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <p><b>Description: </b></p>
                                                                                   </Col>
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <Input
                                                                                           value={selectedRecord.description}
                                                                                           type={"text"}
                                                                                           name={"description"}
                                                                                           onChange={this.onChange}
                                                                                       />
                                                                                   </Col>
                                                                               </Row>
                                                                               <Row className="mt-10">
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <p><b>Risk Level: </b></p>
                                                                                   </Col>
                                                                                   <Col md={6} sm={12} xs={12}>
                                                                                       <div
                                                                                           className="form__form-group-field">
                                                                                           <Select
                                                                                               showSearch
                                                                                               className="w-100-p"
                                                                                               name="risk"
                                                                                               value={selectedRecord.risk}
                                                                                               onChange={(value) => this.onChange({
                                                                                                   target: {
                                                                                                       name: 'risk',
                                                                                                       value
                                                                                                   }
                                                                                               })}>
                                                                                               {
                                                                                                   ['Low', 'Medium', 'High'].map((x, i) => {
                                                                                                       return (
                                                                                                           <Select.Option
                                                                                                               value={x.toLowerCase()}
                                                                                                               key={i}>{x}</Select.Option>
                                                                                                       )
                                                                                                   })
                                                                                               }

                                                                                           </Select>
                                                                                       </div>
                                                                                   </Col>
                                                                               </Row>
                                                                           </Col>
                                                                       </Row>
                                                                       <Row className="mt-10">
                                                                           <Col md={12} sm={12} xs={12}>
                                                                               <div className="pull-right">
                                                                                   <Button type="primary"
                                                                                           className="mr-10"
                                                                                           onClick={this.onSave}>{isLoading ?
                                                                                       <Spin
                                                                                           className='color-white'/> : 'Submit'}</Button>
                                                                                   <Button
                                                                                       onClick={this.onCancel}>Cancel</Button>
                                                                               </div>
                                                                           </Col>
                                                                       </Row>
                                                                   </div>
                                                               )
                                                           }}
                                                           expandedRowKeys={expendedRows}
                                                           onRow={
                                                               (record, index) => {
                                                                   return {
                                                                       className: expendedRows.includes(record.application) ? 'expanded-tr' : ''
                                                                   };
                                                               }
                                                           }
                                                    />
                                                </Col>
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default Applications;
