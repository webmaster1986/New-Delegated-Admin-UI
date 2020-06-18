import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import {
    Button,
    Select,
    Input,
    message,
    Spin,
    Table,
    Icon,
    Modal,
    Tabs,
    Radio,
    DatePicker,
    Tooltip
} from "antd";
import moment from "moment";
import clonedeep from "lodash.clonedeep";
import uniq from 'lodash.uniq';

const {Search} = Input;
const {TextArea} = Input;
const { TabPane } = Tabs
const { RangePicker } = DatePicker
import {ApiService, getUserName} from "../../services/ApiService";
import './request.scss'
import '../Home/Home.scss'

import TableTransfer from "./TableTransfer";


class Request extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            selectedUsers: [],
            selectedApps: [],
            userList: [],
            applicationList: [],
            isModal: false,
            isLoading: false,
            isLoadingUsers: false,
            infoModal: false,
            isComment: false,
            isReview: false,
            isRequestHealthy: false,
            isSaved: false,
            isSelf: false,
            userMappings: [],
            groupList: [],
            groupAndAppList: [],
            recommannedList: [],
            transferSelectdUser: [],
            appList: [],
            selectedItem: [],
            articalList: [],
            allUsersList: [],
            selectedApp: null,
            endDate: '',
            startDate: '',
            requestName: '',
            selectedAdvisor: '',
            action: 'Add',
            comment: {
                id: '',
                childId:  '',
                text:  ''
            },
        };
    }

    handleUserChange = selectedUsers => {
        this.setState({selectedUsers});
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                current: 1,
                userMappings: [],
                selectedItem: [],
                selectedUsers: [],
            })
        }
    }

    componentDidMount() {
        this.getAllUsers()
        this.getgroupsWorkflow()
        this.getappsWorkflow()
    }

    getgroupsWorkflow = async () => {
        let {groupAndAppList} = this.state
        const requestedBy = getUserName()
        this.setState({
            isLoading: true
        });
        const payload = {
            "displayName": "",
        };
        const data = await ApiService.getgroupsWorkflow(payload);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    type: 'Group'
                };
                groupAndAppList.push(obj)
            });
            if(requestedBy === "AMURRAY") {
                groupAndAppList = groupAndAppList.filter(x => {
                    return (x.displayName || '').toLowerCase().includes('admin') || (x.displayName || '').toLowerCase().includes('server') ||
                      (x.displayName || '').toLowerCase().includes('information systems')
                });
            }
            this.setState({
                groupAndAppList,
                groupList: data,
                isLoading: false
            })
        }
    }

    getappsWorkflow = async () => {
        let {groupAndAppList} = this.state
        const requestedBy = getUserName()
        this.setState({
            isLoading: true
        });
        const payload = {
            "displayName": "",
        };
        const data = await ApiService.getappsWorkflow(payload);
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    type: 'Application'
                };
                groupAndAppList.push(obj)
            });
            if(requestedBy === "AMURRAY") {
                groupAndAppList = groupAndAppList.filter(x => {
                    return (x.displayName || '').toLowerCase().includes('admin') || (x.displayName || '').toLowerCase().includes('server') ||
                      (x.displayName || '').toLowerCase().includes('information systems')
                });
            }
            this.setState({
                groupAndAppList,
                appList: data,
                isLoading: false
            })
        }
    }

    getAllUsers = async () => {
        const {userList} = this.state
        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });
        const payload = {
            userName: this.isSelf() ? getUserName() : "",
            managerRequired: ""
        };
        const data = await ApiService.getUsersWorkflow(payload)
        let allUsersList = []
        if(this.isSelf()){
            const payload = {
                userName: "",
                managerRequired: ""
            };
            allUsersList = await ApiService.getUsersWorkflow(payload)
        }
        if (!data || data.error) {
            this.setState({
                isLoading: false,
                isLoadingUsers: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    key: i
                };
                userList.push(obj)
            })
            this.setState({
                userList,
                allUsersList,
                selectedUsers: this.isSelf() ? [0] : [],
                isLoading: false,
                isLoadingUsers: false
            })
        }
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({
            current,
        });
    }

    previous = () => {
        this.setState({
            current: this.state.current - 1
        });
    }

    isSelf = () => {
        return this.props.location.pathname.includes('request-for-self');
    }

    addToCart = (record) => {
        let {selectedItem} = this.state;
        const isExists = selectedItem.findIndex(item => item.id === record.id)
        if(isExists === -1) {
            selectedItem.push(record);
        }else {
            selectedItem.splice(isExists,1)
        }
        this.setState({
            selectedItem
        },() => this.setArticalList())
    }

    onReview = (isRecommended, selectedRecommendedList) => {
        this.setState({
            current: 3
        },() => this.setArticalList(isRecommended || false, selectedRecommendedList || []))
    }

    setArticalList = (isRecommended, selectedRecommendedList) => {
        let {selectedItem, selectedUsers, userList} = this.state;
        const articalList = []
        const items = isRecommended ? selectedRecommendedList : selectedItem
        items.forEach(item => {
            userList.forEach(user => {
                if (selectedUsers.indexOf(user.key) !== -1) {
                    const ifExists = articalList.find(artical => artical.objectID === item.id)
                    if(!ifExists){
                        let request = {
                            subReqId: "",
                            managerID: user.managerID,
                            requestedForID: user.userName,
                            requestedForDisplayName: user.displayName,
                            requestedForEmail: user.email,
                            objectType: item.type,
                            objectName: item.displayName,
                            objectID: item.id,
                            comments: "",
                            index: articalList.length,
                            startDate: item.startDate || '',
                            endDate: item.endDate || '',
                        };
                        articalList.push(request);
                    }
                }
            });
        })
        this.setState({
            articalList
        })
    }

    filterOption = (inputValue, option) => {
       return  option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    };


    getFiltered = () => {
        const {groupAndAppList, searchUser, catalogType} = this.state;
        if (!searchUser && !catalogType) {
            return groupAndAppList;
        }
        let filteredData = groupAndAppList || [];
        if (searchUser) {
            filteredData = filteredData.filter(x => {
                return ((x.displayName || '').toLowerCase().includes(searchUser.toLowerCase()));
            });
        }
        if (catalogType) {
            filteredData = filteredData.filter(x => {
                return (x.type.toLowerCase().includes(catalogType.toLowerCase()));
            });
        }
        return filteredData;
    }

    onSubmit = async () => {
        let {requestName,  action, articalList, isRequestHealthy, isSaved, groupAndAppList} = this.state;
        const requestedBy = getUserName();
        articalList = articalList.map(a => {
           const item = groupAndAppList.find(x => x.id === a.objectID);
           if (item) {
               a.startDate = item.startDate || '';
               a.endDate = item.endDate || '';
           }
           return a;
        });
        let minDate = articalList.filter(x => x.startDate).sort((x, y) => moment(x.startDate).isBefore(moment(y.startDate)) ? -1 : 1);
        let maxDate = articalList.filter(x => x.endDate).sort((x, y) => moment(x.endDate).isBefore(moment(y.endDate)) ? 1 : -1);
        
        let payload = {
            requestName,
            action,
            startDate: (minDate.length && minDate[0].startDate) || '',
            endDate: (maxDate.length && maxDate[0].endDate) || '',
            requestedBy,
            requestedByEmail: requestedBy,
            requestList: articalList,
            isRequestValidated: isRequestHealthy,
            parentReqid: isSaved ? ((articalList && articalList[0] && articalList[0].parentReqid) || "") : "",
        };

        try {

            const data = await ApiService.submitWorkflow(payload);
            const articleList = data.articleList || [];

            if(!(data && data.requestHealthy)){

                articleList.forEach((art, index) => {
                    art.objectID = art.entity.entityID
                    art.objectName = art.entity.entityName
                    art.objectType = art.entity.entityType
                    art.newComment = ""
                    art.index = index
                })

                this.setState({
                    articalList: articleList,
                    current: 3,
                    isRequestHealthy: true,
                    isSaved: true
                })
            } else {
                message.success('Requests submitted successfully!');
                setTimeout(() => {
                    window.location.href = `/iga/${this.props.match.params.clientId}/request/request-list`;
                }, 2000);
            }
        } catch (e) {
            return message.error('something is wrong! please try again');
        }

    }
    
    getColumns = () => {
      const getDescription = (displayName) => {
        if (displayName === 'Sales Analyst') {
          return 'Oracle IDCS Group for Sales Analyst with access to Oracle Sales Cloud and AWS';
        }
        return `Description Of ${displayName}`;
      };
        return [
            {
                render: (record) => (<span className='cursor-pointer ml-5'><a>{record.type === "Application" ?
                    <img src={require('../../images/application.png')} style={{width: 40}}/> :
                    <img src={require('../../images/group.png')} style={{width: 40}}/>}</a></span>),
                width: 100
            },

            {
                render: (record) => {
                    return <div>
                        <h4>{record.displayName}</h4>
                        <h6>{getDescription(record.displayName)}</h6>
                    </div>

                },
                width: "70%"
            },
            {
                render: (record) => {
                    return <div onClick={() => this.setState({infoModal: !this.state.infoModal, record})}>
                        <a><img src={require('../../images/info.png')} style={{width: 30}}/></a>
                    </div>

                },
                width: 100
            },
            {
                render: (record) => {
                    return <div>
                        <Button
                            className={this.state.selectedItem.some((x) => x.id === record.id) ? "add-to-cart-select square" : "  square "}
                            size={"small"} color="primary"
                            style={{minWidth: 240}}
                            onClick={() => this.addToCart(record)}><img
                            src={require('../../images/shopping-cart.png')} style={{width: 20}}
                            className="ml-10 mr-20"/>{this.state.selectedItem.some((x) => x.id === record.id) ? "Remove From Cart" : "Add To Cart"}  &nbsp;&nbsp;</Button>
                    </div>

                },
                width: "5%"
            },
            {
                render: (record) => {
                    return <div onClick={() => this.onDateModal(record)}>
                        <a><img src={require('../../images/clock-with-white-face.png')} style={{width: 30}}/></a>
                    </div>

                },
                width: 100,
                alignment: 'center'

            },
        ]
    }

    onDeleteUser = (record) => {
        let {articalList} = this.state;
        this.setState({
            articalList: articalList.filter((x) => x.requestedForID !== record.userName),
            isRequestHealthy: false
        });
    }

    onDeleteApp = (recordId) => {
        let {articalList} = this.state;
        articalList = articalList.filter(x => x.index !== recordId);
        this.setState({
            articalList,
            isRequestHealthy: false
        })
    }

    expandedRowRender = (mainRecord) => {
        const violationColumn = []
        if(this.state.isSaved){
            violationColumn.push(
                {
                    title: '',
                    render: (record) => {
                        return <span> {
                            ((record.sodViolations || []).length > 0 && !record.newComment) ?
                              <Tooltip placement="bottom" title="Policy Violation">
                                  <Icon type="exclamation-circle" className="color-red fs-18" />
                              </Tooltip> :
                                <Icon type="check-circle" className="color-green fs-18" /> } </span>
                    },
                    width: "10%",
                }
            )
        } else {
            violationColumn.push(
                {
                    title: '',
                    render: (record) => {
                        const name = record.displayName || record.objectName
                        return <span> {
                            ((name === "Payroll Manager" || name === "Human Resource Manager") && !record.newComment) ?
                                <Tooltip placement="bottom" title="Policy Violation">
                                    <Icon type="exclamation-circle" className="color-red fs-18" />
                                </Tooltip> :
                                null } </span>
                    },
                    width: "10%",
                }
            )
        }
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>{record && (record.displayName || record.objectName)}</span>
                },
                width: this.state.isSaved ? "50%" : "60%",
            },
            ...violationColumn,
            {
                title: 'Type',
                render: (record) => {
                    return <span>{record && (record.type || record.objectType)}</span>
                },
                width: "20%",
            },
            {
                title: "",
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() =>  this.onDeleteApp(record.index)}>Remove</Button>
                },
                width: "10%",
            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                width: '10%',
                align: 'right',
                render: (record) => {
                    return <span className='cursor-pointer'
                        onClick={() => this.onToggleComment(record.index, record.newComment)}
                    ><a><img
                        src={require('../../images/edit.png')} className="size-img"/></a></span>
                }
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={(mainRecord && mainRecord.requestList) || []}
                    pagination={{pageSize: 20}}
                />
            </Card>
        );
    };

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onCancel = () => {
        let { articalList, selectedItem, isSaved } = this.state
        if(!articalList.length || isSaved){
            selectedItem = []
        }
        this.setState({
            current: 2,
            articalList: [],
            selectedItem: [],
            userMappings: [],
            isSaved: false
        })
    }

    onChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        }, () => {
            if(name === "selectedAdvisor" && value === 1){
                let { groupAndAppList } = this.state
                const list = (groupAndAppList || []).filter((a, index) => index < 6)
                this.setState({
                    recommannedList: list
                })
            }
            if(name === "searchAdvisorUser"){

            }
        })
    }

    onSelectChange = (value) => {
        this.setState({
            catalogType: value
        })
    }

    onDatePickerChange = (date, dateString, name) => {
        this.setState({
            [name]: date,
        })
    }

    onEdit = () => {
        this.setState({
            current: 1,
        })
    }

    commentModal = () => {
        const {comment} = this.state;
        return (
            <Modal
                width={400}
                onCancel={this.onToggleComment}
                visible={this.state.isComment}
                footer={
                    <div>
                        <Button type="primary" onClick={this.onSaveComment}>Save</Button>
                        <Button  onClick={this.onCancelComment}>Cancel</Button>
                    </div>

                }
            >
                <div className="mr-15"><TextArea placeholder='Comments..' value={comment.text} onChange={this.onChangeComment}/></div>

            </Modal>
        )

    }

    onCancelComment = () => {
        this.setState({
            isComment: false,
            comment: {
                id: '',
                text:  '',
            }
        })
    }

    onChangeComment = (event) => {
        const {comment} = this.state;
        comment.text = event.target.value;
        this.setState({
            comment
        })
    }

    onSaveComment = () => {
        const {comment, articalList} = this.state;
        const index = articalList.findIndex(art => art.index === comment.id)
        if(index !== -1){
            articalList[index].newComment = comment.text;
        }
        this.setState({
            articalList,
            isComment: false,
            comment: {
                id: '',
                text:  '',
            }
        })
    }

    onToggleComment = (id, text) => {
        this.setState({
            isComment: !this.state.isComment,
            comment: {
                id,
                text: text || '',
            }
        });
    }

    isDisabled = () => {
        const { articalList } = this.state
        return articalList.some(art => {
            return ((art.sodViolations || []).length > 0 && !art.newComment)
        });
    }

    getUserMapping = () => {
        const userMappings = [];
        const {articalList} = this.state;
        let users = articalList.map(x => x.requestedForID);
        users = uniq(users);
        users.forEach(user => {
           const records = articalList.filter(x => x.requestedForID === user);
           userMappings.push({
               displayName: records[0].requestedForDisplayName,
               email: records[0].requestedForEmail,
               userName: records[0].requestedForID,
               requestList: records,
           })
        });
        return userMappings;

    }

    getUsersColumns = (isSelect) => {
        const cols = [
            {
                title: 'User Name',
                dataIndex: 'userName',
                width: '20%'
            },
            {
                title: 'Display Name',
                dataIndex: 'displayName',
                width: '20%'
            },
            {
                title: 'Department',
                dataIndex: 'department',
                width: '20%'
            },
            {
                title: 'Manager',
                dataIndex: 'managerDisplayName',
                width: '20%'
            }
        ]
        if(!isSelect){
            cols.unshift({
                title: '',
                dataIndex: 'id',
                width: '5%',
                render: (record, data) => {
                    return (
                      <Radio.Group name="selectedUser"  onChange={this.onChange} value={this.state.selectedUser}>
                          <Radio value={data.displayName} />
                      </Radio.Group>
                    )
                }
            })
        }
        return cols;
    }

    getSelectedUsersDetail = () => {
        const { transferSelectdUser, userList } = this.state
        let data = []

         if(transferSelectdUser.length){
             (transferSelectdUser || []).forEach(key => {
                 const userDetail = (userList || []).find(user => user.key === key)
                 data.push(userDetail)
             })
         }

        return data
    }

    onConfirmRecommand = () => {
        const {recommannedList, selectedItem} = this.state
        this.onReview(true, recommannedList)
    }

    onTabChange = (key) => {
        if(key === "2"){
            this.onChange({target: {name: 'selectedAdvisor', value: 1}})
        }
    }

    getFilteredUsersList = () => {
        const { allUsersList, searchAdvisorUser } = this.state;
        if(!searchAdvisorUser){
            return allUsersList
        }

        let filteredData = clonedeep(allUsersList);

        if(searchAdvisorUser){
            filteredData = allUsersList.filter(x => {
                return ['displayName'].some(y =>  (x[y] || '').toLowerCase().includes(searchAdvisorUser.toLowerCase()))
            });
        }

        return filteredData;
    }

    infoModal = () => {
        const { infoModal, record } = this.state;
        return (
            <Modal
                width={400}
                onCancel={() => this.setState({infoModal: !this.state.infoModal})}
                visible={infoModal}
                title="Information"
                footer={null}
            >
                <div className="mr-15">
                    <Row className="mt-10">
                        <Col md={6} sm={12} xs={12}>
                            <p><b>Risk Score: </b></p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <p>Medium</p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <p><b>Type: </b></p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <p>{record && record.type}</p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <p><b>Owner: </b></p>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <p>XELSYS</p>
                        </Col>
                    </Row>
                </div>

            </Modal>
        )

    }
  
    onDateModal = (record) => {
        this.setState({
          selectedDateRecord: record,
          clockModal: true
        });
    }
    
    onDateRangeChange = (dates) => {
      this.setState({
        selectedDateRecord: {
          ...this.state.selectedDateRecord,
          startDate: dates[0] ? moment(dates[0]).format('MM/DD/YYYY') : '',
          endDate: dates[1] ? moment(dates[1]).format('MM/DD/YYYY') : '',
        },
      });
    }
    
    onSubmitDateRange = () => {
      const {selectedDateRecord, articalList, groupAndAppList, recommannedList} = this.state;
      if (selectedDateRecord && selectedDateRecord.id) {
        if (selectedDateRecord && selectedDateRecord.id && (recommannedList || []).some(x => x.id === selectedDateRecord.id)) {
          const index = recommannedList.findIndex(x => x.id === selectedDateRecord.id);
          recommannedList[index] = {
            ...recommannedList[index],
            startDate: selectedDateRecord.startDate,
            endDate: selectedDateRecord.endDate,
          }
        }
        const findIndex = groupAndAppList.findIndex(x => x.id === selectedDateRecord.id);
        if (findIndex > -1) {
          groupAndAppList[findIndex] = {
            ...groupAndAppList[findIndex],
            startDate: selectedDateRecord.startDate,
            endDate: selectedDateRecord.endDate,
          }
        }
    
        this.setState({
          groupAndAppList,
          articalList,
          recommannedList,
          selectedDateRecord: null,
          clockModal: false
        })
      }
    }

    clockModal = () => {
        const { clockModal, selectedDateRecord } = this.state;
        if (!clockModal) {
            return null;
        }
        return (
            <Modal
                width={400}
                onCancel={() => this.setState({clockModal: !this.state.clockModal, selectedDateRecord: null})}
                visible={clockModal}
                title="Information"
                footer={
                    <div>
                        <Button  onClick={this.onSubmitDateRange}>Submit</Button>
                    </div>

                }
            >
                <div className="mr-15">
                    <RangePicker onChange={this.onDateRangeChange} format="MM/DD/YYYY" value={
                        [selectedDateRecord.startDate ? moment(selectedDateRecord.startDate) : null, selectedDateRecord.endDate ? moment(selectedDateRecord.endDate) : null]
                    }  />
                </div>

            </Modal>
        )

    }

    renderUserDetails = (details) => {
        return `${details.userName}, ${details.displayName}, ${details.email}`
    }

    render() {
        const {current, selectedUsers, isLoading, userList, catalogType, selectedItem, requestName, searchUser, action, selectedAdvisor, recommannedList, allUsersList} = this.state;

        const users = [];
        userList.forEach(user => {
            if (selectedUsers.indexOf(user.key) !== -1) {
                users.push({
                    ...user,
                })

            }
        });
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>Name: <b>{record.displayName}</b><br/> UserName: <b>{record.userName}</b></span>
                },
                width: "60%",

            },
            {
                render: (record) => {
                    return (
                        <span>Email: <b>{record.email}</b></span>);
                },
                width: "20%",

            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() => this.onDeleteUser(record)}>Remove</Button>
                },
                width: "10%",

            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                align: "right",
                render: () => {
                    return <span className='cursor-pointer'><a><img
                        src={require('../../images/comment.png')} style={{width: 18}}/></a></span>
                },
                width: "10%",
            }

        ];
        return (
            <div className="dashboard request">
                {this.infoModal()}
                {this.clockModal()}
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={10} sm={12} xs={12}>
                                        <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5"><a><img
                                                src={require("../../images/request.png")}
                                                style={{width: 40}}/></a></span>
                                            <h4 className="mt-10">{!this.isSelf() ? "Request For Others" : "Request For Self"}</h4>
                                        </Col>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ?
                                        <Spin className='custom-loading mt-50'/> :
                                        <>
                                            <Row className="mt-10">
                                                <Col md="12" sm="12">
                                                    <Row>
                                                        <Col md="12" sm="12">
                                                            {
                                                                current === 1 && !this.isSelf() ?
                                                                  <TableTransfer
                                                                    className="mt-20"
                                                                    dataSource={userList.map((user,i) => ({ id: i, key:i, ...user})) || []}
                                                                    targetKeys={selectedUsers}
                                                                    showSearch
                                                                    listStyle={{
                                                                      width: 525,
                                                                      height: 300,
                                                                      overflowY: 'auto'
                                                                    }}
                                                                    operations={['Select', 'Unselect']}
                                                                    onChange={this.handleUserChange}
                                                                    filterOption={this.filterOption}
                                                                    // onSelectChange={(value) => this.setState({transferSelectdUser: value || []})}
                                                                    leftColumns={this.getUsersColumns(true)}
                                                                    rightColumns={this.getUsersColumns(true)}
                                                                  /> : null
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {/*{
                                                    current === 1 && !this.isSelf() ?
                                                        <Col md="6" sm="12">
                                                            <Table className="mr-10" columns={this.getUsersColumns()}
                                                                   rowKey={"id"} size="small"
                                                                   dataSource={this.getSelectedUsersDetail()}/>
                                                        </Col> : null
                                                }*/}
                                            </Row>
                                            {
                                                (current === 2 || current === 1 && this.isSelf()) &&
                                                <Row>
                                                    <Col md="12" sm="12">
                                                        {
                                                            !this.isSelf() &&
                                                            <>
                                                                <Row className="align-items-center">
                                                                    <Col md={12} sm={12} xs={12}>
                                                                        <div className='user-header'
                                                                             style={{height: 35, paddingTop: 2}}>
                                                                            {
                                                                                (users || []).slice(0, 3).map((x, i) => {
                                                                                    return <span
                                                                                        className="mt-10 ml-10 fs-18">{x.displayName}</span>
                                                                                })

                                                                            }
                                                                            <span
                                                                                className="mt-20 ml-10 fs-18 ">&nbsp;{users.length > 3 ? `+${users.length - 3} more` : null}</span>
                                                                            <Button
                                                                                className=" add-to-cart edit square mt-5 pull-right mr-10"
                                                                                size={"small"}
                                                                                color="primary"
                                                                                onClick={this.onEdit}>Edit</Button>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                                <hr/>
                                                            </>
                                                        }
                                                        <Row className="mt-10">
                                                            <Col md={3} sm={12} xs={12}>
                                                                <Search
                                                                    placeholder="Search Catalog" value={searchUser}
                                                                    name="searchUser" onChange={this.onChange}
                                                                />
                                                            </Col>
                                                            <Col md={3} sm={12} xs={12}>
                                                                <Select
                                                                    style={{width: "100%"}}
                                                                    placeholder="Select Catalog Type"
                                                                    value={catalogType}
                                                                    name="catalogType"
                                                                    size="small"
                                                                    onChange={this.onSelectChange}

                                                                >
                                                                    <option value=''>All
                                                                    </option>
                                                                    <option value='Group'>Group
                                                                    </option>
                                                                    <option value='Application'>Application
                                                                    </option>
                                                                </Select>
                                                            </Col>
                                                            <Col md={6} sm={12} xs={12}>
                                                                <div className='text-right'>
                                                                    <Button className="square ml-10"
                                                                            size={"large"}
                                                                            color="primary"
                                                                            onClick={() => this.onSubmit(2)}
                                                                            disabled={!selectedItem.length}><span><img
                                                                        src={require('../../images/enter-arrow.png')}
                                                                        style={{width: 20}}
                                                                        className="ml-10 mr-10"/></span>Submit</Button>

                                                                    <Button className="square ml-10"
                                                                            size={"large"}
                                                                            color="primary"
                                                                            key={'btn'}
                                                                            onClick={() => this.onReview()}
                                                                            disabled={!selectedItem.length}><a><img
                                                                        src={require('../../images/shopping-cart.png')}
                                                                        style={{width: 20}}
                                                                        className="ml-10 mr-10"/></a>Review
                                                                       {selectedItem.length ? <span className="btn-round-label">{selectedItem.length}</span> : null}</Button>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        { this.isSelf() ?
                                                            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                                                                <TabPane tab="Standard" key="1">
                                                                    <Table dataSource={this.getFiltered()} rowKey={"id"}
                                                                           className="mt-20 main-table" size="small"
                                                                           columns={this.getColumns()}
                                                                           showHeader={false}/>
                                                                </TabPane>
                                                                <TabPane tab="Access Advisor" key="2">
                                                                    <Radio.Group name="selectedAdvisor" onChange={this.onChange} value={selectedAdvisor}>
                                                                        <Radio.Button value={1}>Recommendation</Radio.Button>
                                                                        <Radio.Button value={2}>Mirror user access</Radio.Button>
                                                                    </Radio.Group>
                                                                    {   this.isSelf() && (selectedAdvisor === 2) &&
                                                                        <Button
                                                                            disabled={selectedAdvisor === 2 ? !(this.state.selectedUser) : false}
                                                                            className="float-right" type="primary" onClick={this.onConfirmRecommand}
                                                                        >
                                                                            Review
                                                                        </Button>
                                                                    }
                                                                    {
                                                                        selectedAdvisor === 1 ?
                                                                            <Table rowKey={'id'} dataSource={recommannedList}
                                                                                   className="mt-20 main-table" size="small"
                                                                                   columns={this.getColumns()} showHeader={false}/> : null
                                                                    }
                                                                    {
                                                                        selectedAdvisor === 2 ?
                                                                            <div className="mt-20">
                                                                                <Search className="w-260"
                                                                                    placeholder="Search Users" value={this.state.searchAdvisorUser}
                                                                                    name="searchAdvisorUser" onChange={this.onChange}
                                                                                />
                                                                                <div className="mt-20" style={{overflowY: 'auto', height: 500}}>
                                                                                    <Table
                                                                                      className="mr-10"
                                                                                      columns={this.getUsersColumns()}
                                                                                      rowKey={"userName"}
                                                                                      size="small"
                                                                                      loading={this.state.isLoadingUsers}
                                                                                      dataSource={(this.getFilteredUsersList() || [])}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                             : null
                                                                    }

                                                                </TabPane>
                                                            </Tabs> :
                                                            <Table dataSource={selectedAdvisor === 1 ? recommannedList : this.getFiltered()}
                                                                   className="mt-20 main-table" size="small" rowKey={"id"}
                                                                   columns={this.getColumns()} showHeader={false}/>
                                                        }
                                                    </Col>
                                                </Row>

                                            }
                                            {
                                                current === 3 &&
                                                <Row>
                                                    {this.commentModal()}
                                                    <Col md={12} sm={12} xs={12}>
                                                        <div className='text-right'>
                                                            <Button className="square ml-10"
                                                                    size={"large"}
                                                                    color="primary" onClick={() => this.onSubmit(3)}
                                                                    disabled={this.isDisabled() || !(this.getUserMapping() || []).length}><span><img
                                                                src={require('../../images/enter-arrow.png')}
                                                                style={{width: 20}}
                                                                className="ml-10 mr-10"/></span>Submit</Button>
                                                            <Button className="square ml-10"
                                                                    size={"large"}
                                                                    color="primary"
                                                                    onClick={this.onCancel}><a><img
                                                                src={require('../../images/multiply.png')}
                                                                style={{width: 20}} className="ml-10 mr-10"/></a>Cancel</Button>
                                                        </div>
                                                    </Col>
                                                    <Col md={12} sm={12} xs={12} className="mt-10">
                                                        <div className="inner-profile-right">
                                                            <Table
                                                                columns={columns}
                                                                size="medium"
                                                                rowKey={'userName'}
                                                                className={`user-profile-data no-padding-table`}
                                                                expandedRowRender={this.expandedRowRender}
                                                                expandIcon={this.customExpandIcon}
                                                                dataSource={this.getUserMapping()}
                                                                defaultExpandAllRows
                                                                showHeader={false}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            }
                                        </>
                                }
                                <div className="mt-20">
                                    {   current === 1 && !selectedAdvisor && !this.isSelf() &&
                                        <Button
                                            disabled={!selectedUsers.length}
                                            className="float-right" type="primary" onClick={this.next}>
                                            Next
                                        </Button>
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default Request


