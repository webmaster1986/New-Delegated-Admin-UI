import React, {Component} from 'react';
import {Button, Checkbox, Icon, Select, Spin, Table, Drawer, Tooltip, Input} from "antd";
import {get} from 'lodash';
import moment from "moment"
import {Card, CardBody, Col, Row} from "reactstrap";
import MediaQuery from 'react-responsive'
import CardHeader from "reactstrap/es/CardHeader";
import './RequestList.scss'

const {Option} = Select;
const {Search} = Input;

class RequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expendedRows: [],
      isDrawer: false,
      selectedIndex: null,
      xsExpandedRows: []
    };
  }

  getApprovalDetails = (record) => {
    return [
      {
        action: 'Request Submission',
        date: moment(record.requestedOn).format("MM-DD-YYYY"),
        status: 'Submitted',
        assignedTo: "NA",
        comments: ''
      },
      {
        action: 'Assigned to Manager',
        date: moment(record.requestedOn).format("MM-DD-YYYY"),
        status: 'Assigned',
        assignedTo: "AMURRAY",
        comments: ''
      },
      {
        action: "Manager Approval",
        date: record.status === 'Approved' ? moment(new Date()).format("MM-DD-YYYY") : '',
        status: record.status === 'Approved' ? 'Approved' : 'Pending',
        assignedTo: "AMURRAY",
        comments: ''
      },
      /* {
        action: "Assigned to App Owner",
        date: '',
        status: "",
        assignedTo: "",
        comments: ''
      },
      {
        action: "App Owner Approval",
        date: '',
        status: "",
        assignedTo: "",
        comments: ''
      }, */
      {
        action: "Request Completed",
        date: '',
        status: "",
        assignedTo: "",
        comments: ''
      },
    ]
  }

  onExpand = (record) => {
    record.entityType = record.entity.entityType
    record.entityName = record.entity.entityName
    const keys = ['Date Created', 'Type', 'Name', 'Description', 'Start Date', 'End Date'];
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
      <div className="expand-header approve-access">
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
              dataSource={this.getApprovalDetails(record)}
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

  onExpandedRowsChange = (data) => {
    this.setState({
      expendedRows: data.length ? [data[data.length-1]] : [],
      selectedIndex: null,
    });
  }

  onExpandXSRow = (index) => {
    const {xsExpandedRows} = this.state
    const findIndex = xsExpandedRows.indexOf(index)
    if(findIndex === -1){
      xsExpandedRows.push(index)
    }else {
      xsExpandedRows.splice(findIndex, 1)
    }
    this.setState({xsExpandedRows})
  }

  xsTabView = (data, columns) => {
    const {xsExpandedRows} = this.state
    const rows = () => {
      return data.map((record,index) => {
        const approvalDetails = this.getApprovalDetails(record);
        const expandTableColumns = this.getUsersColumns()
        const isExpanded = xsExpandedRows.indexOf(index) !== -1

        record.entityType = record.entity.entityType
        record.entityName = record.entity.entityName
        const keys = ['Date Created', 'Type', 'Name', 'Description', 'Start Date', 'End Date']
        const values = ['startDate', 'entityType', 'entityName', 'entityName', 'startDate', 'endDate']

        return (
          <tr key={index}>
            {
              columns.map((item, cIndex) => (
                <td key={cIndex}>
                  <div>
                    {typeof item.title === "function" ? item.title() : item.title || ""}
                    &nbsp;&nbsp;
                  </div>
                  {item.render(record)}
                </td>
              ))
            }
            <td onClick={() => this.onExpandXSRow(index)}>
              <div>
                <Icon type={!isExpanded ? "caret-right" : "caret-down"} theme="filled"/>
              </div>
              <div>
                {!isExpanded ? "Expand" : "Collapse"}
              </div>
              {
                isExpanded ?
                  <div>
                    <h4 className="text-left mt-4">Request Details</h4>
                    <table>
                      <tbody>
                      <tr>
                        {
                          keys.map((key, index) => (
                            <td key={`${index}${index.toString()}`}>
                              <div>
                                <p><b>{key}: </b></p>
                              </div>
                              <div className="word-break">
                                <p>{key === "Description" ? `Description Of ${record[values[index]]}` : record[values[index]]}</p>
                              </div>
                            </td>
                          ))
                        }
                      </tr>
                      </tbody>
                    </table>

                    <h4 className="text-left mt-4">Approval Details</h4>
                    <table>
                      <tbody>
                        {
                          approvalDetails.map((aprItem, apIndex) => (
                            <tr key={apIndex}>
                              {
                                expandTableColumns.map((expItem,expIndex) => (
                                  <td key={`${apIndex}${expIndex.toString()}`}>
                                    <div>
                                      <p><b>{expItem.title}: </b></p>
                                    </div>
                                    <div className="word-break">
                                      <p>{aprItem[expItem.dataIndex] || ""}</p>
                                    </div>
                                  </td>
                                ))
                              }
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  : null
              }
            </td>
          </tr>
        );
      })
    }

    return (
      <div className="xs-table-view inner-profile-right certification-owner overflow">
        <table className="responsive-table user-profile-data no-padding-table">
          <tbody>{rows()}</tbody>
        </table>
      </div>
    )
  }

  tab = (item, index) => {
    const {
      isLoadingUser, selectedEnt, entCheckBoxChange, onUpdateEntStatus, onToggleComment, getFilterData, groupBy, onToggleBeneficiaryInfo
    } = this.props;
    const data = getFilterData()
    const {expendedRows, selectedIndex} = this.state
    const requestIdNameColumns = []
    const entityTypeNameColumns = []
    const firstNameLastNameColumns = []

    if(groupBy === "users" || groupBy === "entity"){
        requestIdNameColumns.push(
        {
            title: 'Req Id',
            render: (record) => {
                return (<span>
          <a onClick={() => this.setState({isDrawer: !this.state.isDrawer, record})} className="color-blue">{ record && record.parentReqid } </a>
        </span>);
            }
        },
        {
            title: 'ID',
            render: (record) => {
                return (<span>
                  { record && record.id }
                </span>);
            }
        }
      )
    }

    if(groupBy === "request"){
        requestIdNameColumns.push(
            {
                title: 'ID',
                render: (record) => {
                    return (<span>
                  { record && record.id }
                </span>);
                }
            },
        )
    }

    if(groupBy === "users" || groupBy === "request"){
        entityTypeNameColumns.push(
            {
                title: 'Entity Type',
                render: (record) => {
                    return (<span>
          { record && record.entityType }
        </span>);
                }
            },
            {
                title: 'Entity Name',
                render: (record) => {
                    return (<span>
          { record && record.entityName }
        </span>);
                }
        }
      )
    }

    if(groupBy === "entity" || groupBy === "request"){
          firstNameLastNameColumns.push(
              {
                  title: 'Beneficiary',
                  render: (record) => {
                      return (<span>
                        { record && record.requestedForDisplayName }
                        {/*<Icon type="info-circle" theme="twoTone" onClick={() => onToggleBeneficiaryInfo(record)}/>*/}
                      </span>);
                  }
              }
              /*,{
                  title: 'Beneficiary Email',
                  render: (record) => {
                      return (<span>
                        { record && record.requestedForEmail }
                      </span>);
                  }
              }*/
          )
      }

    const columns = [
      {
        title: '',
        width: 30,
        render: (record) => {
          return (
            <div>
              <Checkbox className={'custom-check-box pl-10'} checked={selectedEnt.includes(record.id)}
                        onChange={(e) => entCheckBoxChange(record.id, e)}/>
            </div>
          )
        }
      },
      ...requestIdNameColumns,
      ...entityTypeNameColumns,
      ...firstNameLastNameColumns,
        {
            title: 'Requested By',
            render: (record) => {
                return (<span>{ record && record.requestedBy }</span>);
            }
        },
        {
            title: 'Requested On',
            render: (record) => {
                return (<span>{ record && record.requestedOn && moment(record.requestedOn).format('MM-DD-YYYY') }</span>);
            }
        },
        // {
        //     title: 'Violation',
        //     render: (record, data, index) => {
        //         return <span> { index < 3 ?
        //           <Tooltip placement="bottom" title="Policy Violation">
        //             <Icon type="exclamation-circle" className="color-red fs-18" />
        //           </Tooltip> : null } </span>
        //     },
        //     width: "5%",
        // },
      {
        width: "5%",
        title: () => {
            return <div>
                <span className="mr-5"><img src={require('../../images/kapstone-logo1.png')} /></span>
            </div>
        },
        render: (record, data, index) => {
            let label = ''
            if(record.entityName === "OCI_Administrators") {
                label = "High Risk role"
            } else if(record.entityName === "Oracle Fusion Applications") {
                label = "Outlier access"
            } else if(index === 1 || record.entityName === "Payroll Manager" || record.entityName === "Human Resource Manager") {
                label = "SoD Violation"
            }
            if(!label) {
                return <img src={require('../../images/thumbs-up.png')} className="size-img" />
            }
            return (
                <Tooltip placement="bottom" title={label} >
                    <img src={require('../../images/thumbs-down.png')} className="size-img" />
                </Tooltip>
            );
        }
      },
      {
        title: 'Decision',
        width: 200,
        render: (record, data, index) => {
          const action = get(record, 'action');
          return (
            <div>
              {
                record.prevAction !== 'Rejected' && record.prevAction !== 'Approved' ?
                  <div>
                    <span
                      className={`mr-10 row-action-btn ${action === 'Approved' ? 'text-success' : 'text-initial'}`}
                      onClick={record.prevAction === "Add" ? () => onUpdateEntStatus(record.id, action === 'Approved' ? 'Add' : 'Approved', index <= 2) : null }>
                   {action === 'Approved' ? 'Approved' : 'Approve'}
              </span>
                    <span
                      className={`mr-10 row-action-btn-a ${action === 'Rejected' ? 'text-success' : 'text-initial'}`}
                      onClick={record.prevAction === "Add" ? () => onUpdateEntStatus(record.id, action === 'Rejected' ? 'Add' : 'Rejected', index <= 2) : null }>
                                      {action === 'Rejected' ? 'Rejected' : 'Reject'}
                                </span>
                  </div> : null
              }
              {
                record.prevAction === 'Approved' || record.prevAction === 'Rejected' ?
                  <span className={`mr-10 ${ action === 'Rejected' ? 'row-action-btn-a': 'row-action-btn' } text-success`}>
                   {action}
                  </span> : null
              }
            </div>
          )
        }
      },
      {
        title: (<div><img src={require('../../images/comment.png')}/></div>),
        width: 50,
        align: 'right',
        render: (record) => {
          return <span className='cursor-pointer'
                       onClick={() => onToggleComment(record.id, record.comments)}
          ><a><img
            src={require('../../images/edit.png')} className="size-img"/></a></span>
        }
      },
    ];
    return (
      <div key={index.toString()} className='border-1 mt-20' style={{flex: 1}}>
        {isLoadingUser ?
          <Spin className='mt-50 custom-loading'/> :
          <>
            <MediaQuery minDeviceWidth={1000}>
              <Row>
                <Col md="12" sm="12" className='pl-15'>
                  <div
                    className="inner-profile-right certification-owner"> {/* className="inner-profile-right certification-owner"*/}
                    <Table
                      columns={columns}
                      size="medium"
                      rowKey={'id'}
                      sorting={false}
                      pagination={{pageSize: 25}}
                      expandIcon={this.customExpandIcon}
                      className={`user-profile-data no-padding-table`}
                      dataSource={data}
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
                  </div>
                </Col>
              </Row>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={999}>
              {this.xsTabView(data, columns)}
            </MediaQuery>
          </>
        }
      </div>
    );
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
          }

        ];
    }

  onDrawerShow = () => {
      const { record, isDrawer } = this.state
      if(isDrawer){
          record.entityType = record.entity.entityType
          record.entityName = record.entity.entityName
          const keys = ['Date Created', 'Type', 'Name', 'Description', 'Start Date', 'End Date']
          const values = ['startDate', 'entityType', 'entityName', 'entityName', 'startDate', 'endDate']
          return(
              <Drawer
                  title="Information"
                  width={"50%"}
                  placement="right"
                  closable
                  onClose={() => this.setState({isDrawer: !this.state.isDrawer})}
                  visible={isDrawer}
              >
                  <Row className="mt-10">
                      <Col md={12} sm={12} xs={12}>
                          <h4>Request Details</h4>
                          <Row className="mt-10">
                              {
                                  keys.map((key, index) => (
                                      <>
                                          <Col md={4} sm={12} xs={12}>
                                              <p><b>{key}: </b></p>
                                          </Col>
                                          <Col md={8} sm={12} xs={12}>
                                              <p>{key === "Description" ? `Description Of ${record[values[index]]}` : record[values[index]]}</p>
                                          </Col>
                                      </>
                                  ))
                              }
                          </Row>
                      </Col>
                      <Col md={12} sm={12} xs={12} className="mt-20">
                          <h4>Approval Details</h4>
                          <Table
                              className="mr-10"
                              columns={this.getUsersColumns()}
                              rowKey={"id"}
                              size="small"
                              dataSource={this.getApprovalDetails(record)}
                          />
                      </Col>
                  </Row>
              </Drawer>
          )
      }
  }

  render() {
    const {
      members, activeKey, onSelectAll, confirmApproveSelected, apps,
      confirmRevokeSelected, onChange, selectedEnt, changedCount, submitData, searchKey, filter, groupBy
    } = this.props;
    return (
      <div className="custom-content">
        {this.onDrawerShow()}
        <Card className="mt-10">
          <CardHeader className="pl-20">
            <div className="d-flex flex-wrap top-filter" style={{margin: '0px -30px'}}>
              <Col md={12} sm={12} xs={12}>

                  <div className="d-flex flex-wrap">

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Button className="square w-100-p" size={"large"} color="primary">
                              <Checkbox
                                  onChange={onSelectAll} className="custom-check-box"
                                  checked={(selectedEnt.length && selectedEnt.length === apps.length)}
                              > Select All</Checkbox></Button>
                      </Col>

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Button className="square w-100-p" size={"large"} color="primary"
                                  onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                      </Col>

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Button className="square w-100-p" size={"large"} color="primary"
                                  onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Reject</Button>
                      </Col>

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Search
                              size="large"
                              placeholder="Search"
                              // style={{width: 220}}
                              className="float-right w-100-p"
                              value={searchKey}
                              name="searchKey"
                              onChange={onChange}
                          />
                      </Col>

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Select placeholder='Filter' value={filter} className='border-0 w-100-p float-right' size="large"
                                  onChange={(value) => onChange({
                                      target: {
                                          name: 'filter',
                                          value
                                      }
                                  })} style={{width: 220}}>
                              <Option value="Add">Pending</Option>
                              <Option value="Approved">Approved</Option>
                              <Option value="Rejected">Rejected</Option>
                              <Option value="mustReview">Must Review</Option>
                              <Option value="">All</Option>
                          </Select>
                      </Col>

                      <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                          <Select placeholder='' defaultValue="" value={groupBy} size="large" onChange={(value) => onChange({target: {name: 'groupBy', value}})}
                                  className='border-0 w-100-p float-right ' style={{width: 220}}>
                              <Option value="users">Group by Users</Option>
                              <Option value="entity">Group by Entity</Option>
                              <Option value="request">Group by None</Option>
                          </Select>
                      </Col>

                  </div>
              </Col>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <Row>
              {
                members.map((item, index) => {
                  if (item.name === activeKey) {
                    return this.tab(item, index)
                  }
                  return null;
                })
              }


            </Row>
            <div className="sticky-btn cstm-btn">
              <Button
                className="icon square float-right mb-0"
                size={"large"} color="primary"
                disabled={changedCount === 0}
                onClick={submitData}>
                Submit ({changedCount && changedCount})
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default RequestList
