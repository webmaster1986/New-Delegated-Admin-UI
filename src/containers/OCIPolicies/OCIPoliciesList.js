import React, {Component} from 'react';
import {Dropdown, Icon, Menu, Spin, Table, Tooltip, Modal} from "antd";
import {Card, Col, Row} from "reactstrap";
import '../OwnerCertification/CertificaitonOwner.scss'


class OCIPoliciesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expendedRows: []
        };
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    columns = () => {
        return(
            [
                {
                    title: 'Application',
                    width: "100%",
                    render: (record) => {
                        return <span><span
                            className='application'>Name:</span> <b>{record.name}</b>
                        </span>
                    }
                }
            ]
        )
    }

    openInfo = (record) => {
        this.setState({
          selectedRecord: record,
        }, this.toggleModal);
    }

    expandedRowRender = (mainRecord) => {
        const getRisk = (risk) => {
            if (risk === 'High') {
                return (<Tooltip placement="bottom" title="High">
                    <Icon type="info-circle" theme="filled" className="ml-5 color-red"/>
                </Tooltip>)
            } else if (risk === 'Medium') {
                return (<Tooltip placement="bottom" title="Medium">
                    <Icon type="info-circle" theme="filled" className="ml-5 color-orange"/>
                </Tooltip>)
            } else if (risk === 'Low') {
                return (<Tooltip placement="bottom" title="Low">
                    <Icon type="info-circle" theme="filled" className="ml-5 color-green"/>
                </Tooltip>)
            }
            return '';
        }
        const columns = [
            {
                title: 'Subject',
                width: "25%",
                render: (record) => {
                    return (<span>
                      {record && record.subject}
                      { (record.groupMembers || []).length ?
                        <Icon type="info-circle" className="mr-5 ml-5" style={{color: '#1890ff'}} onClick={() => this.openInfo(record)}/>
                        : null
                      }
                    </span>)
                }
            },
            {
                title: 'Resource',
                width: "20%",
                render: (record) => {
                    return <span>{record && record.resource}</span>
                }
            },
            {
                title: 'Location',
                width: "15%",
                render: (record) => {
                    return <span>{record && record.location}</span>
                }
            },
            {
                title: 'Compartment',
                width: "20%",
                render: (record) => {
                    return <span>{record && record.compartment}</span>
                }
            },
            {
                title: 'Risk',
                width: "120px",
                render: (record) => {
                    return getRisk(record.Risk)
                }
            },
            {
                title: 'Action',
                width: "120px",
                render: (record) => {
                    const menu = (
                        <Menu className="pt-10 pb-10 pl-10 pr-10 w-260 overflow-wrap">
                            <span>{record && record.statement}</span>
                        </Menu>
                    );

                    return (
                        <span style={{verticalAlign: 'super'}}>
                            <Icon type="delete" theme="filled" className="cursor-pointer mr-5"/>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon type="unordered-list" className='text-primary'/>
                            </Dropdown>
                        </span>
                    )
                }
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={mainRecord && mainRecord.policy || []}
                    pagination={false}
                />
            </Card>
        );
    };

    toggleModal = () => {
        this.setState({
          isModal: !this.state.isModal,
          selectedRecord: this.state.isModal ? null : this.state.selectedRecord
        });
    }

    modal = () => {
        const {selectedRecord = {}} = this.state;
        return (
          <Modal
            visible={this.state.isModal}
            onCancel={this.toggleModal}
            title="Group Members"
            footer={null}
            width={410}
          >
              <Row>
                {
                  ((selectedRecord && selectedRecord.groupMembers) || []).map(x => (
                    <Col md={12}>
                      { x }
                    </Col>
                  ))
                }
              </Row>
          </Modal>
        )
    }

    render() {
        const { isLoading, dataList } = this.props;
        return(
            <div className='border-1 mt-20' style={{flex: 1}}>
                { isLoading ?
                    <Spin className='mt-50 custom-loading'/> :
                    <Row>
                        <Col md="12" sm="12" className='pl-15'>
                            <div className="inner-profile-right">
                                <Table
                                    columns={this.columns()}
                                    size="medium"
                                    className={`user-profile-data no-padding-table`}
                                    expandedRowRender={this.expandedRowRender}
                                    expandIcon={this.customExpandIcon}
                                    dataSource={dataList || []}
                                    defaultExpandAllRows={true}
                                    pagination={false}
                                    showHeader={false}
                                    onRow={
                                        (record, index) => {
                                            if (!((record.policy || []).length)) {
                                                return { className: 'no-ent-data'};
                                            }
                                            return {
                                                className: this.state.expendedRows.includes(index) ? 'expanded-tr' : ''
                                            };
                                        }
                                    }
                                />
                            </div>
                        </Col>
                      {
                        this.state.isModal && this.modal()
                      }
                    </Row>
                }
            </div>
        )
    }
}

export default OCIPoliciesList
