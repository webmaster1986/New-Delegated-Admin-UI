import React, {Component} from 'react'
import {Table, Switch, Spin, message, Card} from "antd";
// import {ApiService} from "../../services";
import {ApiService} from "../../services/ApiService1";

const gray = '#525f68'

class DirectReports extends Component {
  _apiService = new ApiService();
  state = {
    isSelf: false,
    isLoading: false,
    identityUsersList: []
  };

  componentDidMount() {
    this.GetAllIdentityUsers(1)
  }

  GetAllIdentityUsers = async (page) => {
    const {userName} = this.props
    this.setState({
      isLoading: true
    });
    // const data = await ApiService.GetAllIdentityUsers(page);
    const data = await this._apiService.getAllUsers()
    if (!data || data.error) {
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      // let userList = []
      // if(data && data.resources){
      //   userList = (data.resources || []).filter(x => x.Email && x.Manager).filter(x => x.UserName !== userName && x.Manager === userName).splice(0, 4)
      // }
      this.setState({
        identityUsersList: data && data.length ? data.splice(0,4) : [],
        isLoading: false
      })
    }
  }

  getColumns = (isSelf) => {
    const columns = [
      {
        title: 'User Name',
        width: '25%',
        render: (record) => (
          <span
            className="cursor-pointer"
            style={{color: '#005293'}}
            onClick={() => this.props.history.push(`/${this.props.clientId}/my-profile?tab=2&id=${record.userId}`)}
          >
            {record.userName}
          </span>
        )
      },
      {
        title: 'Display Name',
        width: '25%',
        render: (record) => (<span>{record.displayName}</span>)
      },
      {
        title: 'User Type',
        width: '25%',
        key: 'userType',
        render: (keyData, record, index) => (<span>{index%2 === 1 ? 'Employee' : 'Contractor'}</span>)
      },
    ];
    if (!isSelf) {
      columns.push({
        title: 'Locked',
        width: '25%',
        render: (record) => (
            <Switch size="small" className="green w-80 red" checkedChildren={'Unlocked'} unCheckedChildren={"Locked"} defaultChecked />
        )
      });
    }
    return columns;
  }


  render() {
    const {isLoading, identityUsersList} = this.state;
    return(
      <div>
        <Card
          title="Manage Users"
          headStyle={this.props.customPanelStyle('#46be8a')}
          style={{
            height: '100%',
            minHeight: 350
          }}
        >
          <div>
            {
              isLoading ? <Spin className='mt-50 w-100-p'/> :
                <Table
                  columns={this.getColumns()}
                  size="small"
                  rowKey="id"
                  pagination={{ pageSize: 4 }}
                  dataSource={identityUsersList}
                />
            }
          </div>
        </Card>
      </div>
    )
  }
}
export default DirectReports
