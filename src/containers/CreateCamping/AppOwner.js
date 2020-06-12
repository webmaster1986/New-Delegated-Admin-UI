import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col,} from "reactstrap";
import {Input, Select, Icon, Table, Checkbox, Radio, DatePicker, Steps, Button, InputNumber, Modal, message} from 'antd';
import moment from 'moment'
import UserSearchModal from './UserSearchModal';
const {TextArea} = Input;
const Search = Input.Search;
const {Option} = Select;
const {Step} = Steps;
import './AppOwner.scss';
import {ApiService} from "../../services/ApiService";

const frequencyData = [
    {
        key: "30 day",
        value: "30"
    },
    {
        key: "40 day",
        value: "40"
    },
    {
        key: "50 day",
        value: "50"
    },
    {
        key: "60 day",
        value: "60"
    },
    {
        key: "70 day",
        value: "70"
    },
];

class AppOwner extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            reminderFrequencyOption: ['Every', 'BeforeDueDate'],
            includedAppsOptions: ['Active Directory', 'Peoplesoft', 'LDAP'],
            reminderFrequencies: [{frequency: '', days: ''}],
            SendReminderEmail: false,
            IncludedApps: '',
            includedAppsData: [],
            certOwners: ['user 1', 'user 2', 'user 3', 'user 4'],
            isUserSearchModal: false,
            certOwner: '',
            certificationName: '',
            certificationDescription: '',
            certificationFrequency: '',
            campaignDuration: '',
            undecidedAccess: '',
            selectedApp: '',
            certificationStartDate: '',
            certificationToRunNow: false,
            certificationForOneTime: false,
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    selectChange = (e) => {
        const {reminderFrequencies} = this.state;
        let {reminderFrequencyOption} = this.state;
        reminderFrequencies[e.target.index][e.target.name] = e.target.value;
        this.setState({
            reminderFrequencies,
            reminderFrequencyOption
        });
    }

    onCreateCampaigns = async () => {
        const {certificationName, certificationDescription, certificationFrequency, certificationStartDate,
            certOwner, certificationForOneTime, certificationToRunNow,campaignDuration, includedAppsData,} = this.state;
        const certificationExpiration = moment(certificationStartDate).add(campaignDuration && campaignDuration.length , 'days').format("YYYY-MM-DD");
        const scopeCriteria = [];
        let scopeCriteriaObj = {};
        (includedAppsData || []).forEach((x)=>{
            scopeCriteriaObj = {
                name: 'Application',
                value: x.AppName
            };
            scopeCriteria.push(scopeCriteriaObj);
        });
        const payload = {
            certificationType:"UserCertification",
            certificationName,
            certificationDescription,
            certificateRequester: certOwner,
            certificationExpiration,
            certificationFrequency,
            certificationForOneTime: certificationForOneTime ? 'yes' : 'no',
            certificationStartDate: moment(certificationStartDate).format("YYYY-MM-DD"),
            certificationToRunNow : certificationToRunNow ? 'yes' : 'no',
            criteria : {
                selectionCriteria: [],
                scopeCriteria
            }
        };
        const data = await ApiService.createCampaign(payload)
        if(!data || data.error) {
            return message.error('something is wrong! please try again');
        }else {
            if (data && data.campaignId) {
                await ApiService.createCampaignUsers(data && data.campaignId)
            }
            return message.success('Campaign created successfully!');
        }
    }

    onAddFrequency = e => {
        let reminderFrequencies = this.state.reminderFrequencies.concat([{frequency: '', days: ''}])
        this.setState({
            reminderFrequencies
        })
    }

    onDeleteFrequency = (index) => {
        const {reminderFrequencies} = this.state;
        this.setState({
            reminderFrequencies: reminderFrequencies.filter((x, i) => i !== index)
        })
    }

    onCheckBoxCheck = (e) => {
        const newState = {};
        const {name, checked} = e.target;
        if (name === 'isOneTime' && checked) {
            newState.certificationFrequency = '';
        }
        if (name === 'isRunNow' && checked) {
            newState.startDate = null;
        }
        this.setState({
            [e.target.name]: e.target.checked,
            ...newState
        })
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onDatePickerChange = (date, dateString, name) => {
        this.setState({
            [name]: date,
        })
    }

    firstStep = () => {
        const {certOwner, certificationDescription, certificationName} = this.state;
        return (
            <Row className="align-items-center step-row">
                <Col md={3} sm={12} xs={12}><b>Certification Name</b></Col>
                <Col md={9} sm={12} xs={12}><Input name="certificationName" value={certificationName}
                                                   onChange={this.onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Description</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10"><TextArea name="certificationDescription"
                                                                        value={certificationDescription}
                                                                        onChange={this.onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Cert Owner</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Input value={certOwner} onChange={this.onChange} name="certOwner"
                           addonAfter={<Icon type="search" onClick={this.toggleUserSearchModal}/>}/>
                </Col>
            </Row>
        )
    }

    secondStep = () => {
        const {certificationForOneTime, certificationToRunNow, certificationFrequency, certificationStartDate, campaignDuration, undecidedAccess} = this.state;
        return (
            <Row className="align-items-center mt-20  step-row">
                <Col md={3} sm={12} xs={12}><b>Frequency</b></Col>
                <Col md={7} sm={12} xs={12} className="mt-10 pr-5">
                    <Select disabled={certificationForOneTime} value={certificationFrequency}
                            onChange={(value) => this.onChange({target: {name: 'certificationFrequency', value}})}
                            style={{width: "100%"}}>
                        {
                            frequencyData.map((x) => (<Option value={x.value}>{x.key}</Option>))
                        }
                    </Select>
                </Col>
                <Col md={2} sm={12} xs={12} className='pl-0'><Checkbox checked={certificationForOneTime} name="certificationForOneTime" onChange={this.onCheckBoxCheck}>One Time</Checkbox></Col>
                <Col md={3} sm={12} xs={12}><b>Start Date</b></Col>
                <Col md={7} sm={12} xs={12} className="mt-10 pr-5">
                    <DatePicker disabled={certificationToRunNow} value={certificationStartDate || null} className="w-100-p"
                                onChange={(date, dateString) => this.onDatePickerChange(date, dateString, 'certificationStartDate')}/>
                </Col>
                <Col md={2} sm={12} xs={12} className='pl-0'>
                    <Checkbox checked={certificationToRunNow} name="certificationToRunNow" onChange={this.onCheckBoxCheck}>
                        Run Now
                    </Checkbox>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Campaign Duration</b></Col>
                <Col md={7} sm={12} xs={12} className="mt-10 pr-5">
                    <InputNumber name="campaignDuration" value={campaignDuration}
                                 onChange={(value) => this.onChange({target: {name: 'campaignDuration', value: value}})}
                                 className="w-100-p"/>
                </Col>
                <Col md={1} sm={12} xs={12} className="mt-10 pl-0">
                    <span>Days</span>
                </Col>

                <Col md={3} sm={12} xs={12}>
                    <b>Undecided Access</b>
                </Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Radio.Group name="undecidedAccess" value={undecidedAccess} onChange={this.onChange}>
                        <Radio value={'Maintain access to undecided items'}>Maintain access to undecided items</Radio>
                        <Radio value={'Revoke access to undecided items'}>Revoke access to undecided items</Radio>
                    </Radio.Group>
                </Col>
            </Row>
        )
    }

    addIncludedApps = () => {
        const {selectedApp, includedAppsData} = this.state;
        if (selectedApp) {
            const data = {AppName: selectedApp, AppOwner: 'AppOwner', IsAppOwner: false, certifier: ''};
            includedAppsData.push(data)
        }
        this.setState({
            includedAppsData,
            selectedApp: ''
        });
    }

    removeIncludedApps = (index) => {
        const {includedAppsData} = this.state;
        this.setState({
            includedAppsData: includedAppsData.filter((x, i) => i !== index)
        });
    }

    onIncludeAppChange = (index, name, value) => {
        const {includedAppsData} = this.state;
        includedAppsData[index][name] = value;
        if (name === 'IsAppOwner' && value) {
            includedAppsData[index]['certifier'] = '';
        }
        this.setState({
            includedAppsData,
        });
    }

    thirdStep = () => {
        const {selectedApp, includedAppsOptions, includedAppsData} = this.state;
        const includedAppsOptionList = includedAppsOptions.filter(x => {
            return includedAppsData.find(y => y.AppName === x) ? false : true;
        })
        const columns = [
            {
                title: "App Name",
                dataIndex: 'AppName',
                width: '20%'
            },
            {
                title: "App Owner",
                dataIndex: 'AppOwner',
                width: '20%'
            },
            {
                title: "Certifier",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Input value={record.certifier} disabled={record.IsAppOwner}
                               onChange={(event) => this.onIncludeAppChange(index, 'certifier', event.target.value)}
                               name="certOwner"
                               addonAfter={<Icon type="search" onClick={() => this.toggleCertifierModal(index)}/>}/>
                    )
                }
            },
            {
                title: "Is App Owner",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Checkbox name="IsAppOwner" checked={record.IsAppOwner}
                                  onChange={(event) => this.onIncludeAppChange(index, 'IsAppOwner', event.target.checked)}/>
                    )
                }
            },
            {
                title: "Action",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Icon type="delete" onClick={() => this.removeIncludedApps(index)}/>
                    )
                }
            },
        ]

        return (
            <Row className="align-items-center mt-20 step-row">
                <Col md={3} sm={12} xs={12}><b>Included Apps</b></Col>
                <Col md={7} sm={12} xs={12}>
                    <Select name="selectedApp"
                            style={{width: "100%"}}
                            value={selectedApp}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            showSearch
                            onChange={(value) => this.onChange({
                                target: {
                                    name: 'selectedApp',
                                    value
                                }
                            })}>
                        {
                            includedAppsOptionList.map(x => <Option
                                value={x}>{x}</Option>)
                        }
                    </Select>
                </Col>
                <Col md={2} sm={12} xs={12}>
                    <Button className="mb-0" type="primary" onClick={this.addIncludedApps}>
                        Add</Button>
                </Col>
                <Col md={12} sm={12} xs={12} className="mt-20">
                    <Table size="small" columns={columns} dataSource={includedAppsData}/>
                </Col>
            </Row>
        )
    }

    fourthStep = () => {
        const {reminderFrequencies = [], SendReminderEmailReviewers, reminderFrequencyOption} = this.state;
        const length = reminderFrequencies.length;
        const reminderFrequencyOptions = reminderFrequencies.find(x => x.frequency === 'Every') ? reminderFrequencyOption.filter(x => x !== 'Every') : reminderFrequencyOption;
        return (
            <Row className="mt-20 align-items-center  step-row">
                <Col md={12} sm={12} xs={12} className="mt-10">
                    <Checkbox>Send Welcome Email to Reviewers</Checkbox>
                </Col>
                <Col md={12} sm={12} xs={12} className="mt-10">
                    <Checkbox checked={SendReminderEmailReviewers} name="SendReminderEmailReviewers"
                              onChange={this.onCheckBoxCheck}>Send Reminder email to Reviewers</Checkbox>
                </Col>
                {
                    SendReminderEmailReviewers ?
                        <Col md={12} sm={12} xs={12} className="mt-10 ml-25">
                            <Checkbox>cc Reminder email to Reviewer manager</Checkbox>
                        </Col> : null
                }
                <Col md={2} sm={12} xs={12} className="mt-10"><b>Reminder Frequency</b></Col>
                <Col md={10} sm={12} xs={12} className="mt-10">
                    {reminderFrequencies.map((reminderFrequency, index) => {
                        return (
                            <Row key={index}>
                                <Col md={5} className="mt-10">
                                    <Select className="w-100-p" name="frequency" value={reminderFrequency.frequency}
                                            onChange={(value) => this.selectChange({
                                                target: {
                                                    name: 'frequency',
                                                    value,
                                                    index
                                                }
                                            })}>
                                        {
                                            reminderFrequencyOptions.map(x => <Option
                                                value={x}>{x}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col md={5} className="mt-10">
                                    <InputNumber name="days" className="w-80-p" value={reminderFrequency.days}
                                                 onChange={(value) => this.selectChange({
                                                     target: {
                                                         name: 'days',
                                                         value,
                                                         index
                                                     }
                                                 })}/> {' '}Days
                                </Col>
                                <Col md={2} className="mt-10">
                                    {index > 0 &&
                                    <Icon type="delete" className="fs-18 mr-10"
                                          onClick={() => this.onDeleteFrequency(index)}
                                          theme="twoTone"/>}
                                    {length - 1 === index ?
                                        <Icon type="plus-circle" className="fs-18" onClick={this.onAddFrequency}
                                              theme="twoTone"/> : null}
                                </Col>
                            </Row>
                        )
                    })}
                </Col>
            </Row>
        )
    }

    onCertOwnerSelect = (data) => {
        this.setState({
            certOwner: `${data.firstName} ${data.lastName} ${data.userID} `,
            isUserSearchModal: false,
        });
    }

    toggleUserSearchModal = () => {
        this.setState({
            isUserSearchModal: !this.state.isUserSearchModal
        });
    }

    userSearchModal = () => {
        const {isUserSearchModal} = this.state;
        return (
            <UserSearchModal visible={isUserSearchModal} onHide={this.toggleUserSearchModal}
                             onSelect={this.onCertOwnerSelect}/>
        )
    }

    onCertifierSelect = (data) => {
        const {certifierIndex, includedAppsData} = this.state;
        includedAppsData[certifierIndex]['certifier'] = `${data.firstName} ${data.lastName}`;
        this.setState({
            includedAppsData,
            isCertifierSearchModal: false,
            certifierIndex: '',
        });
    }

    toggleCertifierModal = (index) => {
        this.setState({
            isCertifierSearchModal: !this.state.isCertifierSearchModal,
            certifierIndex: index
        });
    }

    cetifierSearchModal = () => {
        const {isCertifierSearchModal} = this.state;
        return isCertifierSearchModal ?
            <UserSearchModal visible={isCertifierSearchModal} onHide={this.toggleCertifierModal}
                             onSelect={this.onCertifierSelect}/> : null;
    }

    render() {
        const {current} = this.state;
        return (
            <Container className="dashboard">
                {this.userSearchModal()}
                {this.cetifierSearchModal()}
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="3" sm="12">
                                        <Steps direction="vertical" size="small" current={current}>
                                            <Step title="Basic Definition"/>
                                            <Step title="Campaign Schedule"/>
                                            <Step title="Campaign Scope"/>
                                            <Step title="Campaign Notification"/>
                                        </Steps>
                                    </Col>
                                    <Col md="9" sm="12">
                                        {current === 0 && <>{this.firstStep()}</>}
                                        {current === 1 && <>{this.firstStep()}{this.secondStep()}</>}
                                        {current === 2 && <>{this.firstStep()}{this.secondStep()}{this.thirdStep()}</>}
                                        {current === 3 && <>{this.firstStep()}{this.secondStep()}{this.thirdStep()}{this.fourthStep()}</>}
                                    </Col>
                                </Row>
                                <div className="mt-20">
                                    {current >= -1 && current < 3 &&
                                    <Button className="float-right" type="primary" onClick={() => this.next()}>
                                        Next
                                    </Button>
                                    }
                                    {
                                        current === 3 &&
                                        <>
                                            <Button type="primary float-right">Save as Draft</Button>
                                            <Button type="primary float-right" className="mr-5" onClick={this.onCreateCampaigns}>Submit / Create</Button>
                                        </>
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AppOwner
