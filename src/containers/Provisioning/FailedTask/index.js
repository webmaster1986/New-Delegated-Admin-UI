import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, CardHeader} from "reactstrap";
import {Input, Icon, Table, message, Spin} from 'antd';
import * as exceljs from "exceljs";
import { saveAs } from "file-saver";
import {ApiService} from "../../../services";

const {Search} = Input;


class FailedTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isShowExpandRow: false,
            expendedRows: [],
            failedTaskList: [],
            selectedIndex: null,
            searchKey: ''
        };

    }

    componentDidMount() {
        this.getAllApplications()
    }

    getAllApplications = async () => {
        this.setState({
            isLoading: true
        });

        let data = await ApiService.getFailedTasks();
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                failedTaskList: data || []
            })
        }
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onExpandedRowsChange = (data) => {
        this.setState({
            expendedRows: data.length ? [data[data.length-1]] : [],
            selectedIndex: null,
        });
    }

    onFilterData = () => {
        const {failedTaskList, searchKey} = this.state;
        if (!searchKey) {
            return failedTaskList;
        }
        let filteredData = failedTaskList;
        // filteredData = filteredData.filter(x => {
        //     return (['entity', 'operation', 'status', 'application', 'apptype', 'appid', 'retryattempt'].some(s => x[s].toLowerCase().includes(searchKey.toLowerCase())))
        // })
        return filteredData
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getColumns = () => {
        return [
            {
                title: 'Entity',
                dataIndex: 'entity'
                // width:
            },
            {
                title: 'Operation',
                dataIndex: 'operation'
            },
            {
                title: 'Status',
                dataIndex: 'status'
            },
            {
                title: 'Application',
                dataIndex: 'application'
            },
            {
                title: 'Type',
                dataIndex: 'apptype'
            },
            {
                title: 'App ID',
                dataIndex: 'appid'
            },
            {
                title: 'AutoRetryAttempt',
                dataIndex: 'retryattempt'
            }
        ];
    }

    keyRegexToLabel = (key) => {
        return (key && key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\_/g, " ").replace(/\b[a-z]/g, (x) => x.toUpperCase())) || key
    }

    onDownloadExcel = () => {
        const rows = this.onFilterData();
        const exportRows = [];
        rows.forEach(x => {
            if ((x.entitlements || []).length) {
                x.entitlements.forEach(e => {
                    exportRows.push({
                        ...x,
                        entitlementName: e.Name,
                        entitlementValue: e.Value,
                        createdDate: x.applicationProfile && x.applicationProfile.createDate
                    })
                })
            } else {
                exportRows.push({
                    ...x,
                    entitlementName: '',
                    entitlementValue: '',
                    createdDate: x.applicationProfile && x.applicationProfile.createDate
                })
            }
        });

        const workbook = new exceljs.Workbook();
        workbook.creator = 'Paul Leger';
        workbook.created = new Date();
        workbook.modified = new Date();

        const worksheet = workbook.addWorksheet("Certification");
        worksheet.columns = [
            {header: 'Account ID', key: 'accountID', width: 30},
            // {header: 'Account Type', key: 'accountType', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Application Name', key: 'application', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Last Login', key: 'lastLogin', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Entitlement Name', key: 'entitlementName', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Entitlement Value', key: 'entitlementValue', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Created Date', key: 'createdDate', width: 25, style: {alignment: {wrapText: true}}}
        ];
        exportRows.forEach((x) => {
            worksheet.addRow(x);
        });
        const firstRow = worksheet.getRow(1);
        firstRow.font = {name: 'New Times Roman', family: 4, size: 10, bold: true};
        firstRow.alignment = {vertical: 'middle', horizontal: 'center'};
        firstRow.height = 20;

        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, "OrphanAccounts.xlsx");
        });
    }

    render() {
        const {expendedRows, searchKey, isLoading} = this.state;
        return (
            <Container className="dashboard application-manage">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../../images/website (1).png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">Failed Tasks</h4>
                            </Col>
                            <Col md={6} sm={12} xs={12}>
                                <div className="text-right search-box">
                                    <Icon type="file-excel" theme="twoTone" className="fs-32 cursor-pointer mr-15" onClick={this.onDownloadExcel}/>
                                    <Search
                                        size="large"
                                        placeholder="Search for application"
                                        style={{width: 220}}
                                        className="mr-10"
                                        value={searchKey}
                                        name="searchKey"
                                        onChange={this.onChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                {
                                                    isLoading ? <Spin className='mt-50 custom-loading'/> :
                                                        <Table
                                                            className="mr-10"
                                                            columns={this.getColumns()}
                                                            size="small"
                                                            dataSource={this.onFilterData()}
                                                            expandIcon={this.customExpandIcon}
                                                            rowKey={'eventid'}
                                                            onExpandedRowsChange={this.onExpandedRowsChange}
                                                            pagination={{pageSize: 25}}
                                                            expandedRowRender={(record) => {
                                                                return (
                                                                    <div className="expand-header">
                                                                        <Row className="mt-10">
                                                                            <Col md={6} sm={12} xs={12}>
                                                                                <h4>Response</h4>
                                                                                {
                                                                                    (record && record.failureresponse || []).map((x, index) => {
                                                                                        return (
                                                                                            <Row className="mt-10" key={index.toString()}>
                                                                                                <Col md={6} sm={12} xs={12}>
                                                                                                    <p>{x.response}</p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </Col>
                                                                        </Row>
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
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

        )
    }
}

export default FailedTask