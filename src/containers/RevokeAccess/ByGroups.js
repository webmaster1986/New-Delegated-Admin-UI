import React, {Component} from 'react';
import {
    Input,
    Icon,
    Tabs, message, Spin
} from "antd";
import clonedeep from "lodash.clonedeep";
import {get} from 'lodash';
const {Search} = Input;
const { TabPane } = Tabs;
import {ApiService} from "../../services/ApiService1";
import RevokeAccessDataTable from "../GlobalComponents/RevokeAccessDataTable"
import '../GlobalComponents/Access.scss'
import '../Home/Home.scss'

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
    const i = index % 5;
    return colors[i] ? colors[i] : colors[0];
}


class ByGroups extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSidebar: true,
            isSaving: false,
            isLoadingGroups: false,
            isLoadingUsers: false,
            userList: [],
            groupList: [],
            selected: [],
            activeKey: '',
            searchGroup: '',
            searchKey: ''
        };
    }

    componentDidMount() {
        this.getAllGroups()
    }

    getAllGroups = async () => {
        let groupList = []
        this.setState({
            isLoading: true,
            isLoadingGroups: true
        });
        const data = await this._apiService.getGroups(`?members=true`)

        if (!data || data.error) {
            this.setState({
                isLoading: false,
                isLoadingGroups: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let obj = {};
            (data || []).forEach((x, i) => {
                obj = {
                    ...x,
                    key: i,
                    color: getColor(i)
                };
                groupList.push(obj)
            })
            const activeKey = groupList && groupList.length ? groupList[0].id : ''
            this.setState({
                groupList,
                activeKey,
                isLoadingGroups: false
            }, () => this.getAllUsers(activeKey))
        }
    }

    getAllUsers = async (activeKey) => {
        this.setState({
            isLoadingUsers: true
        })
        const { groupList } = this.state
        const object = (groupList || []).find(x => x.id === activeKey) || {}
        if(object && (object.members || []).length) {
            object.members.forEach((x, i) => {
                x.key = i;
                x.id = i;
                x.prevAction = x.action ? x.action : 'required';
                x.action = x.action ? x.action : 'required';
            })
        }
        this.setState({
            userList: object.members || [],
            isLoading: false,
            isLoadingUsers: false
        })
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
            const name = x && x.displayName || "";
            return name.toLowerCase().includes(searchGroup.toLowerCase());
        });
        return filteredGroupData;
    }

    onChangeTab = (newActiveKey) => {
        this.setState({
            activeKey: newActiveKey,
            selected: []
        }, () => this.getAllUsers(newActiveKey))
    }

    onNextUser = () => {
        const {groupList, activeKey} = this.state;
        const mainRecordIndex = groupList.findIndex(x => x.id === activeKey);
        if (mainRecordIndex < groupList.length - 1) {
            const nextUser = groupList[mainRecordIndex + 1];
            this.onChangeTab(nextUser.id)
        }
    }

    onPrevUser = () => {
        const {groupList, activeKey} = this.state;
        const mainRecordIndex = groupList.findIndex(x => x.id === activeKey);
        if (mainRecordIndex) {
            const prevUser = groupList[mainRecordIndex - 1];
            this.onChangeTab(prevUser.id)
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
                return ((x.display || "").toLowerCase().includes(searchKey.toLowerCase()) || (x.name || "").toLowerCase().includes(searchKey.toLowerCase()))
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

    submitData = async () => {
        const { userList, activeKey } = this.state;
        let payload = { groups: [] }
        let object = { users: [], groupId: activeKey }
        userList.forEach(group => {
            if(group.action === 'rejected') {
                object.users.push({userId: group.value})
            }
        })
        payload.groups.push(object)
        this.setState({
            isSaving: true
        })
        const data = await this._apiService.removeUserFromGroup(payload)
        if (!data || data.error) {
            message.error('something is wrong! please try again');
            this.setState({
                isSaving: false
            })
        } else {
            message.success(data || "Successfully updated");
            this.setState({
                isSaving: false
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    }

    render() {
        const { isSidebar, userList, groupList, activeKey, selected, searchKey, searchGroup, isLoadingGroups } = this.state;
        const getInitials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = groupList && groupList.length ? (groupList || []).find(x => x.id === activeKey) : {};
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
                        <div className="justify-content-between d-flex color-white mr-15">
                            <div className="fs-18 ml-70 mt-5">Revoke Access</div>
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

                        {
                            isLoadingGroups ?
                                <div className="text-center">
                                    <Spin className='color-white mr-10'/>
                                </div> :
                                <>
                                    <div className="inner-profile">
                                        <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow"/>
                                        <Icon type="right" onClick={this.onNextUser} className="profile-nav-arrow right-arrow"/>
                                        <div className="text-center overflow-hidden">
                                            <div className="initial-name-inner-profile"
                                                 style={{background: mainRecord && mainRecord.color || 'red'}}>{(firstName || 'A').substr(0, 1)}{(lastName || 'B').substr(0, 1)}</div>
                                            <div
                                                className="UName">{mainRecord && mainRecord.displayName}</div>
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
                                                            const array = item.displayName.split(" ")
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
                                                                    {item.displayName}
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
                                                    No Groups Found
                                                </div>
                                        }
                                    </div>
                                </>
                        }

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
                        isSaving={this.state.isSaving}
                        isLoading={this.state.isLoadingUsers}
                        submitData={this.submitData}
                    />
                </div>
            </div>
        )
    }

}

export default ByGroups