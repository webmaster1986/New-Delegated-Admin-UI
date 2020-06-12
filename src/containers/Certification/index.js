import React, {Component} from 'react';
import moment from 'moment'
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import {Select, Icon, Table, Progress, Modal, Drawer, Checkbox, Slider, Input, message, Spin, Button, Tooltip} from 'antd';
const {TextArea} = Input;
const {Option} = Select;
import '../Home/Home.scss';
import {ApiService, getUserName} from "../../services/ApiService";
import CardHeader from "reactstrap/es/CardHeader";
import CustomHeader from "../Layout/CustomHeader";

const pieData = {
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
    ],
    borderColor: 'rgba(255,255,255,0.54)',
  }],
  labels: [
    'Active',
    'Expired',
    'Completed',
  ],
  width:100,
  height:100,
};

const legendOpts = {
  onClick: (e, item) => (item),
  position: 'right',
};

const statusType = {
  SIGN_OFF: 'SIGNEDOFF',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
}

class Certification extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      clientId: this.props.match.params.clientId,
      legend: legendOpts,
      activeTab: '1',
      isModal: false,
      isDrawer: false,
      isLoading: false,
      isInfoDrawer: false,
      isChecked: false,
      certificationsList: [],
      name: '',
      certOwner: '',
      status: '',
      tempData: [],
      selectedCertificates: [],
      statistics : [
        {
          "name": "0-7 Days",
          "uv": 4000,
          "pv": 2400,
          "amt": 2400
        },
        {
          "name": "7-14 Days",
          "uv": 3000,
          "pv": 1398,
          "amt": 2210
        },
        {
          "name": "14-21 Days",
          "uv": 2000,
          "pv": 9800,
          "amt": 2290
        },
      ],
      statusFilter: statusType.ACTIVE,
      signedOffList: []
    };
    this.applyLegendSettings = this.applyLegendSettings.bind(this);
  }

  componentDidMount() {
    this.getCertifications()
  }

  applyLegendSettings() {
    const {value} = this.legendOptsInput;
    try {
      const opts = JSON.parse(value);
      this.setState({
        legend: opts,
      });
    } catch (e) {
      alert(e.message);
      throw Error(e);
    }
  }

  toggle = (tab) => {
    const {activeTab} = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  showModal = () => {
    this.setState({
      isModal: true,
    });
  };

  handleCancel = () => {
    this.setState({
      isModal: false,
    });
  };

  showDrawer = () => {
    this.setState({
      isDrawer: true,
    });
  };

  showInfoDrawer = () => {
    this.setState({
      isInfoDrawer: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawer: false,
    });
  };

  onCloseInfoDrawer = () => {
    this.setState({
      isInfoDrawer: false,
    });
  };

  formatter = (value) => {
    return `${value}%`;
  }

  drawer = () => {
    return (
      <Drawer
        title={'Smart Suggestions Parameters'}
        width={400}
        onClose={this.onClose}
        visible={this.state.isDrawer}
        placement={'left'}
      >
        <Row>
          <Col md={7}>
            <div className='w-100-p text-center'><span><b>Last Login</b></span></div>
          </Col>
          <Col md={5}>
            <span><b>Click To Disable</b></span>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md={7} className="mt-10">
            <Slider marks={{0: '< 60 Days', 1: '< 180 Days', 2: '< 360 Days'}} tooltipVisible={false} defaultValue={0}
                    min={0} max={2}/>
          </Col>
          <Col md={5} className="mt-10">
            <Checkbox className='w-80-p text-center'/>
          </Col>
        </Row>
        <Row className="mt-40">
          <Col md={8}>
            <div className='w-100-p text-center'><span><b>Last Certification Decision</b></span></div>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md={7} className="mt-10">
            <Slider min={0} max={2} marks={{0: 'Certified', 1: 'Certified Conditionally', 2: 'Revoked',}}
                    tooltipVisible={false}/>
          </Col>
          <Col md={5} className="mt-10">
            <Checkbox className='w-80-p text-center'/>
          </Col>
        </Row>
        <Row className="mt-40">
          <Col md={8}>
            <div className='w-100-p text-center'><span><b>Entity Risk</b></span></div>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md={7} className="mt-10">
            <Slider min={0} max={2} marks={{0: 'Low', 1: 'Medium', 2: 'High'}} tooltipVisible={false}/>
          </Col>
          <Col md={5} className="mt-10">
            <Checkbox className='w-80-p text-center'/>
          </Col>
        </Row>
        <Row className="mt-40">
          <Col md={8}>
            <div className='w-100-p text-center'><span><b>Similar Access across Division</b></span></div>
          </Col>
        </Row>
        <Row className="align-items-center row-height">
          <Col md={7} className="mt-10">
            <Slider tipFormatter={this.formatter} tooltipVisible={this.state.isDrawer} marks={{0: '0 %', 100: '100%',}}
                    tooltipPlacement={"bottom"}/>
          </Col>
          <Col md={5} className="mt-10">
            <Checkbox className='w-80-p text-center'/>
          </Col>
        </Row>
        <Row>
          <Col className="w-100-p text-center">
            <Button className="square ml-15 mb-0" size={"small"} color="primary">Save</Button>
            <Button className="square mb-0" size={"small"}>Reset</Button>
          </Col>
        </Row>
      </Drawer>
    )
  }

  modal = () => {
    return (
      <Modal
        visible={this.state.isModal}
        onCancel={this.handleCancel}
        title="Comments"
        footer={null}
        width={410}
      >
        <Row>
          <Col md={12}>
                <TextArea
                  placeholder="Comments"
                  autosize={{minRows: 2, maxRows: 6}}
                />
          </Col>
        </Row>
      </Modal>
    )
  }

  infoDrawer = () => {
    return (
      <Drawer
        width={400}
        onClose={this.onCloseInfoDrawer}
        visible={this.state.isInfoDrawer}
        placement={'left'}
      >
        <Row>
          <Col md={4}><b>User Attribute:</b></Col>
          <Col md={6}><span>test</span></Col>
        </Row>
        <Row>
          <Col md={4}><b>User Dept:</b></Col>
          <Col md={6}><span>test</span></Col>
        </Row>
        <Row>
          <Col md={4}><b>User Manager:</b></Col>
          <Col md={6}><span>test</span></Col>
        </Row>
        <Row>
          <Col md={4}><b>User Role:</b></Col>
          <Col md={6}><span>Admin</span></Col>
        </Row>
      </Drawer>
    )

  }

  nestedTable = () => {
    const data = [
      {
        CampaignName: 'capaignName1',
        Description: 'capaign',
        CompletePercent: 30,
        CreatedDate: '01/01/2019',
        DueDate: '02/01/2019',
        CertOwner: 'Owner 1',
        Status: 'Active',
        SignOffDate: '03/01/2019',
        SmartSuggestion: 'Smart Suggestion',
      },
      {
        CampaignName: 'capaignName2',
        Description: 'capaign',
        CompletePercent: 40,
        CreatedDate: '01/01/2019',
        DueDate: '02/01/2019',
        CertOwner: 'Owner 2',
        Status: 'Active',
        SignOffDate: '03/01/2019',
        SmartSuggestion: 'Smart Suggestion',
      },
      {
        CampaignName: 'capaignName3',
        Description: 'capaign',
        CompletePercent: 80,
        CreatedDate: '01/01/2019',
        DueDate: '02/01/2019',
        CertOwner: 'Owner 3',
        Status: 'Active',
        SignOffDate: '03/01/2019',
        SmartSuggestion: 'Smart Suggestion',
      },
    ];
    const columns = [
      {
        title: 'Campaign Name',
        dataIndex: 'CampaignName'
      },
      {
        title: 'Description',
        dataIndex: 'Description',
      },
      {
        title: 'Complete Percent',
        render: (record) => {
          return <Progress type="circle" width={100} percent={record.CompletePercent || 0} />
        }
      },
      {
        title: 'Created Date',
        dataIndex: 'CreatedDate',
      },
      {
        title: 'Due Date',
        dataIndex: 'DueDate',
      },
      {
        title: 'Cert Owner',
        dataIndex: 'CertOwner',
      },
      {
        title: 'Status',
        dataIndex: 'Status',
      },
      {
        title: () => {
          return <div><span className="mr-5">Smart Suggestion</span> <Icon type="fullscreen" onClick={this.showDrawer}
                                                                           style={{color: '#005293'}}/></div>
        },
        dataIndex: 'SmartSuggestion',
      },
    ];
    return (
      <Table
        columns={columns}
        size="small"
        dataSource={data}
      />
    );
  }

  onClick = (id, record) => {
    const {clientId} = this.state;
    const path = record.reviewerCertificationInfo.certificationType === 'UserCertification'
        ? 'certification' : record.reviewerCertificationInfo.certificationType === 'RoleCertification'
            ? 'role-certification' : record.reviewerCertificationInfo.certificationType === "SelfCertification"
                ? "self-certification" : 'owner-certification'
    this.props.history.push(`/${clientId}/${path}/${id}`, record)
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      isFiltered: false,
    })
  }

  getCertifications = async (isRefresh) => {
    this.setState({
      isLoading: true,
      selectedCertificates: [],
    });
    const data = await this._apiService.getCertifications()
    if(!data || data.error){
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      let signedOffList = [];
      if (!isRefresh) {
        signedOffList = (data || []).filter(x => x.reviewerCertificationInfo && x.reviewerCertificationInfo.status === statusType.COMPLETED);
      }
      const certificationsList = (data || []).sort((a, b) => {
        return moment(a.reviewerCertificationInfo.certificationExpiration) > moment(b.reviewerCertificationInfo.certificationExpiration) ? -1 : 1;
      });
      this.setState({
        isLoading: false,
        signedOffList: signedOffList,
        certificationsList
      });
    }
  }

  onSubmitBulkAction = async (action) => {
    const {selectedCertificates, certificationsList} = this.state;
    if (selectedCertificates.length && action === 'signoff') {
      const isAllCompleted = selectedCertificates.some(x => {
        const certificate = certificationsList.find(cert => cert.certificationId === x);
        if (certificate.reviewerCertificationInfo.status !== statusType.COMPLETED ) {
          return true;
        }
        return false;
      });
      if (isAllCompleted) {
        return message.error('All selected certificates are not completed yet!');
      }
    }
    if (selectedCertificates.length) {
      const payload = selectedCertificates.map(x => {
        const certificate = certificationsList.find(cert => cert.certificationId === x);
        return {
          certificationID: certificate.certificationId,
          campaignID: certificate.campaignId,
          action: action,
          reviewerID: getUserName(),
          members: []
        }
      });
      let isFailed = false;
      for(let i in payload) {
        const data = await ApiService.bulkAction(payload[i]);
        if (!data || data.error || data.status === 'failed') {
          isFailed = true;
        }
      }
      if (isFailed) {
        return message.error('Something went wrong. Please try again!');
      } else {
        message.success('Successfully saved action!');
        this.getCertifications(true);
      }
    } else {
      return message.error('Please select certificates to take an action');
    }
  }

  checkBoxChange = (id, e) => {
    let {selectedCertificates} = this.state;
    if (selectedCertificates.indexOf(id) > -1) {
      selectedCertificates = selectedCertificates.filter(x => x !== id);
    } else {
      selectedCertificates.push(id);
    }
    this.setState({
      selectedCertificates
    })
  }

  onSelectAll = (e) => {
    let {selectedCertificates} = this.state;
    if(e.target.checked){
      this.getFilteredCertification().forEach((x) =>{
        if (x.reviewerCertificationInfo.status !== statusType.SIGN_OFF) {
          if (selectedCertificates.indexOf(x.certificationId) === -1) {
            selectedCertificates.push(x.certificationId);
          };
        }
      });
      this.setState({
        selectedCertificates
      })
    } else {
      this.setState({
        selectedCertificates: []
      })
    }
  }

  mainTable = () => {
    const { isLoading, selectedCertificates} = this.state;
    const getStatusName = (status) => {
      if (status === statusType.ACTIVE) {
        return 'In-Progress';
      } else if (status === statusType.COMPLETED){
        return 'Completed'
      } else if (status === statusType.SIGN_OFF){
        return 'Signed-Off'
      }
      return status;
    }
    const mainColumns = [
      {
        title: '',
        width: 150,
        key: 'certificationId',
        render: (record) => {
          return(
              <div>
                <Checkbox className="custom-check-box pl-20" disabled={record.reviewerCertificationInfo.status === statusType.SIGN_OFF}
                          checked={selectedCertificates.includes(record.certificationId)} onChange={() => this.checkBoxChange(record.certificationId)}/>
                <div className="app-icon"><img src={require('../../shared/img/appIcon.png')} /></div>
              </div>
          )
        }
      },
      {
        title: '',
        width: '50%',
        key: 'certificationName',
        render: (record) => {
          return (
            <div className="pl-10 tab-area" >
              <span className='cursor-pointer' onClick={() => this.onClick(record.certificationId, record)}>
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
        key: 'status',
        render: (record) => {
          return (
            <div>
              <div className="filter-row"><span>Created on</span>: <b>{ moment(record.reviewerCertificationInfo.certificationCreatedOn).format('MM/DD/YYYY')}</b></div>
              <div className="filter-row"><span>Expire on</span>: <b>{moment(record.reviewerCertificationInfo.certificationExpiration).format('MM/DD/YYYY')}</b></div>
              <div className="filter-row"><span>Status</span>: <b className="status active">{getStatusName(record.reviewerCertificationInfo.status)}</b>
                {
                  record.reviewerCertificationInfo.status === statusType.COMPLETED ?
                    <Tooltip title={'Signoff Pending'}>
                      <Icon className="pl-10" type="alert" style={{color: 'yellow !important'}} />
                    </Tooltip>
                  : ''
                }
              </div>
            </div>
          );
        }
      },
      {
        key: 'percentageCompleted',
        render: (record) => {
          return <div className="text-center"><Progress type="circle" width={100} percent={record.reviewerCertificateActionInfo.percentageCompleted || 0}/>
          </div>;
        }
      },
      {
        key: 'action',
        render: (record) => {
          return <div className="text-center custom-icon"><Icon type="right" onClick={() => this.onClick(record.certificationId, record)}/></div>;
          /*<div className="text-center"><Button onClick={() => this.onClick(record.certificationId, record)}>Go</Button></div>*/
        }
      }
    ];
    {
      return isLoading ? <Spin className='mt-50 custom-loading'/> : <Table
          rowKey={'certificationId'}
          columns={mainColumns}
          size="small"
          className="main-table"
          showHeader={false}
          dataSource={this.getFilteredCertification()}
          onRow={(record, rowIndex) => {
            return {
              className: selectedCertificates.includes(record.certificationId) ? "row-selected" : ''
            };
          }}

      />;
    }
  }

  getFilterData = () => {
    const {certificationsList, isFiltered, certOwner, name, status, signOfDate} = this.state;
    if (!isFiltered) {
      return certificationsList;
    }
    let filteredData = certificationsList;
    if (certOwner) {
      filteredData = filteredData.filter(x => {
        return x.reviewerCertificationInfo.certificateRequester.toLowerCase().includes(certOwner.toLowerCase())
      })
    }
    if (name) {
      filteredData = filteredData.filter(x => {
        return x.reviewerCertificationInfo.certificationName.toLowerCase().includes(name.toLowerCase())
      })
    }
    if (status) {
      filteredData = filteredData.filter(x => {
        return x.reviewerCertificationInfo.status.toLowerCase().includes(status.toLowerCase())
      })
    }

    if(signOfDate > -1){
      let days = 0;
      if (signOfDate === 0) {
        days = 7;
      } else if (signOfDate === 1) {
        days = 14;
      } else if (signOfDate === 2) {
        days = 21;
      }
      filteredData = filteredData.filter(x => {
        if (!x.reviewerCertificationInfo.certificationCreatedOn || !x.reviewerCertificationInfo.certificationExpiration) {
          return false;
        }
        return moment(x.reviewerCertificationInfo.certificationExpiration).diff(moment(x.reviewerCertificationInfo.certificationCreatedOn), 'days') < days;
      });
    }
    return filteredData;
  }

  onSearch = () => {
    this.setState({
      isFiltered: true,
    })
  }

  onReset = () => {
    this.setState({
      isFiltered: false,
      signOfDate: -1,
      name: '',
      status: '',
      certOwner: ''
    });
  }

  onSliderChange = (value) => {
   this.setState({
     signOfDate: value,
     isFiltered: false,
   })
  }

  getFilteredCertification = (SignOffFilterd) => {
    let {statusFilter, certificationsList } = this.state;
    if (SignOffFilterd) {
      certificationsList = (certificationsList || []).filter(x => x.reviewerCertificationInfo.status !== statusType.SIGN_OFF);
    }
    if (statusFilter !== 'all') {
      return (certificationsList || []).filter(x => x.reviewerCertificationInfo.status === statusFilter);
    }
    return certificationsList;
  }

  onChangeStatus = (statusFilter) => {
    this.setState({
      statusFilter
    });
  }

  handleOk = async (id) => {
    const {signedOffList, certificationsList} = this.state;
    const certificate = certificationsList.find(x => x.certificationId !== id);
    const payload = {
      certificationID: String(certificate.certificationId),
      campaignID: String(certificate.campaignId),
      action: 'signoff',
      reviewerID: getUserName(),
      members: []
    };
    const data = await ApiService.bulkAction(payload);
    if (!data || data.error || data.status === 'failed') {
      if (data.status && data.response) {
        message.error(data.response);
      } else {
        message.error('Something went wrong. please try again.');
      }
       return this.setState({
         isSaving: false,
       });
    }
    certificate.reviewerCertificationInfo.status = statusType.SIGN_OFF;
    message.success('Successfully Signed Off');
    this.setState({
      signedOffList: signedOffList.filter(x => x.certificationId !== id),
      username: '', password: '',
      isSaving: false,
      certificationsList
    });
  }

  handleCancel = (id) => {
    this.setState({
      signedOffList: this.state.signedOffList.filter(x => x.certificationId !== id),
      username: '', password: ''
    });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  renderModals = () => {
    const {signedOffList, username, password} = this.state;
    const okButtonProps = {
      disabled: !username || !password
    };
    return signedOffList.map(x => {
      return (<Modal
        title="Signed Off"
        visible={true}
        okText="Yes"
        maskClosable={false}
        closable={false}
        onOk={() => this.handleOk(x.certificationId)}
        okButtonProps={
          okButtonProps
        }
        onCancel={() => this.handleCancel(x.certificationId)}
      >
        <p>Certification <b>{x.reviewerCertificationInfo.certificationName}</b> is completed.</p>
        <p>Do you want to sign-off?</p>
        <p>
          <Input type="text" name="username" onChange={this.onChange} />
        </p>
        <p><Input type="password" name="password"  onChange={this.onChange} /></p>
      </Modal>)
    });
  }

  render() {
    const {selectedCertificates, statusFilter} = this.state;
    return (
        <div className="certification">
          <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon"><img src={require('../../shared/img/certicon.png')} /></span> {"Certification Dashboard"}</span>}/>
            <div className="dashboard mt-30">
              {this.modal()}
              {this.drawer()}
              {this.infoDrawer()}
              <Card md={12} lg={12} xl={12}>
                <CardHeader>
                  <Row>
                    <Col>

                      <div className="d-flex flex-wrap">
                        <Col lg={2} md={6} sm={6} xs={6} className="mt-5 column-padding ">
                          <Button className="icon square w-100-p" color="primary" size={"large"}>
                            <Checkbox className='custom-check-box' checked={selectedCertificates.length && selectedCertificates.length === this.getFilteredCertification(true).length} onChange={this.onSelectAll}> Select All</Checkbox>
                          </Button>
                        </Col>
                        <Col lg={2} md={6} sm={6} xs={6} className="mt-5 column-padding ">
                          <Button className="icon square w-100-p" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('certified')}><Icon type="check" />Complete</Button>
                        </Col>
                        <Col lg={2} md={6} sm={6} xs={6} className="mt-5 column-padding ">
                          <Button className="icon square w-100-p" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('signoff')}><a><img src={require('../../images/image.png')} style={{width: 22}}/></a>&nbsp; Sign Off</Button>
                        </Col>

                        <Col lg={2} md={6} sm={6} xs={6} className="mt-5 column-padding ">
                          <Button className="icon square w-100-p" color="primary" size={"large"}><Icon type="right-circle" />Reassign</Button>
                        </Col>

                        <Col lg={4} md={12} sm={12} xs={12} className="mt-5 column-padding">
                          <Select className="ml-10 pull-right" value={statusFilter} style={{width: '100%'}} name="statusFilter" onChange={this.onChangeStatus} placeholder="Filter" size="small">
                            <Option value="all">All Certifications</Option>
                            <Option value={statusType.ACTIVE}>In-Progress Certifications</Option>
                            <Option value={statusType.COMPLETED}>Completed Certifications</Option>
                            <Option value={statusType.SIGN_OFF}>Signed-Off Certifications</Option>
                          </Select>
                        </Col>
                      </div>

                      {/*<Button className="icon square mb-0 ml-0" color="primary" size={"large"}>
                        <Checkbox className='custom-check-box' checked={selectedCertificates.length && selectedCertificates.length === this.getFilteredCertification(true).length} onChange={this.onSelectAll}> Select All</Checkbox>
                      </Button>
                      <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('certified')}><Icon type="check" />Complete</Button>
                      <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('signoff')}><a><img src={require('../../images/image.png')} style={{width: 22}}/></a>&nbsp; Sign Off</Button>
                      <Button className="icon square mb-0 ml-10" color="primary" size={"large"}><Icon type="right-circle" />Reassign</Button>
                      <Select className="ml-10 pull-right" value={statusFilter} style={{width: 500}} name="statusFilter" onChange={this.onChangeStatus} placeholder="Filter" size="small">
                        <Option value="all">All Certifications</Option>
                        <Option value={statusType.ACTIVE}>In-Progress Certifications</Option>
                        <Option value={statusType.COMPLETED}>Completed Certifications</Option>
                        <Option value={statusType.SIGN_OFF}>Signed-Off Certifications</Option>
                      </Select>*/}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="cstm-card">
                  <Row>
                    <Col>
                      {this.mainTable()}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
        </div>
    )
  }
}

export default Certification;
