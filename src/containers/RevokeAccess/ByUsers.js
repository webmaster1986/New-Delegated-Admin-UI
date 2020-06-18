import React, {Component} from 'react';
import {Card, CardBody, Col, Row, CardHeader} from "reactstrap";
import {
    Input,
    Icon,
    Tabs, message
} from "antd";
import clonedeep from "lodash.clonedeep";
import {get} from 'lodash';
const {Search} = Input;
const { TabPane } = Tabs;
// import {ApiService, getUserName} from "../../services/ApiService";
import {ApiService, getUserName} from "../../services/ApiService1";
import RevokeAccessDataTable from "../GlobalComponents/RevokeAccessDataTable"
import '../GlobalComponents/Access.scss'
import '../Home/Home.scss'

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
    const i = index % 5;
    return colors[i] ? colors[i] : colors[0];
}

const groupsListArray = [
    { name: 'Group 1', description: 'Group 1 description', id: 0 },
    { name: 'Group 2', description: 'Group 2 description', id: 1 },
    { name: 'Group 3', description: 'Group 3 description', id: 2 },
    { name: 'Group 4', description: 'Group 4 description', id: 3 },
    { name: 'Group 5', description: 'Group 5 description', id: 4 },
    { name: 'Group 6', description: 'Group 6 description', id: 5 },
    { name: 'Group 7', description: 'Group 7 description', id: 6 },
    { name: 'Group 8', description: 'Group 8 description', id: 7 },
    { name: 'Group 9', description: 'Group 9 description', id: 8 },
    { name: 'Group 10', description: 'Group 10 description', id: 9 },
    { name: 'Group 11', description: 'Group 11 description', id: 10 },
]

