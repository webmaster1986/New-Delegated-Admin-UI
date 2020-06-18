import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row,} from "reactstrap";
import {Icon, Select, Button, Input,  Spin, Table, Switch, message} from "antd";
import CKEditor from "react-ckeditor-component";
import '../Home/Home.scss';

const {TextArea} = Input;
const {Option} = Select;
import {ApiService} from "../../services/ApiService";

class EmailTemplates extends Component {
    _apiService = new ApiService();
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isSaving: false,
            isLoading: false,
            emailTemplateList: []
        };
        this.updateContent = this.updateContent.bind(this);
    }

    componentDidMount() {
        this.getAllTemplates()
    }

    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

    onChange = (evt) => {
        const {selectedRecord} = this.state;
        selectedRecord.body = evt.editor.getData();
        this.setState({
            selectedRecord
        })
    }

    onBlur = (evt) => {
        console.log("onBlur event called with event info: ", evt);
    }

    afterPaste = (evt) => {
        console.log("afterPaste event called with event info: ", evt);
    }

    onChangeSwitch = (checked) => {
        const {selectedRecord} = this.state;
        selectedRecord.config.status = checked ? 'ON' : 'OFF';
        this.setState({
            selectedRecord
        });
    }

    getAllTemplates = async () => {
        this.setState({
            isLoading: true,
        });
        const data = await this._apiService.getAllTemplates()
        if(!data || data.error){
            this.setState({
                isLoading: false,
            });
            return message.error('Something is wrong! Please try again.')
        }else {
           this.setState({
               emailTemplateList: data.templates,
               isLoading: false,
           })
        }
    }

    onEdit = (data, key) => {
        if(key){
            this.setState({
                selectedRecord: {
                    config: {
                        category: "",
                        templateName: "",
                        description: "",
                        prefferedLanguage: "",
                        status: "",
                        encoding: "",
                        fromAddress: "",
                        emailSubject: "",
                        condition: ""
                    },
                    body: ""
                },
                isEdit: true,
            })
        } else {
            this.setState({
                isEdit: true,
                selectedRecord: data
            })
        }
    }

    onCancel = () => {
        this.setState({
            isEdit: false,
            selectedRecord: {}

        })
    }

    onRecordChange = (event) => {
        const {selectedRecord} = this.state;
        selectedRecord.config[event.target.name] = event.target.value;
        this.setState({
            selectedRecord
        });
    }

    onSubmitEmail = async () => {
        const {selectedRecord} = this.state;
        this.setState({
            isSaving: true
        });
        const payload = {
            ...selectedRecord,
            templateName: selectedRecord.config.templateName,
            category: selectedRecord.config.category,
        };
        const data = await ApiService.createEmailStoreTemplate(payload)
        if(!data || data.error){
            this.setState({
                isSaving: false
            });
            return message.error('Something is wrong! Please try again.')
        } else {
            this.setState({
                isSaving: false,
                isEdit: false,
            });
            message.success('Email store template create successfully');
            this.getAllTemplates();
        }
    }

    emailTemplate = () => {
        const {selectedRecord, isSaving,} = this.state;
        return (
            <>
                <p>An end user is notified that an asministrator created an account for the end
                    user. The notification contains a link that the end user click to active the
                    account.</p>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Template Name</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.templateName} name={'templateName'}
                               onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>category</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.category} name={'category'} onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Description</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.description} name={'description'}
                               onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Language</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Select value={selectedRecord.config.prefferedLanguage}
                                showSearch
                                style={{width: '100%'}}
                                onChange={(value) => this.onRecordChange({target: {name: 'prefferedLanguage', value}})}
                        >
                            <Option value="English">English</Option>
                            <Option value="French">French</Option>
                            <Option value="German">German</Option>
                            <Option value="Japanese">Japanese</Option>
                            <Option value="Chinese">Chinese</Option>
                        </Select>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Encoding</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.encoding} name={'encoding'} onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>From Email</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.fromAddress} name={'fromAddress'}
                               onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Subject</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <TextArea value={selectedRecord.config.emailSubject} style={{width: '100%'}}
                                  name={'emailSubject'} onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Condition</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Input value={selectedRecord.config.condition} style={{width: '100%'}} name={'condition'}
                               onChange={this.onRecordChange}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={1} className="pr-0">
                        <span><b>Status</b></span>
                    </Col>
                    <Col md={6} className="pl-0">
                        <Switch onChange={this.onChangeSwitch} defaultChecked
                                checkedChildren={selectedRecord.config.status}
                                unCheckedChildren={selectedRecord.config.status}/>
                    </Col>
                </Row>
                <Row className="mt-10">
                    <Col md={12}>
                        <CKEditor
                            activeClass="p10"
                            content={selectedRecord.body}
                            events={{
                                "blur": this.onBlur,
                                "afterPaste": this.afterPaste,
                                "change": this.onChange
                            }}
                        />
                    </Col>
                </Row>
                <div className='pull-right mt-10'>
                    <Button className="mr-10" onClick={this.onCancel}>Cancel</Button>
                    <Button type='primary' onClick={this.onSubmitEmail}>{isSaving ? <Spin/> :"Save"}</Button>
                </div>
            </>
        )
    }

    mainTable = () => {
        const {isLoading, emailTemplateList} = this.state;
        const mainColumns = [
            {
                title: '',
                render: (record) => {
                    return (
                        <div className="tab-area">
                            <span className='cursor-pointer' onClick={() => this.onEdit(record)}>
                            <div><h4 className="mb-0">{record.config.templateName}</h4></div>
                            <div>{record.config.description}</div>
                            <div><b>Category</b>: {record.config.category}</div>
                            </span>
                        </div>
                    );
                }
            },
            {
                render: (record) => {
                    return <div className="text-center"><a onClick={() => this.onEdit(record)}><img
                      src={require('../../images/edit.png')} style={{width: 18}}/></a>
                    </div>;
                }
            }
        ];
        {
            return isLoading ? <Spin className="mt-50 custom-loading"/> :
                <div>
                    <Table
                        columns={mainColumns}
                        size="small"
                        className="main-table"
                        showHeader={false}
                        dataSource={emailTemplateList}
                    />
                </div>
        }
    }

    render() {
        const {isEdit, isLoading} = this.state;
        return (
            <Container className="dashboard">
                <Card>
                    <CardHeader className='custom-card-header'>
                        <Row className="main-div">
                            <Col md={10} sm={12} xs={12}>
                                <Col md={6} sm={12} xs={12} className="d-flex">
                                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/email.png")} style={{width: 40}}/></a></span>
                                    <h4 className="mt-10">Email Templates</h4>
                                </Col>
                            </Col>
                            <Col md={2} sm={12} xs={12} className="text-right">
                                { !isEdit && <Button className="square" size={"large"} color="primary" onClick={() => this.onEdit({}, 'addNewRecord')}><a><img src={require("../../images/plus-symbol.png")} style={{width: 18}}/></a>&nbsp;Add Email Template</Button>}
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        {
                            isLoading ? <Spin className='mt-50 mb-50 custom-loading'/> :
                                <>
                                    <Row>
                                        <Col md={12} sm={12} xs={12}>
                                            {
                                                isEdit ?
                                                    <>
                                            <span className="fs-18 text-primary cursor-pointer" onClick={this.onCancel}>
                                                <Icon type="arrow-left"/>
                                            </span>
                                                        {this.emailTemplate()}
                                                    </> : this.mainTable()

                                            }
                                        </Col>
                                    </Row>
                                </>
                        }

                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default EmailTemplates
