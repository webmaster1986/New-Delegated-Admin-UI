import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, } from "reactstrap";
import {withRouter} from 'react-router-dom'
import {Input, Icon, Select, Table, Popconfirm, message, Tabs, Button} from 'antd';
import CardHeader from "reactstrap/es/CardHeader";
import {ApiService} from "../../services";
const {Option} = Select;
const { TabPane } = Tabs;

class MappingApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: props.match.params.id,
            clientId: props.match.params.clientId,
            isMapping: false,
            sysColumns: ['FN', 'LN', 'AN', 'DESC'],
            SourceAttribute: '',
            TargetAttribute: '',
            DefaultValue: '',
            mapping: [],
            scimAttributes: [],
            provisioning: [],
            reconcilliation: [],
            editIndex: -1,
            extractDate: '',
            MappingType: 'Direct',
            activeKey: 'Provisioning'
        };

    }

    toggleMapping = () => {
        this.setState({
            isMapping: true,
        })
    }

    componentDidMount() {
        this.getRegisterApplication()
        this.getMappedSchema()
    }

    getRegisterApplication = async () => {
        this.setState({
            isLoading: true
        });
        const data = await ApiService.getRegisterApplication();
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                scimAttributes: data.scimAttributes
            })
        }
    }

    getMappedSchema = async () => {
        const {appId} = this.state
        this.setState({
            isLoading: true
        });
        const data = await ApiService.getMappedSchema(appId);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            const provisioning = [];
            const reconcilliation = []
            const provisioningAttribute = (data && data.provisioningAttrMap && data.provisioningAttrMap.scimTargetMap ) || {};
            const reconcilliationAttribute = (data && data.reconcilliationAttrMap && data.reconcilliationAttrMap.scimTargetMap ) || {};
                Object.keys(provisioningAttribute).map((x) =>{
                    const obj = {SourceAttribute: data.provisioningAttrMap.scimTargetMap[x].variable, TargetAttribute: x,}
                    provisioning.push(obj)
            })
            Object.keys(reconcilliationAttribute).map((x) =>{
                    const obj = {TargetAttribute:  data.reconcilliationAttrMap.scimTargetMap[x].variable, SourceAttribute: x    ,}
                    reconcilliation.push(obj)
            })
            this.setState({
                isLoading: false,
                provisioning,
                reconcilliation
            })
        }
    }

    onAddMapping = () => {
        const {SourceAttribute, TargetAttribute, DefaultValue, mapping, editIndex, sysColumns, activeKey, reconcilliation, } = this.state;
        let {provisioning} = this.state;
        const obj = {SourceAttribute: SourceAttribute, DefaultValue: DefaultValue , TargetAttribute: TargetAttribute};
        if (editIndex > -1) {
            if(activeKey === 'Provisioning'){
                provisioning[editIndex] = obj;
                this.setState({
                    provisioning
                })
            } else {
                reconcilliation[editIndex] = obj
                this.setState({
                    reconcilliation
                })
            }
        } else {
           if(activeKey === 'Provisioning'){
               provisioning.push(obj)
               this.setState({
                   provisioning
               })
           } else {
               reconcilliation.push(obj)
               this.setState({
                   reconcilliation
               })
           }
        }
        this.setState({
            mapping,
            sysColumns,
            SourceAttribute: '',
            TargetAttribute: '',
            DefaultValue: '',
            editIndex: -1,
            custom: ''
        });
    }

    onDeleteRecord = (index) => {
        const {reconcilliation, provisioning, activeKey} = this.state;
        if(activeKey === 'Provisioning'){
            this.setState({
                provisioning: provisioning.filter((x, i) => i !== index),
            });
        } else {
            this.setState({
                reconcilliation: reconcilliation.filter((x, i) => i !== index)
            });
        }

    }

    onDiscard = () => {
        this.setState({
            SourceAttribute: '',
            TargetAttribute: '',
            DefaultValue: '',
            editIndex: -1,
            custom: ''
        });
    }

    onEditRecord = (record, index) => {
        const {SourceAttribute, TargetAttribute, DefaultValue} = record;
        this.setState({
            editIndex: index,
            SourceAttribute,
            TargetAttribute,
            DefaultValue,
        });
    }

    onChange = (e,) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    provisioningColumns = () => {
        return [
            {
                title: 'Source Attribute',
                render: (record) => {
                    return <span>{record.SourceAttribute}</span>
                }
            },
            {
                title: 'Target Attribute',
                render: (record) => {
                    return <span>{record.TargetAttribute}</span>
                }
            },
            {
                title: 'Default Value',
                render: (record) => {
                    return <span>{record && record.DefaultValue}</span>
                }
            },
            {
                title: 'Action',
                render: (record, fn, index) => {
                    return <div>
                    <span className="mr-5 cursor-pointer" onClick={() => this.onEditRecord(record, index)}><Icon type="edit" className="fs-16"/></span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.onDeleteRecord(index)}>
                            <Icon type="delete" className="fs-16"/>
                        </Popconfirm>
                    </div>
                }
            },

        ];
    }

    reconcilliationColumns = () => {
        return [
            {
                title: 'Target Attribute',
                render: (record) => {
                    return <span>{record.TargetAttribute}</span>
                }
            },
            {
                title: 'Source Attribute',
                render: (record) => {
                    return <span>{record.SourceAttribute}</span>
                }
            },
            {
                title: 'Default Value',
                render: (record) => {
                    return <span>{record && record.DefaultValue}</span>
                }
            },
            {
                title: 'Action',
                render: (record, fn, index) => {
                    return <div>
                        <span className="mr-5 cursor-pointer" onClick={() => this.onEditRecord(record, index)}><Icon type="edit" className="fs-16"/></span>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.onDeleteRecord(index)}>
                            <Icon type="delete" className="fs-16"/>
                        </Popconfirm>
                    </div>
                }
            },

        ];
    }

    onFileUpload = (data) => {
        if (data && data.length > 0) {
            this.setState({
                scimAttributes: data[0]
            });
        }
    }

    onDatePickerChange = (date, dateString, name) => {
        this.setState({
            [name]: date,
        })
    }

    onSave = async () => {
        const {reconcilliation, provisioning, appId} = this.state;
        let provisioningAttrMap = {};
        let reconcilliationAttrMap = {};
        provisioning.map((x) => {
            const obj = {[x.TargetAttribute]:{variable: x.SourceAttribute}}
            provisioningAttrMap = {...provisioningAttrMap, ...obj}
        })
        reconcilliation.map((x) => {
            const obj = {[x.SourceAttribute]:{variable: x.TargetAttribute}}
            reconcilliationAttrMap = {...reconcilliationAttrMap, ...obj}
        })
        const payload = {
            provisioningAttrMap,
            reconcilliationAttrMap
        }
        const data = await ApiService.schemaMapper(appId, payload)
        if (!data || data.error) {
            return message.error('something is wrong! please try again');
        } else {
        }

    }

    onCancel = () => {
        const {clientId} = this.state;
        this.props.history.push(`/${clientId}/admin/applist`)
    }

    onTabChange = (activeKey) => {
        this.setState({
            activeKey
        })
    }

    render() {
        const {mapping, DefaultValue, TargetAttribute, SourceAttribute, editIndex, MappingType, scimAttributes, reconcilliation, provisioning, activeKey} = this.state;
        const scimAttributesOptions = scimAttributes.filter(x => {
            return provisioning.find(y => y.SourceAttribute === x) ? false : true
        });
        const reconcilliationOption = scimAttributes.filter(x => {
            return provisioning.find(y => y.SourceAttribute === x) ? false : true
        });
        const disabled = (TargetAttribute.trim() && SourceAttribute.trim());
        const tabePan = () => {
            return(
                <Row>
                    <Col md={6} sm={12} xs={12}>
                        <Table className="mr-10"
                               columns={activeKey === 'Provisioning' ?  this.provisioningColumns() : this.reconcilliationColumns()}
                               size="small"
                               dataSource={activeKey === 'Provisioning' ? provisioning || [] : reconcilliation || []}
                        />
                    </Col>
                    <Col md={6} sm={12} xs={12} className="expand-header">
                        <h4>{editIndex > -1 ? 'Edit Attribute' : 'Add New Attribute'}</h4>
                        <Row>
                            <Col md={12} sm={12} xs={12} className="mt-15">
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Mapping Type</span>
                                        <div className="form__form-group-field">
                                            <Select name="MappingType" value={MappingType}
                                                    onChange={(value) => this.onChange({
                                                        target: {
                                                            name: 'MappingType',
                                                            value
                                                        }
                                                    })}>
                                                <option value="Direct">Direct</option>
                                            </Select>
                                        </div>
                                    </div>
                                    {
                                        activeKey === "Provisioning" ?
                                            <>
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Source Attribute</span>
                                                    <div className="form__form-group-field">
                                                        <Select name="SourceAttribute" value={SourceAttribute}
                                                                onChange={(value) => this.onChange({
                                                                    target: {
                                                                        name: 'SourceAttribute',
                                                                        value
                                                                    }
                                                                })}>
                                                            {
                                                                scimAttributesOptions.map(x => <Option
                                                                    value={x}>{x}</Option>)
                                                            }
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Target Attribute</span>
                                                    <div className="form__form-group-field">
                                                        <Input name="TargetAttribute" value={TargetAttribute} onChange={this.onChange}/>
                                                    </div>
                                                </div>
                                        </> : <>
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Target Attribute</span>
                                                    <div className="form__form-group-field">
                                                        <Input name="TargetAttribute" value={TargetAttribute} onChange={this.onChange}/>
                                                    </div>
                                                </div>
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Source Attribute</span>
                                                    <div className="form__form-group-field">
                                                        <Select name="SourceAttribute" value={SourceAttribute}
                                                                onChange={(value) => this.onChange({
                                                                    target: {
                                                                        name: 'SourceAttribute',
                                                                        value
                                                                    }
                                                                })}>
                                                            {
                                                                reconcilliationOption.map(x => <Option
                                                                    value={x}>{x}</Option>)
                                                            }
                                                        </Select>
                                                    </div>
                                                </div>

                                            </>
                                    }

                                    <div className="form__form-group">
                                                    <span
                                                        className="form__form-group-label">Default value ( optional )</span>
                                        <div className="form__form-group-field">
                                            <Input name="DefaultValue" value={DefaultValue} onChange={this.onChange}/>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className=" float-right ml-10 mr-0" onClick={this.onDiscard}>Discard</Button>
                                <Button className=" float-right "
                                        disabled={!disabled} onClick={this.onAddMapping} type="primary">{editIndex > -1 ? 'Update' : 'Add'}</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )
        }
        return (
            <Container className="dashboard application-manage">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/website (1).png")}
                                            style={{width: 40}}/></a></span>
                                <h4 className="mt-10">Attribute Mapping</h4>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <Tabs defaultActiveKey={activeKey} onChange={this.onTabChange}>
                                    <TabPane tab="Provisioning" key="Provisioning">
                                        {tabePan()}
                                    </TabPane>
                                    <TabPane tab="Reconcilliation" key="Reconcilliation">
                                        {tabePan()}
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <div>
                                    <Button type="primary" className="mr-10" onClick={this.onSave}>Save</Button>
                                    <Button className="mr-10" onClick={this.onCancel}>Cancel</Button>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default withRouter(MappingApplication)
