import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row,} from "reactstrap";
import {Progress, Table, message, Spin, Checkbox, Icon, Input, Select, DatePicker, Button} from "antd";
import {ApiService} from "../../services/ApiService";
import '../Home/Home.scss'
import moment from 'moment'
import { CSVLink } from "react-csv";
const { RangePicker } = DatePicker;

class Reporting extends Component {
    _apiService = new ApiService()
    state = {
        includedAppsOptions: ['Active Directory', 'Peoplesoft', 'LDAP'],
        certificationsList: [],
        members: [],
        filterCertificationsList: [],
        appName: '',
        actionType: '',
        campaignEndDate: '',
        campaignName: '',
    };

    componentDidMount() {
        this.getCertifications()
    }

    getCertifications = async () => {
        this.setState({
            isLoading: true,
        });
        const data = await this._apiService.getCertifications()
        if(!data || data.error){
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                certificationsList: data,
            });
        }
    }

    getCertificateUsers = async (certificationId) => {
        const data = await this._apiService.getCertificateUsers(certificationId);
        if (!data || data.error) {
            return message.error('something is wrong! please try again');
        } else {
            let members = (data.members || []).map((x, i) => ({
                ...x,
                id: i + 1,
            }));
            this.setState({
                certificate: data,
                members,
            }, () => {
                this.csvLink.link.click()
            });
        }
    }

    CertificationsTable = () => {
        const { isLoading, filterCertificationsList} = this.state;
        const mainColumns = [
            {
                title: '',
                width: '50%',
                render: (record) => {
                    return (
                        <div className="pl-10 tab-area" >
              <span className='cursor-pointer' >
              <div><h4 className="mb-0">{record.reviewerCertificationInfo.certificationName}</h4></div>
              <div className="cert-owner"><small>{record.Description}</small></div>
                  {/*<div className="cert-owner"><span>Cert Owner:</span> <b>{record.reviewerCertificationInfo.certificateRequester}</b></div>*/}
              </span>
                        </div>
                    );
                }
            },
            {
                title: '',
                render: (record) => {
                    return (
                        <div>
                            <div className="filter-row"><span>Created on</span>: <b>{ moment(record.reviewerCertificationInfo.certificationCreatedOn).format('DD-MM-YYYY')}</b></div>
                            <div className="filter-row"><span>Expire on</span>: <b>{moment(record.reviewerCertificationInfo.certificationExpiration).format('DD-MM-YYYY')}</b></div>
                            <div className="filter-row"><span>Status</span>: <b className="status active">{record.reviewerCertificationInfo.status}</b></div>
                        </div>
                    );
                }
            },
            {
                render: (record) => {
                    return <div className="text-center"><Progress type="circle" width={100} percent={record.reviewerCertificateActionInfo.percentageCompleted || 0}/>
                    </div>;
                }
            },
            {
                title: '',
                render: (record) => {
                    return (
                        <span className="cursor-pointer text-primary" onClick={() => this.getCertificateUsers(record.certificationId)} >Download CSV</span>
                    );
                }
            },
        ];
        {
            return isLoading ? <Spin className='mt-50 custom-loading'/> : <Table
                columns={mainColumns}
                size="small"
                className="main-table"
                showHeader={false}
                dataSource={filterCertificationsList}
            />;
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSearch = () => {
        const {certificationsList, appName, actionType, campaignEndDate, campaignName, selectedEndDate, selectedStartDate} = this.state;
        let filterCertificationsList = certificationsList || [];
        if (campaignName) {
            filterCertificationsList = (certificationsList || []).filter(x => {
                return x.reviewerCertificationInfo.certificationName.toLowerCase().includes(campaignName.toLowerCase())
            })
        }
        if(campaignEndDate){
            let startDate = moment().unix();
            let endDate = moment().endOf('day').unix();
            if (campaignEndDate === 'Last30days') {
                startDate = moment().add(-30, 'days').startOf('day').unix();
            } else if (campaignEndDate === 'Last60days') {
                startDate = moment().add(-60, 'days').startOf('day').unix();
            } else if (campaignEndDate === 'Last3months') {
                startDate = moment().add(-3, 'months').startOf('day').unix();
            } else if (campaignEndDate === 'Last6months') {
                startDate = moment().add(-6, 'months').startOf('day').unix();
            } else if (campaignEndDate === 'EnterDateRange') {
                startDate = moment(selectedStartDate).startOf('day').unix();
                endDate = moment(selectedEndDate).startOf('day').unix();
            }
            filterCertificationsList = (certificationsList || []).filter(x => {
                return moment(x.reviewerCertificationInfo.certificationCreatedOn).unix() >= startDate &&
                    moment(x.reviewerCertificationInfo.certificationCreatedOn).unix() <= endDate;
            });
        }
        this.setState({
            filterCertificationsList
        })

    }

    onReset = () => {
        this.setState({
            appName: '',
            actionType: '',
            campaignEndDate: '',
            campaignName: ''
        })
    }

    onDateChange = (date, dateString) =>  {
        this.setState({
            selectedStartDate: dateString[0],
            selectedEndDate: dateString[1],

        })
    }

    render() {
        const {members, includedAppsOptions, appName, actionType, campaignEndDate, campaignName, filterCertificationsList} = this.state;
        const headers = [
            { label: "First Name", key: 'userInfo.FirstName'},
            { label: "Last Name", key: 'userInfo.LastName'},
            { label: "Email", key: 'userInfo.Email'},
            { label: "Roles", key: 'noOfRoles'},
            { label: "Application", key: 'numOfEntitlements'},
            { label: "Entitlement", key: 'noOfApplications'},
        ];
        return(
            <div className="dashboard">
                <CardHeader className='custom-card-header'>
                    <Row className="main-div">
                        <Col md={10} sm={12} xs={12}>
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/report.png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">Reporting</h4>
                            </Col>
                        </Col>
                    </Row>
                </CardHeader>
            <Card className="mb-20">
                <CardBody>
                    <Row className='align-items-center'>
                        <Col md={4} sm={12} xs={12}>
                            <span className="mr-30"><b>Campaign Name</b></span><Input placeholder={'You can search for your campaign by name'} className='w-70-p' value={campaignName} name='campaignName' onChange={this.onChange} addonAfter={<Icon type="search"/>}/>
                        </Col>
                        <Col md={4} sm={12} xs={12}>
                            <span className="mr-10"><b>App Name</b></span>
                            <Select className='w-70-p' value={appName} onChange={value => this.onChange({target: {name: 'appName', value}})}>
                                {
                                    includedAppsOptions.map((x)=>{
                                        return <Select.Option value={x}>{x}</Select.Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col md={4} sm={12} xs={12}>
                            <span className="mr-10"><b>Action Type</b></span>
                            <Select className='w-70-p' value={actionType} onChange={value => this.onChange({target: {name: 'actionType', value}})}>
                                <Select.Option value={"Approve"}>Approve</Select.Option>
                                <Select.Option value={"Revoke"}>Revoke</Select.Option>
                                <Select.Option value={"Flag"}>Flag</Select.Option>
                            </Select>
                        </Col>
                        <Col md={4} sm={12} xs={12} className="mt-10">
                            <span className="mr-10"><b>Campaign End Date</b></span>
                            <Select className='w-70-p' value={campaignEndDate} onChange={value => this.onChange({target: {name: 'campaignEndDate', value}})}>
                                <Select.Option value={"Last30days"}>Last 30 days</Select.Option>
                                <Select.Option value={"Last60days"}>Last 60 days</Select.Option>
                                <Select.Option value={"Last3months"}>Last 3 months</Select.Option>
                                <Select.Option value={"Last6months"}>Last 6 months</Select.Option>
                                <Select.Option value={"EnterDateRange"}>Enter Date Range</Select.Option>
                            </Select>
                        </Col>
                        {
                            campaignEndDate === 'EnterDateRange' &&
                            <>
                                <Col md={4} sm={12} xs={12} className="mt-10">
                                    <RangePicker name='dateSubmitted' className=' ml-75 w-70-p' onChange={this.onDateChange}/>
                                </Col>
                            </>
                        }
                    </Row>
                        <Row>
                            <Col xs={12} md={12} sm={12} className="text-center mt-10">
                                <Button type="primary" icon="search"  onClick={this.onSearch}>Search</Button>
                                <Button className="mb-0 ml-5" onClick={this.onReset}>Reset</Button>
                            </Col>
                        </Row>
                </CardBody>
            </Card>
                {
                    filterCertificationsList.length ?
                    <Card>
                        <CSVLink
                            data={members}
                            headers={headers}
                            ref={(r) => this.csvLink = r}
                            asyncOnClick={true}
                        />
                        <CardBody>
                            <Row>
                                <Col md={12} sm={12} xs={12}>
                                    { this.CertificationsTable()}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card> : null
                }

            </div>
        )
    }

}
export default Reporting
