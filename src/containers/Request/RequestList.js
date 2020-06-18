import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import {Spin, Table, message, Input, Button, Icon, Select} from "antd";
import Cookies from "universal-cookie";
import moment from "moment";
import {ApiService} from "../../services";
import clonedeep from "lodash.clonedeep";

const { Search } = Input

const cookies = new Cookies();
const getUserName = () => {
    return cookies.get('LOGGEDIN_USERID');
}

class RequestList extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            deleteId: "",
            filter: "",
            tasksList: [],
            expendedRows: [],
            selectedIndex: null
        }
    }

    componentDidMount() {
        this.getAllTasks()
    }

    getAllTasks = async () => {
        this.setState({
            isLoading: true
        })

        const payload = {
            requestedBy: getUserName()
        }
        const data = await ApiService.getRequestsTasks(payload);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {

            (data || []).forEach(x => {
                x.entityName = x.entity.entityName;
                x.entityType = x.entity.entityType;
                if (x.status === 'Approved') {
                    x.daysOpen = ''
                } else {
                    const a = moment();
                    const b = moment(x.requestedOn);
                    x.daysOpen = a.diff(b, 'days') // 1
                }
            })

            this.setState({
                tasksList: (data || []).reverse(),
                isLoading: false
            })
        }
    }

    onChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    onDeleteTask = async (id) => {
        this.setState({
            deleteId: id
        })

        const payload = {
            requestID: id
        }
        const data = await ApiService.deleteTask(payload);
        if (!data || data.error) {
            this.setState({
                deleteId: ""
            });
            return message.error('something is wrong! please try again');
        } else {

            this.setState({
                tasksList: data,
                deleteId: ""
            })
            this.getAllTasks()
        }
    }

    getColumns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                width: '10%'
            },
            {
                title: 'Beneficiary Name',
                dataIndex: 'requestedForDisplayName',
                width: '15%'
            },
            {
                title: 'Email',
                dataIndex: 'requestedForEmail',
                width: '20%'
            },
            {
                title: 'Entity Name',
                dataIndex: 'entityName',
                width: '20%'
            },
            {
                title: 'Entity Type',
                dataIndex: 'entityType',
                width: '10%'
            },
            {
                title: 'Days Open',
                dataIndex: 'daysOpen',
                width: '70px',
                render: (data, item, index) => {
                    return <span>{data}</span>
                },
                sorter: (a, b) => a.daysOpen - b.daysOpen,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => {
                    return <span>{status === "Submitted" ? "Pending" : status}</span>
                },
                width: '7%'
            },
            {
                title: '',
                width: '5%',
                render: (record) => {
                    return <span> { this.state.deleteId === record.id ? <Spin size="small" className="ml-5 mt-5"/> :
                        <Button size={"default"} type="danger" onClick={() => this.onDeleteTask(record.id)}>Remove</Button>
                        }
                        </span>
                },
            }
        ];
    }

    getFilterData = () => {
        const {filter, searchKey, tasksList} = this.state;
        if (!filter) {
            return tasksList;
        }

        let filteredData = clonedeep(tasksList);

        if (filter) {
            filteredData = (tasksList || []).filter(task => task.status === filter)
        }

        if(searchKey){
            filteredData = tasksList.filter(x => {
                return ['parentReqid', 'id', 'requestedForDisplayName', 'requestedForEmail', 'entityName', 'entityType'].some(y =>  (x[y] || '').toLowerCase().includes(searchKey.toLowerCase()))
            });
        }

        return filteredData;
    }

    onExpandedRowsChange = (data) => {
        const d = []
        d.push(data[data.length-1])
        this.setState({
            expendedRows: d,
            selectedIndex: null,
        });
    }

    getUsersColumns = () => {
        return [
            {
                title: 'Action',
                dataIndex: 'action'
            },
            {
                title: 'Date',
                dataIndex: 'date'
            },
            {
                title: 'Status',
                dataIndex: 'status'
            },
            {
                title: 'Assigned To',
                dataIndex: 'assignedTo'
            },
              {
                title: 'Comments',
                dataIndex: 'comments'
              },
        ];
    }

    onExpand = (record) => {
        record.entityType = record.entity.entityType;
        record.entityName = record.entity.entityName;
        const keys = ['Date Created', 'Type', 'Name', 'Description', 'Start Date', 'End Date']
        const values = ['startDate', 'entityType', 'entityName', 'entityName', 'startDate', 'endDate'];
        const getDescription = (index) => {
            if (record['entityName'] === 'Sales Analyst') {
             return 'Oracle IDCS Group for Sales Analyst with access to Oracle Sales Cloud and AWS';
            }
            return `Description Of ${record[values[index]]}`;
        };
        const getValue = (key, index) => {
            if (key === 'Description') {
                return getDescription(index);
            } else if (key === 'Start Date' && record.status === 'Approved') {
                if (record['startDate'] && moment().isAfter(moment(record['startDate']))) {
                 return moment().format('MM/DD/YYYY');
                }
                return record['startDate'] || moment().format('MM/DD/YYYY')
            }
            return record[values[index]];
        };
        return(
            <div className="expand-header">
                <Row className="mt-10">
                    <Col md={6} sm={12} xs={12}>
                        <h4>Request Details</h4>
                        <Row className="mt-10">
                            {
                                keys.map((key, index) => (
                                    <>
                                        <Col md={6} sm={12} xs={12}>
                                            <p><b>{key}: </b></p>
                                        </Col>
                                        <Col md={6} sm={12} xs={12}>
                                            <p>{getValue(key, index)}</p>
                                        </Col>
                                    </>
                                ))
                            }
                        </Row>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                        <h4>Approval Details</h4>
                        <Table
                            className="mr-10"
                            columns={this.getUsersColumns()}
                            rowKey={"id"}
                            size="small"
                            dataSource={[
                                {
                                    action: 'Request Submission',
                                    date: moment(new Date()).format("MM/DD/YYYY"),
                                    status: 'Submitted',
                                    assignedTo: "NA",
                                    comments: ''
                                },
                                {
                                    action: 'Assigned to Manager',
                                    date: moment(new Date()).format("MM/DD/YYYY"),
                                    status: 'Assigned',
                                    assignedTo: "AMURRAY",
                                    comments: ''
                                },
                                {
                                    action: "Manager Approval",
                                    date: record.status === 'Approved' ? moment().format("MM/DD/YYYY") : '',
                                    status: record.status === 'Approved' ? 'Approved' : 'Pending',
                                    assignedTo: "AMURRAY",
                                    comments: ''
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        )
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    render() {
        const { isLoading, searchKey, expendedRows } = this.state
        return(
            <div className="dashboard">
                <Card>
                    <CardHeader className='custom-card-header'>
                        <Row className="main-div">
                            <Col md={6} sm={12} xs={12}>
                                <Col md={6} sm={12} xs={12} className="d-flex">
                                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/sources.png")} style={{width: 40}}/></a></span>
                                    <h4 className="mt-10">Track requests</h4>
                                </Col>
                            </Col>
                            <Col md={6} sm={12} xs={12}>
                                <Select placeholder='Filter' className='border-0 ml-10 float-right' size="large"
                                        onChange={(value) => this.onChange({
                                            target: {
                                                name: 'filter',
                                                value
                                            }
                                        })} style={{width: 220}}>
                                    <Select.Option value="">All</Select.Option>
                                    <Select.Option value="Approved">Approved</Select.Option>
                                    <Select.Option value="Rejected">Rejected</Select.Option>
                                    <Select.Option value="Submitted">Pending</Select.Option>
                                    <Option value="mustReview">Must Review</Option>
                                </Select>
                                <Search
                                    size="large"
                                    placeholder="Search for Requests"
                                    style={{width: 220}}
                                    className="float-right"
                                    value={searchKey}
                                    name="searchKey"
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                {
                                    isLoading ? <Spin className='mt-50 custom-loading'/> :
                                        <Table
                                            className="mr-10"
                                            columns={this.getColumns()}
                                            rowKey={"id"}
                                            size="small"
                                            expandIcon={this.customExpandIcon}
                                            dataSource={this.getFilterData()}
                                            onExpandedRowsChange={this.onExpandedRowsChange}
                                            expandedRowRender={(record) => {
                                                return (
                                                    <div>
                                                        {this.onExpand(record)}
                                                    </div>
                                                )
                                            }}
                                            expandedRowKeys={expendedRows}
                                            onRow={
                                                (record, index) => {
                                                    return {
                                                        className: expendedRows.includes(index) ? 'expanded-tr' : ''
                                                    };
                                                }
                                            }
                                        />
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }

}

export default RequestList
