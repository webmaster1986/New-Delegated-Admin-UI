import React, {Component} from 'react';
import {
    Input,
    Icon,
    Tabs, message
} from "antd";
import clonedeep from "lodash.clonedeep";
import {get} from 'lodash';
const {Search} = Input;
const { TabPane } = Tabs;
import {ApiService, getUserName} from "../../services/ApiService";
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

class ByGroups extends Component {
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
            searchGroup: '',
            searchKey: ''
        };
    }

    componentDidMount() {
        this.onSetupGroupData()
    }

    onSetupGroupData = () => {
        const groupList = clonedeep(groupsListArray)
        groupList.forEach((x, i) => {
            x.key = i;
            x.id = i;
            x.color = getColor(i)
        })
        this.setState({
            groupList,
            activeKey: groupList && groupList.length ? groupList[0].name : '',
        }, () => this.getAllUsers())
    }

    getAllUsers = async () => {
        this.setState({
            isLoading: true,
            isLoadingUsers: true
        });
        const payload = {
            userName: "",
            managerRequired: ""
        };
        const data = await ApiService.getUsersWorkflow(payload)

        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            (data || []).forEach((x, i) => {
                x.key = i;
                x.id = i;
                x.prevAction = x.action ? x.action : 'required';
                x.action = x.action ? x.action : 'required';
            })
            this.setState({
                userList: data || [],
                isLoading: false,
            })
        }
    }

    onSidebarChange = () => {
        this.setState({
            isSidebar: !this.state.isSidebar
        })
    }

    getFilteredGroups = () => {
        const {groupList, searchGroup} = this.state;
        if (!searchGroup) {
            return groupList;
        }
        let filteredGroupData = groupList || [];
        filteredGroupData = filteredGroupData.filter(x => {
            const name = x && x.name;
            return name.toLowerCase().includes(searchGroup.toLowerCase());
        });
        return filteredGroupData;
    }

    onChangeTab = (newActiveKey) => {
        this.setState({
            activeKey: newActiveKey,
            selected: []
        }, () => this.getAllUsers())
    }

    onNextUser = () => {
        const {groupList, activeKey} = this.state;
        const mainRecordIndex = groupList.findIndex(x => x.name === activeKey);
        if (mainRecordIndex < groupList.length - 1) {
            const nextUser = groupList[mainRecordIndex + 1];
            this.onChangeTab(nextUser.name)
        }
    }

    onPrevUser = () => {
        const {groupList, activeKey} = this.state;
        const mainRecordIndex = groupList.findIndex(x => x.name === activeKey);
        if (mainRecordIndex) {
            const prevUser = groupList[mainRecordIndex - 1];
            this.onChangeTab(prevUser.name)
        }
    }

    getFilterData = () => {
        const { filter, searchKey, userList } = this.state;
        if (!filter && !searchKey) {
            return userList;
        }

        let filteredData = clonedeep(userList);

        if(searchKey){
            filteredData = filteredData.filter(x => {
                return ((x.givenName || "").toLowerCase().includes(searchKey.toLowerCase()) || (x.familyName || "").toLowerCase().includes(searchKey.toLowerCase()) || (x.userName || "").toLowerCase().includes(searchKey.toLowerCase()) ||
                    (x.email || "").toLowerCase().includes(searchKey.toLowerCase()) || (x.department || "").toLowerCase().includes(searchKey.toLowerCase()))
            });
        }

        return filteredData;
    }

    onCheckBoxChange = (id, event) => {
        let { selected } = this.state;
        if (event.target.checked && !selected.includes(id)) {
            selected.push(id);
        } else {
            selected = selected.filter(x => x !== id);
        }
        this.setState({
            selected
        })
    }

    undoDecision = (entId) => {
        const { userList } = this.state;
        if (userList[entId]) {
            userList[entId].action = userList[entId].prevAction;
        }
        this.setState({
            userList
        });
    }

    onUpdateStatus = (index, action) => {
        const { userList } = this.state;
        const currentAction = userList[index].action;
        userList[index].action = (currentAction === action ? 'required' : action);
        this.setState({
            userList
        });
    }

    onSelectAll = (e) => {
        let { userList, selected } = this.state;
        if (e.target.checked) {
            selected = userList.map((x,i) => i);
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
        const {selected, userList} = this.state;
        if (selected.length) {
            selected.forEach((x) => {
                userList[x].action = userList[x].action === 'required' ? 'rejected' : userList[x].action;
            });
        }
        this.setState({userList})
    }

    getChangedCount = () => {
        const { userList } = this.state;
        if (!userList || userList.length === 0) {
            return 0;
        }
        return userList.filter(group => {
            return get(group, 'action') !== get(group, 'prevAction')
        }).length;
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        const { isSidebar, userList, groupList, activeKey, selected, searchKey, searchGroup } = this.state;
        const getInitials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = groupList && groupList.length ? (groupList || []).find(x => x.name === activeKey) : {};
        const array = mainRecord && mainRecord.name && mainRecord.name.length ? (mainRecord.name || []).split(" ") : []
        const firstName = array && array.length && array[0] || ""
        const lastName = array && array.length && array[1] || ""
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
                                name="searchGroup"
                                size="small"
                                placeholder="Search Name"
                                value={searchGroup}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="inner-profile">
                            <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow"/>
                            <Icon type="right" onClick={this.onNextUser} className="profile-nav-arrow right-arrow"/>
                            <div className="text-center overflow-hidden">
                                <div className="initial-name-inner-profile"
                                     style={{background: mainRecord && mainRecord.color || 'red'}}>{(firstName || 'A').substr(0, 1)}{(lastName || 'B').substr(0, 1)}</div>
                                <div
                                    className="UName">{firstName} {lastName}</div>
                                <div
                                    className="UDesignation">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Title}</div>
                                <div
                                    className="UDesignation mb-10">{mainRecord && mainRecord.email}</div>
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
                                (this.getFilteredGroups() || []).length ?
                                    <Tabs
                                        activeKey={activeKey}
                                        tabPosition={"right"}
                                        className='custom-font-size mt-20 user-tab-list'
                                        onChange={this.onChangeTab}
                                    >
                                        {
                                            (this.getFilteredGroups() || []).map((item) => {
                                                const array = item.name.split(" ")
                                                const first = array && array.length && array[0] || ""
                                                const last = array && array.length && array[1] || ""
                                                return (
                                                    <TabPane
                                                        tab={
                                                            <div className="user-list-item">
                                                               <span className="initialName mr-10"
                                                                     style={{background: item.color || 'red'}}>
                                                                   {getInitials(first, last)}
                                                               </span>
                                                               <span className="initial-name">
                                                                    {first}{' '}{last}
                                                               </span>
                                                            </div>
                                                        }
                                                        key={item.name}
                                                        type="card"
                                                    >
                                                    </TabPane>
                                                )
                                            })
                                        }
                                    </Tabs> :
                                    <div className="no-user-found color-white text-center mt-10">
                                        No Groups Found
                                    </div>
                            }
                        </div>
                    </div> : null
                }

                <div className="dashboard overflow">
                    <RevokeAccessDataTable
                        dataType={"group"}
                        userList={groupList}
                        groupList={this.state.userList}
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

export default ByGroups