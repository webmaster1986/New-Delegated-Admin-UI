import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, Button} from "reactstrap";
import {Input, DatePicker, Icon, Select, Table, Popconfirm} from 'antd';
import CSVReader from "react-csv-reader";
const {TextArea} = Input;

const {Option} = Select;

class NewUser extends Component {
  constructor(props) {
    super(props);
    const newState = {};
    if (props.location.pathname === '/admin/user/edit') {
      newState.isMapping = true;
      newState.isEdit = true;
      newState.userMapping = [
        {
          CSVAttribute: 'First Name',
          SystemAttribute: 'FN',
          IsEntitlement: 'Yes',
        },
        {
          CSVAttribute: 'Last Name',
          SystemAttribute: 'LN',
          IsEntitlement: 'No',
        }
      ];
    }
    if (props.location.pathname === '/admin/user/upload') {
      newState.isMapping = false;
      newState.isUpload = true;
      newState.FileName = 'test file'
      newState.Description = 'Description file name'
    }
    if (props.location.pathname === '/admin/user/new') {
      newState.isMapping = false;
      newState.isNew = true;
    }
    this.state = {
      isMapping: false,
      csvColumns: ['First Name', 'Last Name', 'App Name', 'Description'],
      sysColumns: ['FN', 'LN', 'AN', 'DESC'],
      CSVAttribute: '',
      SystemAttribute: '',
      IsEntitlement: '',
      userMapping: [],
      editIndex: -1,
      extractDate: '',
      ...newState
    };
    
  }
  
  toggleMapping = () => {
    this.setState({
      isMapping: true,
    })
  }
  
  onAddMapping = () => {
    const {CSVAttribute, SystemAttribute, IsEntitlement, userMapping, editIndex, sysColumns, custom} = this.state;
    const data = {CSVAttribute, SystemAttribute, IsEntitlement};
    if (SystemAttribute === 'custom') {
      data.SystemAttribute = custom;
      sysColumns.push(custom);
    }
    if (editIndex > -1) {
      userMapping[editIndex] = data;
    } else {
      userMapping.push(data);
    }
    this.setState({
      userMapping,
      CSVAttribute: '',
      SystemAttribute: '',
      IsEntitlement: '',
      editIndex: -1,
      custom: '',
    });
  }
  
  onDeleteRecord = (index) => {
    const {userMapping} = this.state;
    this.setState({
      userMapping: userMapping.filter((x, i) => i !== index)
    });
  }
  
  onDiscard = () => {
    this.setState({
      CSVAttribute: '',
      SystemAttribute: '',
      IsEntitlement: '',
      editIndex: -1,
      custom: ''
    });
  }
  
  onEditRecord = (record, index) => {
    const {CSVAttribute, SystemAttribute, IsEntitlement} = record;
    this.setState({
      CSVAttribute,
      SystemAttribute,
      IsEntitlement,
      editIndex: index,
    });
  }
  
  onChange = (e,) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  applicationColumns = () => {
    return [
      {
        title: 'CSV Attribute',
        dataIndex: 'CSVAttribute'
      },
      {
        title: 'System Attribute',
        dataIndex: 'SystemAttribute',
      },
      {
        title: 'IsEntitlement',
        dataIndex: 'IsEntitlement',
      },
      {
        title: 'Action',
        render: (record, fn, index) => {
          return <div>
            <span className="mr-5 cursor-pointer" onClick={() => this.onEditRecord(record, index)}><Icon type="edit"
                                                                                                         className="fs-16"/></span>
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
        csvColumns: data[0]
      });
    }
  }
  
  onDatePickerChange = (date, dateString, name) => {
    this.setState({
      [name]: date,
    })
  }
  
