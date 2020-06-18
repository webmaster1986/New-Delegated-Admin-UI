import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import {
    message,
    Spin,
    Button,
    Input,
    Table,
    Icon,
    Tabs,
    Radio
} from "antd";
const {Search} = Input;
const {TabPane} = Tabs;
// import {ApiService, getUserName} from "../../services/ApiService";
import {ApiService} from "../../services/ApiService1";
import CopyGroupsModal from "./CopyGroupsModal"
import TableTransfer from "../GlobalComponents/TableTransfer";
import clonedeep from "lodash.clonedeep";
import '../GlobalComponents/Access.scss'
import '../Home/Home.scss'


class ByGroups extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            isLoading: false,
            isSaving: false,
            copyGroupModal: false,
            userList: [],
            selectedGroupsKeys: [],
            selectedGroups: [],
            selectedItem: [],
            search: '',
            selectedAdvisor: '',
            searchAdvisorGroup: '',
            groupList: [],
        };
    }

    componentDidMount() {
        this.getAllUsers()
        this.getAllGroups()
    }

    getAllUsers = async () => {
        const {userList} = this.state
        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });

        const data = await this._apiService.getAllUsers()

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
                    key: i
                };
                userList.push(obj)
            })
            this.setState({
                userList,
                isLoading: false,
            })
        }
    }

    getAllGroups = async () => {
        let groupList = []
        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });
        const data = await this._apiService.getGroups(`?members=true`)

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
                    key: i
                };
                groupList.push(obj)
            })
            this.setState({
                groupList
            })
        }
    }

    handleGroupChange = selectedGroupsKeys => {
        const { groupList } = this.state
        let selectedGroups = []
        if(selectedGroupsKeys.length) {
            selectedGroupsKeys.forEach(select => {
                selectedGroups.push(groupList[select])
            })
        } else {
            selectedGroups = []
        }
        this.setState({
            selectedGroupsKeys,
            selectedGroups
        });
    };

    getGroupsColumns = (isSelect) => {
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.displayName)}</span>
                },
            },
            {
                title: 'Description',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.description)}</span>
                },
            }
        ]
        if(!isSelect){
            columns.unshift({
                title: '',
                dataIndex: 'id',
                width: '5%',
                render: (record, data) => {
                    return (
                        <Radio.Group name="selectedUser"  onChange={this.onChange} value={this.state.selectedUser}>
                            <Radio value={data.id} />
                        </Radio.Group>
                    )
                }
            })
        }
        return columns
    }

    filterOption = (inputValue, option) => {
        return  option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    };

    next = () => {
        const current = this.state.current + 1;
        this.setState({
            current,
        });
    }

    getFiltered = (isRecommand) => {
        const { search, userList } = this.state
        let arrayList = clonedeep(userList) || [];
        if(!search) {
            if(!isRecommand) {
                arrayList = arrayList.slice(0, 5)
            }
            return arrayList
        }

        arrayList = arrayList.filter(x => {
            const displayName = x && x.displayName || "";
            const userName = x && x.userName || "";
            const email = x && x.email || "";
            return displayName.toLowerCase().includes(search.toLowerCase()) || userName.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
        });
        if(!isRecommand) {
            arrayList = arrayList.slice(0, 5)
        }
        return arrayList || []
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
        })
    }

    getColumns = () => {
        return [
            {
                render: (record) => (<span className='cursor-pointer ml-5'>
                    <a><img src={require('../../images/user.png')} style={{width: 40}}/></a></span>),
                width: 100
            },

            {
                render: (record) => {
                    return <div className="ws-nowrap">
                        <h4>{record.displayName}</h4>
                        <h6>{record.email}</h6>
                    </div>

                },
                width: "80%"
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
            }
        ]
    }

    expandedRowRender = (mainRecord) => {
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span className="ws-nowrap">{record.displayName}</span>
                },
                width: "25%",
            },
            {
                title: 'UserName',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.userName)}</span>
                },
                width: "25%",
            },
            {
                title: 'Email',
                render: (record) => {
                    return <span className="ws-nowrap">{record && (record.emails)}</span>
                },
                width: "30%",
            },
            {
                title: "",
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() => this.onDeleteUser(mainRecord.key, record.id)}>Remove</Button>
                },
                width: "10%",
            },
            {
                title: "",
                width: '10%'
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={(mainRecord && mainRecord.users) || []}
                    pagination={{pageSize: 20}}
                />
            </Card>
        );
    };

    onReview = () => {
        const { selectedGroups, selectedItem } = this.state
        selectedGroups.forEach(f => {
            f.users = Object.assign([], selectedItem);
        })
        this.setState({
            current: 3,
            selectedGroups
        })
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onDeleteGroup = (key) => {
        let { selectedGroups, selectedGroupsKeys } = this.state
        selectedGroups = selectedGroups.filter(x => x.key !== key)
        selectedGroupsKeys = selectedGroupsKeys.filter(x => x !== key)
        this.setState({
            selectedGroups,
            selectedGroupsKeys
        })
    }

    onDeleteUser = (index, childIndex) => {
        let { selectedGroups } = this.state
        const userIndex = selectedGroups.findIndex(x => x.key === index)
        if(userIndex !== -1) {
            selectedGroups[userIndex].users = selectedGroups[userIndex].users.filter(x => x.id !== childIndex)
        }
        this.setState({
            selectedGroups
        })
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onCopyGroupModal = () => {
        this.setState({
            copyGroupModal: !this.state.copyGroupModal
        })
    }

    onTabChange = (key) => {
        if(key === "2"){
            this.onChange({target: {name: 'selectedAdvisor', value: 1}})
        }
    }

    getFilteredGroupsList = () => {
        const { groupList, searchAdvisorGroup } = this.state;
        if(!searchAdvisorGroup){
            return groupList
        }

        let filteredData = clonedeep(groupList);

        if(searchAdvisorGroup){
            filteredData = filteredData.filter(x => {
                return ['displayName'].some(y =>  (x[y] || '').toLowerCase().includes(searchAdvisorGroup.toLowerCase()))
            });
        }

        return filteredData;
    }

    onCopyGroups = (idList) => {
        let { selectedGroups, selectedGroupsKeys, groupList } = this.state
        idList.forEach(id => {
            const object = groupList.find(x => x.id === id) || {}
            if(object && object.hasOwnProperty("key") && !(selectedGroupsKeys.includes(object.key))) {
                selectedGroupsKeys.push(object.key)
                selectedGroups.push(object)
            }
        })
        this.setState({
            selectedGroups,
            selectedGroupsKeys,
            copyGroupModal: false
        })
    }

    onSubmit = async () => {
        const { selectedGroups } = this.state
        const payload = { groups: [] }
        selectedGroups.forEach(group => {
            if((group.users || []).length) {
                let object = {
                    groupId: group.id,
                    users: []
                }
                group.users.forEach(user => {
                    object.users.push({userId: user.id})
                })
                payload.groups.push(object)
            }
        })
        this.setState({
            isSaving: true
        })
        const data = await this._apiService.addUserToGroup(payload)
        if (!data || data.error) {
            this.setState({
                isLoading: false,
                isSaving: false
            });
            return message.error('something is wrong! please try again');
        } else {
            message.success(data || "Successfully updated");
            this.setState({
                isSaving: false
            })
        }
    }

    render() {
        const { isLoading, search, selectedGroupsKeys, current, userList, selectedItem, selectedGroups, groupList, copyGroupModal, selectedAdvisor, searchAdvisorGroup, isSaving } = this.state;

        const groups = [];
        groupList.forEach(group => {
            if (selectedGroupsKeys.indexOf(group.key) !== -1) {
                groups.push({
                    ...group,
                })

            }
        });

        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span className="ws-nowrap">Name: <b>{record.displayName}</b></span>
                },
                width: "50%",

            },
            {
                title: 'Description',
                render: (record) => {
                    return (
                        <span className="ws-nowrap">Description: <b>{record.description}</b></span>);
                },
                width: "30%",

            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                render: (record) => {
                    return <Button size={"default"} type="danger" onClick={() => this.onDeleteGroup(record.key)}>Remove</Button>
                },
                width: "10%",

            },
            {
                title: "",
                width: "10%",
            }

        ];

        return (
            <div className="dashboard request">
                { copyGroupModal ? <CopyGroupsModal userList={userList}  groupsList={groupList} onClose={this.onCopyGroupModal} onCopyGroups={this.onCopyGroups}/> : null }
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='custom-card-header'>
                                <Row className="main-div">
                                    <Col md={6} sm={12} xs={12} className="d-flex">
                                            <span className="cursor-pointer ml-5 mr-5">
                                                <a>
                                                    <img src={require("../../images/request.png")} style={{width: 40}}/>
                                                </a>
                                            </span>
                                        <h4 className="mt-10">Grant Access By Groups</h4>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        {
                                            current === 1 ?
                                                <div className="text-right">
                                                    <Button
                                                        className="square mr-10"
                                                        size={"large"}
                                                        color="primary"
                                                        onClick={this.onCopyGroupModal}
                                                    >
                                                        Copy Groups from a User
                                                    </Button>
                                                </div> : null
                                        }
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    isLoading ?
                                        <Spin className='custom-loading mt-50'/> :
                                        <Row className="mt-10">
                                            <Col md="12" sm="12">
                                                <Row>
                                                    <Col md="12" sm="12">
                                                        {
                                                            current === 1 ?
                                                                <TableTransfer
                                                                    className="mt-20"
                                                                    dataSource={groupList || []}
                                                                    targetKeys={selectedGroupsKeys}
                                                                    showSearch
                                                                    listStyle={{
                                                                        width: 525,
                                                                        // height: 300,
                                                                        overflowY: 'auto'
                                                                    }}
                                                                    operations={['Select', 'Unselect']}
                                                                    onChange={this.handleGroupChange}
                                                                    filterOption={this.filterOption}
                                                                    leftColumns={this.getGroupsColumns(true)}
                                                                    rightColumns={this.getGroupsColumns(true)}
                                                                /> : null
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                }
                                <div className="mt-20">
                                    { current === 1 &&
                                        <Button
                                            disabled={!selectedGroupsKeys.length}
                                            className="square float-right"
                                            type="primary"
                                            onClick={this.next}
                                        >
                                            Next
                                        </Button>
                                    }
                                </div>
                                {
                                    current === 2 &&
                                    <Row>
                                        <Col md="12" sm="12">
                                            <Row className="align-items-center">
                                                <Col md={12} sm={12} xs={12}>
                                                    <div className='user-header' style={{height: 35, paddingTop: 2}}>
                                                        {
                                                            (groups || []).slice(0, 3).map((x, i) => {
                                                                return <span className="mt-10 ml-10 fs-18" key={i.toString()}>{x.displayName}{i === 2 ? "" : ","}</span>
                                                            })
                                                        }
                                                        <span className="mt-20 ml-10 fs-18 ">&nbsp;{groups.length > 3 ? `+${groups.length - 3} more` : null}</span>
                                                        <Button
                                                            className=" add-to-cart edit square mt-5 pull-right mr-10"
                                                            size={"small"}
                                                            color="primary"
                                                            onClick={() => this.setState({current: 1})}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row className="mt-10">
                                                <Col md={3} sm={12} xs={12}>
                                                    <Search
                                                        placeholder="Search User"
                                                        value={search}
                                                        name="search"
                                                        onChange={this.onChange}
                                                    />
                                                </Col>
                                                <Col md={3} sm={12} xs={12}>
                                                    {/*<Select
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
                                                    </Select>*/}
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <div className='text-right'>
                                                        {/*<Button className="square ml-10"
                                                                size={"large"}
                                                                color="primary"
                                                                onClick={() => this.onSubmit(2)}
                                                                disabled={!selectedItem.length}><span><img
                                                            src={require('../../images/enter-arrow.png')}
                                                            style={{width: 20}}
                                                            className="ml-10 mr-10"/></span>Submit</Button>*/}

                                                        <Button
                                                            className="square ml-10"
                                                            size={"large"}
                                                            color="primary"
                                                            key={'btn'}
                                                            onClick={this.onReview}
                                                            disabled={!selectedItem.length}><a><img
                                                            src={require('../../images/shopping-cart.png')}
                                                            style={{width: 20}}
                                                            className="ml-10 mr-10"/></a>Review
                                                            {selectedItem.length ? <span className="btn-round-label">{selectedItem.length}</span> : null}</Button>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                                                <TabPane tab="Standard" key="1">
                                                    <Table
                                                        dataSource={this.getFiltered(true)}
                                                        className="mt-20 main-table"
                                                        size="small"
                                                        rowKey={"id"}
                                                        columns={this.getColumns()}
                                                        showHeader={false}
                                                    />
                                                </TabPane>
                                                <TabPane tab="Access Advisor" key="2">
                                                    <Radio.Group name="selectedAdvisor" onChange={this.onChange} value={selectedAdvisor}>
                                                        <Radio.Button value={1}>Recommendation</Radio.Button>
                                                        <Radio.Button value={2}>Mirror access</Radio.Button>
                                                    </Radio.Group>
                                                    {
                                                        selectedAdvisor === 2 ?
                                                            <div className="mt-20">
                                                                <Search
                                                                    className="w-260"
                                                                    placeholder="Search Group"
                                                                    value={searchAdvisorGroup}
                                                                    name="searchAdvisorGroup"
                                                                    onChange={this.onChange}
                                                                />
                                                                <div className="mt-20" style={{overflowY: 'auto', height: 500}}>
                                                                    <Table
                                                                        className="mr-10"
                                                                        columns={this.getGroupsColumns(false)}
                                                                        rowKey={"name"}
                                                                        size="small"
                                                                        dataSource={this.getFilteredGroupsList()}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            <Table
                                                                dataSource={this.getFiltered(false)}
                                                                className="mt-20 main-table"
                                                                size="small"
                                                                rowKey={"id"}
                                                                columns={this.getColumns()}
                                                                showHeader={false}
                                                            />
                                                    }
                                                </TabPane>
                                            </Tabs>

                                        </Col>
                                    </Row>
                                }
                                {
                                    current === 3 &&
                                    <Row>
                                        <Col md={12} sm={12} xs={12}>
                                            <div className='text-right'>
                                                <Button
                                                    className="square ml-10"
                                                    size={"large"}
                                                    color="primary"
                                                    onClick={this.onSubmit}
                                                    disabled={isSaving}
                                                >
                                                    <span>
                                                        {
                                                            isSaving ?
                                                                <Spin className='color-white mr-10'/> :
                                                                <img src={require('../../images/enter-arrow.png')} style={{width: 20}} className="ml-10 mr-10"/>
                                                        }
                                                    </span>
                                                    Submit
                                                </Button>
                                                <Button
                                                    className="square ml-10"
                                                    size={"large"}
                                                    color="primary"
                                                    onClick={() => this.setState({current: 2})}
                                                    disabled={isSaving}
                                                >
                                                    <a>
                                                        <img src={require('../../images/multiply.png')} style={{width: 20}} className="ml-10 mr-10"/>
                                                    </a>Cancel
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col md={12} sm={12} xs={12} className="mt-10">
                                            <div className="inner-profile-right">
                                                <Table
                                                    columns={columns}
                                                    size="medium"
                                                    rowKey={'id'}
                                                    className={`user-profile-data no-padding-table`}
                                                    expandedRowRender={this.expandedRowRender}
                                                    expandIcon={this.customExpandIcon}
                                                    dataSource={selectedGroups}
                                                    defaultExpandAllRows
                                                    showHeader={false}
                                                    scroll={{x:992}}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default ByGroups