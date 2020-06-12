import React, {Component} from 'react';
import {Icon, Input, Table} from 'antd'
import {Col, Row} from "reactstrap";


class ThirdStep extends Component{
    nestedTable = (mainRecord, mainIndex) => {
        const {onDelete, onTextChange, onAppSelect} = this.props;
        const columns = [
            {
                render: (record) => (
                    <Icon type="delete" theme="twoTone" onClick={() => onDelete(record.key, mainRecord.key)} />
                )
            },
            {
                title: 'App Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                render: (record, data, index) => (<Input name='description' value={record.description} onChange={(e) => onTextChange(index, e, mainIndex)}/>)
            },
            {
                title: 'Access Type',
                render: (record, data, index) => (<Input name='accessType' value={record.accessType} onChange={(e) => onTextChange(index, e, mainIndex)}/>)
            },
            {
                title: 'Sp. Instruction',
                render: (record, data, index) => (<Input value={record.specialInstruction} name='specialInstruction' onChange={(e) => onTextChange(index, e, mainIndex)}/>)
            }
        ];
        return (
            <Row>
                {/*<Col md="4" sm="12">
                    <div className="inner-profile">
                        <Row>
                            <Col md="12" className="pl-30 pt-15">
                                <Row><Col md="4"><b>App Name:</b> </Col><Col md="8"></Col></Row>
                                <Row><Col md="4"><b>App Type:</b> </Col><Col md="8"></Col></Row>
                                <Row><Col md="4"><b>App License:</b> </Col><Col md="8"></Col></Row>
                                <Row><Col md="4"><b>Spec Instruction:</b> </Col><Col md="8"></Col></Row>
                            </Col>
                        </Row>
                    </div>
                </Col>*/}
                <Col md="12" sm="12">
                    <Table
                        columns={columns}
                        onRow={(record) => {
                            return {
                                onClick: () => onAppSelect(record),
                            };
                        }}
                        size="small"
                        dataSource={mainRecord.apps}
                    />
                </Col>
            </Row>

        );
    }

    render() {
        const {userMappings} = this.props;
        const mainColumns = [
            {
                title: '',
                width: '40%',
                render: (record) => {
                    return (
                        <div>
                            <div><h4 className="mb-0">{`${record.firstName} ${record.lastName}`}</h4></div>
                            <div><b>Email</b>: {record.email}</div>
                        </div>
                    );
                }
            },
            {
                title: '',
                width: '40%',
                render: (record) => {
                    return (
                        <div>
                            <div><b>Application</b>: {record && record.apps && record.apps.length}</div>
                        </div>
                    );
                }
            },
            {
                width: '20%',
                render: () => {
                    return <div className="text-center">
                        <ul className="riskbar">
                            <li>
                                <span className="bg-danger" style={{height: '36%'}}/>
                            </li>
                            <li>
                                <span className="bg-warning" style={{height: '21%'}}/>
                            </li>
                            <li>
                                <span className="bg-success" style={{height: '42%'}}/>
                            </li>
                        </ul>
                        <ul className="riskbar2">
                            <li>7</li>
                            <li>4</li>
                            <li>8</li>
                        </ul>
                        <div className="text-risk"> Classification</div>
                    </div>
                }
            },
        ];
        return(
            <div>
                <Table
                    columns={mainColumns}
                    size="small"
                    className="main-table"
                    showHeader={false}
                    dataSource={userMappings}
                    selectedRowKeys={[0]}
                    expandedRowRender={this.nestedTable}
                />
            </div>
        )
    }
}

export default ThirdStep