  render() {
    const {
      isMapping, userMapping, csvColumns, sysColumns, IsEntitlement, isEdit, Description, FileName,
      SystemAttribute, CSVAttribute, editIndex, isUpload, custom, extractDate
    } = this.state;
    const csvOptionns = csvColumns.filter(x => {
      return userMapping.find(y => y.CSVAttribute === x) ? false : true
    });
    const sysOptionns = sysColumns.filter(x => {
      return userMapping.find(y => y.SystemAttribute === x) ? false : true
    });
    const disabled = (SystemAttribute.trim() && CSVAttribute.trim() && IsEntitlement.trim());
    return (
      <Container className="dashboard">
        {
          !isEdit &&
          <Row className="mt-30">
            <Col md={12} sm={12} xs={12}>
              <Card>
                <CardBody>
                  <h4>User</h4>
                  <Row className="align-items-center">
                    <Col md={3} sm={12} xs={12}><span><b>File Name</b></span></Col>
                    <Col md={9} sm={12} xs={12} className="mt-10">
                      <Input type="text" value={FileName} disabled={isUpload}/>
                    </Col>
                    <Col md={3} sm={12} xs={12}><span><b>Description</b></span></Col>
                    <Col md={9} sm={12} xs={12} className="mt-10">
                      <TextArea type="text" value={Description} disabled={isUpload}/>
                    </Col>
                    <Col md={3} sm={12} xs={12}><span><b>Browse/Upload</b></span></Col>
                    <Col md={9} sm={12} xs={12} className="mt-10">
                      <CSVReader
                        cssClass="react-csv-input"
                        label=""
                        onFileLoaded={this.onFileUpload}
                      />
                    </Col>
                    <Col md={3} sm={12}
                         xs={12}><span><b>Single Value Attribute Delimiter</b></span></Col>
                    <Col md={9} sm={12} xs={12} className="mt-10">
                      <Input type="text"/>
                    </Col>
                    <Col md={3} sm={12}
                         xs={12}><span><b>Multi Value Attribute Delimiter</b></span></Col>
                    <Col md={9} sm={12} xs={12} className="mt-10">
                      <Input type="text"/>
                    </Col>
                    <Col md={3} sm={12}
                         xs={12}><span><b>Extract Date</b></span></Col>
                    <Col md={9} sm={12} className="mt-10">
                      <DatePicker value={extractDate || null} className="w-100-p"
                                  onChange={(date, dateString) => this.onDatePickerChange(date, dateString, 'extractDate')}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center mt-10">
                      <Button className="icon square" size={"sm"} color="primary"
                              onClick={this.toggleMapping}><p>Save &
                        Continue</p></Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        }
        
        {
          isMapping ?
            <Row className="mt-30">
              <Col md={12} sm={12} xs={12}>
                <Card>
                  <CardBody>
                    <h4>User Mapping</h4>
                    <Row>
                      <Col md={6} sm={12} xs={12}>
                        <Table className="mr-10"
                               columns={this.applicationColumns()}
                               size="small"
                               dataSource={userMapping}
                        />
                      </Col>
                      <Col md={6} sm={12} xs={12}>
                        <Row>
                          <Col>
                            <form className="form">
                              <div className="form__form-group">
                                <span className="form__form-group-label"><b>CSV Attribute</b></span>
                                <div className="form__form-group-field">
                                  <Select name="CSVAttribute" value={CSVAttribute}
                                          onChange={(value) => this.onChange({
                                            target: {
                                              name: 'CSVAttribute',
                                              value
                                            }
                                          })}>
                                    {
                                      csvOptionns.map(x => <Option
                                        value={x}>{x}</Option>)
                                    }
                                  </Select>
                                </div>
                              </div>
                              <div className="form__form-group">
                                                    <span
                                                      className="form__form-group-label"><b>System Attribute</b></span>
                                <div className="form__form-group-field">
                                  <Select name="SystemAttribute"
                                          value={SystemAttribute}
                                          onChange={(value) => this.onChange({
                                            target: {
                                              name: 'SystemAttribute',
                                              value
                                            }
                                          })}>
                                    <Option value="custom">
                                      <Icon type="add"/> Add custom field
                                    </Option>
                                    {
                                      sysOptionns.map(x => <Option
                                        value={x}>{x}</Option>)
                                    }
                                  </Select>
                                </div>
                                {SystemAttribute === 'custom' &&
                                <div>
                                                                    <span
                                                                      className="form__form-group-label"><b>Field Name:</b></span>
                                  <Input name="custom" value={custom} onChange={this.onChange}/>
                                </div>
                                }
                              </div>
                              <div className="form__form-group">
                                                    <span
                                                      className="form__form-group-label"><b>Is Entitlement</b></span>
                                <div className="form__form-group-field">
                                  <Select name="IsEntitlement"
                                          value={IsEntitlement}
                                          onChange={(value) => this.onChange({
                                            target: {
                                              name: 'IsEntitlement',
                                              value
                                            }
                                          })}>
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                  </Select>
                                </div>
                              </div>
                            </form>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button className=" square float-right ml-10 mr-0" onClick={this.onDiscard} size={"sm"}
                                    color="primary"><p>Discard</p></Button>
                            <Button className=" square float-right "
                                    disabled={!disabled} onClick={this.onAddMapping} size={"sm"} color="primary">
                              <p>{ editIndex > -1 ? 'Update' : 'Add' }</p></Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col className="text-center mt-10">
                <Button className="icon square" size={"sm"} color="primary"><p>Submit</p></Button>
              </Col>
            </Row> : null
        }
      
      </Container>
    )
  }
}

export default NewUser