import React, {Component} from 'react';
import moment from 'moment'
import {Card, CardBody, Col, Row} from 'reactstrap';
import {
  Select,
  Table,
  Progress,
  Icon,
  Drawer,
  Checkbox,
  Slider,
  Input,
  message,
  Spin,
  Button,
  Tooltip,
  Modal
} from 'antd';
const {TextArea} = Input;
const {Option} = Select;
import '../Home/Home.scss';
import {ApiService} from "../../services/ApiService";
import CardHeader from "reactstrap/es/CardHeader";
import Cookies from "universal-cookie";
import CustomHeader from "../Layout/CustomHeader";

const cookies = new Cookies();
const getUserName = () => {
  return  cookies.get('LOGGEDIN_USERID');
}

const initialState = {
  current: 0,
  selectedRequests: [],
  selectedUsers: [],
  selectedAccess: [],
  requestsList: [],
  statusFilter: 'all',
  expendedRows: [],
  isCommentModal: false,
  comment: {
    userId: '',
    appId: '',
    text: ''
  }
};

class ReviewRequest extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      clientId: this.props.match.params.clientId,
      isLoading: false,
      ...initialState
    };
  }

  componentDidMount() {
    this.getRequests()
  }

  formatter = (value) => {
    return `${value}%`;
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      isFiltered: false,
    })
  }

  getRequests = async () => {
    this.setState({
      isLoading: true,
      selectedRequests: [],
    });
    const data = await this._apiService.getRequests('manager')
    if(!data || data.error){
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      this.setState({
        isLoading: false,
        requestsList: data
      });
    }
  }

  onSubmitBulkAction = async (action) => {
    const {selectedRequests, requestsList, singleRequest, current} = this.state;
    const requestObj = [];
    if (current === 0) {
      selectedRequests.forEach(x => {
        const request = requestsList.find(y => y.parentReqid === x);
        if (request) {
          (request.requestList || []).forEach(y => {
            requestObj.push({
              id: y.subRequestId,
              status: action === 'approve' ? 'true' : 'false',
              comments: ''
            });
          })
        }
      });
    } else {
      if (action === 'submit') {
        singleRequest.userList.forEach(x => {
          x.requests.forEach(y => {
            if (y.action && y.action !== 'required') {
              requestObj.push({
                id: y.subRequestId,
                status: y.action === 'certified' ? 'true' : 'false',
                comments: y.newComment || ''
              });
            }
          });
        });
      } else {
        singleRequest.userList.forEach(x => {
          x.requests.forEach(y => {
            if (y.checked) {
              y.action = action === 'approve' ? 'certified' : 'rejected';
            }
          });
        });
        this.setState({
          singleRequest
        });
      }
    }
    if (requestObj.length) {
      try {
        await ApiService.submitRequestAction(requestObj);
        message.success('Actions submitted successfully!');
        this.setState({
          ...initialState,
        });
        this.getRequests();
      }  catch {
        message.error('something went wrong! please try again later');
      }
    }
  }

  checkBoxChange = (id, e) => {
    let {selectedRequests} = this.state;
    if (selectedRequests.indexOf(id) > -1) {
      selectedRequests = selectedRequests.filter(x => x !== id);
    } else {
      selectedRequests.push(id);
    }
    this.setState({
      selectedRequests
    })
  }

  getFilteredRequests = () => {
    let {requestsList} = this.state;
    // if (requestsList !== 'all') {
    //   return (requestsList || []).filter(x => x.requestsList.status === statusFilter);
    // }
    return requestsList ;
  }

  onSelectAll = (e) => {
    let {selectedRequests, singleRequest, current} = this.state;
    if(e.target.checked){
      if (current === 0) {
        this.getFilteredRequests().forEach((x) =>{
          selectedRequests.push(x.parentReqid);
        });
        this.setState({
          selectedRequests
        })
      } else {
        (singleRequest.userList || []).forEach(x => {
            x.checked = true;
            x.requests.forEach(y => {
              y.checked = true;
            });
        });
        this.setState({
          singleRequest
        });
      }
    } else {
      if (current === 0) {
        this.setState({
          selectedRequests: []
        })
      } else {
        (singleRequest.userList || []).forEach(x => {
            x.checked = false;
            x.requests.forEach(y => {
              y.checked = false;
            });
        });
        this.setState({
          singleRequest
        })
      }
    }
  }

  onSelectRequest = (id) => {
    const { requestsList } = this.state;
    const singleRequest = requestsList.find(x => x.parentReqid === id);
    singleRequest.userList = [];
    (singleRequest.requestList || []).forEach( (x, id) => {
      const user = {
        requestedForID: x.requestedForID,
        requestedForEmail: x.requestedForEmail,
        requestedForDisplayName: x.requestedForDisplayName,
        requests: [],
        id: singleRequest.userList.length,
        action: 'required'
      };
      if (!singleRequest.userList.some(x => x.requestedForID === user.requestedForID)) {
        singleRequest.userList.push(user);
      }
    });
    singleRequest.userList.forEach(x => {
      x.requests = (singleRequest.requestList || []).filter(y => y.requestedForID === x.requestedForID).map(x => ({...x, action: 'required'}));
    });
    this.setState({
      singleRequest,
      current: 1,
      selectedRequests: []
    });
  }

  onBack = () => {
    this.setState({
      singleRequest: {},
      current: 0,
    });
  }

  mainTable = () => {
    const { isLoading, selectedRequests} = this.state;
    const mainColumns = [
      {
        title: '',
        width: 150,
        render: (record) => {
          return(
            <div>
              <Checkbox className="custom-check-box pl-20" checked={selectedRequests.includes(record.parentReqid)} onChange={() => this.checkBoxChange(record.parentReqid)}/>
              <div className="app-icon"><img src={require('../../shared/img/appIcon.png')} /></div>
            </div>
          )
        }
      },
      {
        title: '',
        width: '40%',
        render: (record) => {
          return (
            <div className="pl-10 tab-area" >
              <span className='cursor-pointer' onClick={() => this.onSelectRequest(record.parentReqid, record)}>
              <div><h4 className="mb-0">{record.requestName}</h4></div>
                <div className="cert-owner"><small><b>Request ID: </b>{record.parentReqid}</small></div>
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
              <div className="filter-row"><span>Created on</span>: <b>{ record.requestedOn ? moment(record.requestedOn).format('MM/DD/YYYY') : '-'}</b></div>
              <div className="filter-row"><span>Start Date</span>: <b>{record.startDate ? moment(record.startDate).format('MM/DD/YYYY') : '-'}</b></div>
              <div className="filter-row"><span>End Date</span>: <b>{record.endDate ? moment(record.endDate).format('MM/DD/YYYY') : '-'}</b></div>
            </div>
          );
        }
      },
      {
        title: '',
        render: (record) => {
          return (
            <div>
              <div className="filter-row"><span>No Of Requests:</span> <b>{(record.requestList || []).length}</b></div>
              <div className="filter-row"><span>Requested By</span>: <b>{record.requestedBy}</b></div>
              <div className="filter-row"><span>Request Type</span>: <b>{record.action}</b></div>
            </div>
          );
        }
      },
      {
        render: (record) => {
          return <div className="text-center"><Progress type="circle" width={100} percent={40}/>
          </div>;
        }
      },
      {
        render: (record) => {
          return <div className="text-center custom-icon"><Icon type="right" onClick={() => this.onSelectRequest(record.parentReqid)}/></div>;
        }
      }
    ];
    {
      return isLoading ? <Spin className='mt-50 custom-loading'/> : <Table
        columns={mainColumns}
        size="small"
        className="main-table"
        showHeader={false}
        dataSource={this.getFilteredRequests()}
        onRow={(record, rowIndex) => {
          return {
            className: selectedRequests.includes(record.parentReqid) ? "row-selected" : ''
          };
        }}

      />;
    }
  }

  onExpandedRowsChange = (data) => {
    this.setState({
      expendedRows: data
    });
  }

  CustomExpandIcon = (props) => {
    if (props.expanded) {
      return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
    } else {
      return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
    }
  }

  onSaveComment = () => {
    const {comment, singleRequest} = this.state;
    (singleRequest.userList || []).forEach(x => {
      if (x.id === comment.userId) {
        x.requests.forEach(y => {
          if (y.subRequestId === comment.appId) {
            y.newComment = comment.text;
          }
        });
      }
    });
    this.setState({
      singleRequest,
      isCommentModal: false,
      comment: {
        userId: '',
        appId: '',
        text: ''
      }
    });
  }

  onChangeComment = (event) => {
    this.setState({
      comment: {
        ...this.state.comment,
        text: event.target.value
      }
    });
  }

  commentModal = () => {
    const {comment} = this.state;
    return (
        <Modal
            width={400}
            onCancel={this.onToggleComment}
            visible={this.state.isCommentModal}
            footer={
              <div>
                <Button type="primary" onClick={this.onSaveComment}>Save</Button>
              </div>
            }
        >
          <div className="mr-15"><TextArea placeholder='Comments..' value={comment.text} onChange={this.onChangeComment}/></div>
        </Modal>
    )
  }

  onToggleComment = (userId, appId, text) => {
    this.setState({
      isCommentModal: !this.state.isCommentModal,
      comment: {
        userId,
        appId,
        text
      }
    });
  }

  onUserChange = (userId, action) => {
    const {singleRequest} = this.state;
    (singleRequest.userList || []).forEach(x => {
      if (x.id === userId) {
        x.action = action;
        x.requests.forEach(y => {
            y.action = action;
        });
      }
    });
    this.setState({
      singleRequest
    });
  }

  onAppChange = (appId, userId, action) => {
    const {singleRequest} = this.state;
    (singleRequest.userList || []).forEach(x => {
      if (x.id === userId) {
        x.requests.forEach(y => {
          if (y.subRequestId === appId) {
            y.action = action;
          }
        })
      }
    });
    this.setState({
      singleRequest
    });
  }

  onUserCheckBoxChange = (userId, checked) => {
    const {singleRequest} = this.state;
    (singleRequest.userList || []).forEach(x => {
      if (x.id === userId) {
        x.checked = checked;
        x.requests.forEach(y => {
          y.checked = checked;
        });
      }
    });
    this.setState({
      singleRequest
    });
  }

  onAppCheckBoxChange = (appId, userId, checked) => {
    const {singleRequest} = this.state;
    (singleRequest.userList || []).forEach(x => {
      if (x.id === userId) {
        x.requests.forEach(y => {
          if (y.subRequestId === appId) {
            y.checked = checked;
          }
        })
      }
    });
    this.setState({
      singleRequest
    });
  }

  userTable = () => {
    const {singleRequest, expendedRows} = this.state;
    const expandedRowRender = (mainRecord) => {
      const columns = [
        {
          title: '',
          width: "5%",
          render: (record) => {
            return (
              <div>
                <Checkbox className={'custom-check-box'} checked={record.checked} onChange={(event) => this.onAppCheckBoxChange(record.subRequestId, mainRecord.id, event.target.checked)} />
              </div>
            )
          }
        },
        {
          title: 'Name',
          width: "25%",
          render: (record) => {
            return <span>{record.objectName}</span>
          }
        },
        {
          title: 'Type',
          width: "30%",
          render: (record) => {
            return <span>{record.objectType}</span>
          }
        },
        {
          title: 'Decision',
          width: "17%",
          render: (record) => {
            return (
              <div>
                    <span className={`mr-10 row-action-btn ${record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                          onClick={() => this.onAppChange(record.subRequestId, mainRecord.id, record.action === 'certified' ? 'required' : 'certified')}
                    >
                         {record.action === 'certified' ? 'Approved' : 'Approve'}
                    </span>
                <span
                  className={`mr-10 row-action-btn-a ${record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                  onClick={() => this.onAppChange(record.subRequestId, mainRecord.id, record.action === 'rejected' ? 'required' : 'rejected')}
                >
                    {record.action === 'rejected' ? 'Revoked' : 'Revoke'}
                </span>
              </div>
            )
          }
        },
        {
          title: (<div><img src={require('../../images/comment.png')} /></div>),
          width: "5%",
          render: (record) => {
            return <span className='cursor-pointer' onClick={() => this.onToggleComment(mainRecord.id, record.subRequestId, record.newComment)}><a><img src={require('../../images/edit.png')} className="size-img" /></a></span>
          }
        },
      ];
      return (
        <Card className="antd-table-nested">
          <Table
            columns={columns}
            size="small"
            dataSource={mainRecord.requests || []}
            pagination={{pageSize: 25}}
          />
        </Card>
      );
    };
    const columns = [
      {
        title: '',
        width: 10,
        render: (record) => {
          return (
            <div>
              <Checkbox className={'custom-check-box'} checked={record.checked} onChange={(event) => this.onUserCheckBoxChange(record.id, event.target.checked)} />
            </div>
          )
        }
      },
      {
        width: "25%",
        render: (record) => {
          return <span><span className='application'>Name:</span> <b>{record.requestedForDisplayName}</b></span>
        }
      },
      {
        width: "25%",
        render: (record) => {
          return <span><span className='application'>User Name:</span> <b>{record.requestedForID}</b></span>
        }
      },
      {
        width: "25%",
        render: (record) => {
          return <span><span className='application'>Email:</span> <b>{record.requestedForEmail}</b></span>
        }
      },
      {
        title: 'Decision',
        width: 100,
        render: (record) => {
          return (
              <div>
                <span className={`mr-10 row-action-btn ${record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                    onClick={() => this.onUserChange(record.id, record.action === 'certified' ? 'required' : 'certified')}
                >
                     {record.action === 'certified' ? 'Approved' : 'Approve'}
                </span>
                <span
                    className={`mr-10 row-action-btn-a ${record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                    onClick={() => this.onUserChange(record.id, record.action === 'rejected' ? 'required' : 'rejected')}
                >
                    {record.action === 'rejected' ? 'Revoked' : 'Revoke'}
                </span>
              </div>
          )
        }
      },
    ];
    return (
      <div className='border-1 mt-20' style={{flex: 1}}>
          <Row>
            <Col md="12" sm="12" className='pl-15'>
              <div className="inner-profile-right">
                <Table
                  columns={columns}
                  size="medium"
                  className={`user-profile-data no-padding-table`}
                  expandedRowRender={expandedRowRender}
                  expandIcon={this.CustomExpandIcon}
                  dataSource={singleRequest.userList || []}
                  onExpandedRowsChange={this.onExpandedRowsChange}
                  showHeader={false}
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
      </div>
    );
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

  onChangeStatus = (statusFilter) => {
    this.setState({
      statusFilter
    });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  isAllSelected = () => {
      const {singleRequest, selectedRequests, current} = this.state;
      if (current === 0) {
        return selectedRequests.length === this.getFilteredRequests(true).length;
      } else {
        return !singleRequest.userList.some(x => {
          return x.checked !== true || x.requests.some(y => y.checked !== true);
        });
      }
  }

  getChangeCount = () => {
    const {singleRequest} = this.state;
    let count = 0;
    singleRequest.userList.forEach(x => {
      count += (x.requests || []).filter(y => y.action && y.action !== 'required').length;
    });
    return count;
  }

  render() {
    const {statusFilter, current} = this.state;
    const changedCount = current === 1 && this.getChangeCount();
    return (
      <div>
        <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon"><img src={require('../../shared/img/certicon.png')} /></span> Access Requests</span>}/>
        <div className="dashboard mt-30">
          <Card md={12} lg={12} xl={12}>
            <CardHeader>
              <Row>
                <Col>
                  <Button className="icon square mb-0 ml-0" color="primary" size={"large"}>
                    <Checkbox className='custom-check-box' checked={this.isAllSelected()} onChange={this.onSelectAll}>Select All</Checkbox>
                  </Button>
                  <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('approve')}><Icon type="check" />Approve</Button>
                  <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={() => this.onSubmitBulkAction('reject')}><a><img src={require('../../images/image.png')} style={{width: 22}}/></a>&nbsp; Reject</Button>
                  {current === 1 && <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={() => this.onBack()}><a><img src={require('../../images/multiply.png')} style={{width: 22}}/></a>&nbsp; Cancel</Button>}

                  <Select className="ml-10 pull-right" value={statusFilter} style={{width: 500}} name="statusFilter" onChange={this.onChangeStatus} placeholder="Filter" size="small">
                    <Option value="all">All</Option>
                  </Select>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="cstm-card">
              <Row>
                <Col>
                  { current === 0 ? this.mainTable() : this.userTable()}
                </Col>
              </Row>
            </CardBody>
          </Card>
          {
            current === 1 &&
            <div className="sticky-btn">
              <Button
                  className="icon square float-right mb-0"
                  size={"large"} color="primary"
                  disabled={changedCount === 0}
                  onClick={() => this.onSubmitBulkAction('submit')}>
                Save & Review Later ({changedCount})
              </Button>
            </div>
          }
        </div>
        {
          this.commentModal()
        }
      </div>
    )
  }
}

export default ReviewRequest;