class ByUsers extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSidebar: true,
            userList: [],
            groupList: [],
            selected: [],
            activeKey: '',
            searchUser: '',
            searchKey: ''
        };
    }

    componentDidMount() {
        this.getAllUsers()
    }

    getAllUsers = async () => {
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
            (data || []).forEach((x, i) => {
                x.key = i;
                // x.id = i;
                x.color = getColor(i)
            })
            this.setState({
                userList: data || [],
                activeKey: data && data.length ? data[0].id : '',
                isLoading: false,
            }, () => this.onSetupGroupData())
        }
    }

    onSetupGroupData = () => {
        const groupList = clonedeep(groupsListArray)
        groupList.forEach(x => {
            x.prevAction = x.action ? x.action : 'required';
            x.action = x.action ? x.action : 'required';
        })
        this.setState({
            groupList
        })
    }

    onSidebarChange = () => {
        this.setState({
            isSidebar: !this.state.isSidebar
        })
    }

    getFilteredUsers = () => {
        const {userList, searchUser} = this.state;
        if (!searchUser) {
            return userList;
        }
        let filteredUserData = userList || [];
        filteredUserData = filteredUserData.filter(x => {
            const firstname = x && x.firstname || "";
            const lastName = x && x.lastName || "";
            return firstname.toLowerCase().includes(searchUser.toLowerCase()) || lastName.toLowerCase().includes(searchUser.toLowerCase());
        });
        return filteredUserData;
    }

    onChangeTab = (newActiveKey) => {
        this.setState({
            activeKey: newActiveKey,
            selected: []
        }, () => this.onSetupGroupData())
    }

    onNextUser = () => {
        const {userList, activeKey} = this.state;
        const mainRecordIndex = userList.findIndex(x => x.id === activeKey);
        if (mainRecordIndex < userList.length - 1) {
            const nextUser = userList[mainRecordIndex + 1];
            this.onChangeTab(nextUser.id)
        }
    }

    onPrevUser = () => {
        const {userList, activeKey} = this.state;
        const mainRecordIndex = userList.findIndex(x => x.id === activeKey);
        if (mainRecordIndex) {
            const prevUser = userList[mainRecordIndex - 1];
            this.onChangeTab(prevUser.id)
        }
    }

    getFilterData = () => {
        const { filter, searchKey, groupList } = this.state;
        if (!filter && !searchKey) {
            return groupList;
        }

        let filteredData = clonedeep(groupList);

        if(searchKey){
            filteredData = filteredData.filter(x => {
                return (x.name.toLowerCase().includes(searchKey.toLowerCase()) || x.description.toLowerCase().includes(searchKey.toLowerCase()))
            });
        }

        return filteredData;
    }

    onCheckBoxChange = (key, event) => {
        let { selected } = this.state;
        if (event.target.checked && !selected.includes(key)) {
            selected.push(key);
        } else {
            selected = selected.filter(x => x !== key);
        }
        this.setState({
            selected
        })
    }

    undoDecision = (entId) => {
        const { groupList } = this.state;
        if (groupList[entId]) {
            groupList[entId].action = groupList[entId].prevAction;
        }
        this.setState({
            groupList
        });
    }

    onUpdateStatus = (index, action) => {
        const { groupList } = this.state;
        const currentAction = groupList[index].action;
        groupList[index].action = (currentAction === action ? 'required' : action);
        this.setState({
            groupList
        });
    }

    onSelectAll = (e) => {
        let { groupList, selected } = this.state;
        if (e.target.checked) {
            selected = groupList.map((x,i) => i);
            this.setState({
                selected,
            })
        } else {
            this.setState({
                selected: [],
            })
        }
    }

    confirmRevokeSelected = () => {
        const {selected, groupList} = this.state;
        if (selected.length) {
            selected.forEach((x) => {
                groupList[x].action = groupList[x].action === 'required' ? 'rejected' : groupList[x].action;
            });
        }
        this.setState({groupList})
    }

    getChangedCount = () => {
        const { groupList } = this.state;
        if (!groupList || groupList.length === 0) {
            return 0;
        }
        return groupList.filter(group => {
            return get(group, 'action') !== get(group, 'prevAction')
        }).length;
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        const { isSidebar, userList, activeKey, selected, searchKey, searchUser } = this.state;
        const getInitials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = (userList || []).find(x => x.id === activeKey) || {};
        const changedCount = this.getChangedCount()
        return (
            <div className="user-detail-page">
                { !isSidebar ?
                    <div className="text-right color-white mt-50">
                        <Icon
                            type="right"
                            className="fs-30 cursor-pointer color-black"
                            onClick={this.onSidebarChange}
                        />
                    </div> : null
                }
                { isSidebar ?
                    <div className="custom-side-bar">
                        <div className="text-right color-white mr-15">
                            <Icon
                                type="close"
                                className="fs-20 cursor-pointer"
                                onClick={this.onSidebarChange}
                            />
                        </div>
                        <div className="user-search">
                            <Search
                                name="searchUser"
                                size="small"
                                placeholder="Search Name"
                                value={searchUser}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="inner-profile">
                            <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow"/>
                            <Icon type="right" onClick={this.onNextUser} className="profile-nav-arrow right-arrow"/>
                            <div className="text-center overflow-hidden">
                                <div className="initial-name-inner-profile"
                                     style={{background: mainRecord && mainRecord.color || 'red'}}>{(mainRecord && mainRecord.firstname || 'A').substr(0, 1)}{(mainRecord && mainRecord.lastName || 'B').substr(0, 1)}</div>
                                <div
                                    className="UName">{mainRecord && mainRecord.firstname} {mainRecord && mainRecord.lastName}</div>
                                <div
                                    className="UDesignation">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Title}</div>
                                <div
                                    className="UDesignation mb-10">{mainRecord && mainRecord.emails}</div>
                                <div className="box-part-a">
                                    <div>
                                        <span>Identity: </span><b>{mainRecord && mainRecord.userInfo && mainRecord.userInfo.UserName}</b>
                                    </div>
                                    <div>
                                        <span>Department: </span><b>{mainRecord && mainRecord.department}</b>
                                    </div>
                                    {/*<div>
                                        <span>Hire Date: </span><b></b>
                                    </div>*/}
                                </div>
                                <div className="box-part-a overflow-auto">
                                    <div className="float-left">
                                        <div>
                                            <span>Applications: </span><b>{mainRecord && mainRecord.noOfApplications}</b>
                                        </div>
                                        <div>
                                            <span>Entitlements: </span><b>{mainRecord && mainRecord.numOfEntitlements}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                (this.getFilteredUsers() || []).length ?
                                    <Tabs
                                        activeKey={activeKey}
                                        tabPosition={"right"}
                                        className='custom-font-size mt-20 user-tab-list'
                                        onChange={this.onChangeTab}
                                    >
                                        {
                                            (this.getFilteredUsers() || []).map((item) => {
                                                const firstName = item && item.firstname
                                                const lastName = item && item.lastName
                                                return (
                                                    <TabPane
                                                        tab={
                                                            <div className="user-list-item">
                                                               <span className="initialName mr-10"
                                                                     style={{background: item.color || 'red'}}>
                                                                   {getInitials(firstName, lastName)}
                                                               </span>
                                                               <span className="initial-name">
                                                                    {firstName}{' '}{lastName}
                                                               </span>
                                                            </div>
                                                        }
                                                        key={item.id}
                                                        type="card"
                                                    >
                                                    </TabPane>
                                                )
                                            })
                                        }
                                    </Tabs> :
                                    <div className="no-user-found color-white text-center mt-10">
                                        No Users Found
                                    </div>
                            }
                        </div>
                    </div> : null
                }

                <div className="dashboard overflow">
                    <RevokeAccessDataTable
                        dataType={"user"}
                        userList={userList}
                        groupList={this.state.groupList}
                        activeKey={activeKey}
                        getFilterData={this.getFilterData}
                        onCheckBoxChange={this.onCheckBoxChange}
                        undoDecision={this.undoDecision}
                        onUpdateStatus={this.onUpdateStatus}
                        onSelectAll={this.onSelectAll}
                        confirmRevokeSelected={this.confirmRevokeSelected}
                        onChange={this.onChange}
                        searchKey={searchKey}
                        selected={selected}
                        changedCount={changedCount}
                        submitData={() => {}}
                    />
                </div>
            </div>
        )
    }

}

export default ByUsers