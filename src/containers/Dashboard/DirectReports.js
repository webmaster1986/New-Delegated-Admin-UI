import React, {Component} from 'react'
import {Table, Switch, Spin, message, Card} from "antd";
import {ApiService} from "../../services";

const gray = '#525f68'

class DirectReports extends Component {
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
    const data = await ApiService.GetAllIdentityUsers(page);
    if (!data || data.error) {
      this.setState({
        isLoading: false
      });
      return message.error('something is wrong! please try again');
    } else {
      let userList = []
      if(data && data.resources){
        userList = (data.resources || []).filter(x => x.Email && x.Manager).filter(x => x.UserName !== userName && x.Manager === userName).splice(0, 4)
      }
      this.setState({
        identityUsersList: userList || [],
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
            {record.UserName}
          </span>
        )
      },
      {
        title: 'Display Name',
        width: '25%',
        render: (record) => (<span>{record.FirstName}{' '}{record.LastName}</span>)
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
          title="Direct Reports"
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
