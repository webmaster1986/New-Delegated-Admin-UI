import React from "react";
import {Modal, Button} from 'antd';
import {ApiService} from "../../services/ApiService";
import TableTransfer from "../GlobalComponents/TableTransfer"

class CopyUsersModal extends React.Component {
  _apiService = new ApiService();
  state = {
    isLoading: true,
    selectedUsersKeys: []
  }

  getUsersColumns = () => {
    return [
      {
        title: 'User Name',
        render: (record) => {
          return <span>{record && (record.userName)}</span>
        },
        width: '20%'
      },
      {
        title: 'Display Name',
        render: (record) => {
          return <span>{record && (record.displayName)}</span>
        },
        width: '20%'
      },
      {
        title: 'Department',
        render: (record) => {
          return <span>{record && (record.department)}</span>
        },
        width: '20%'
      },
      {
        title: 'Manager',
        render: (record) => {
          return <span>{record && (record.managerDisplayName)}</span>
        },
        width: '20%'
      }
    ]
  }

  handleUserChange = selectedUsersKeys => {
    this.setState({
      selectedUsersKeys,
    });
  };

  onSave = () => {
    this.props.onClose()
  }

  filterOption = (inputValue, option) => {
    return  option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  };

  render(){
    const {userList} = this.props
    const {selectedUsersKeys, userTargetKeys, search} = this.state

    return (
      <Modal
        title="Copy Users"
        visible={true}
        width={"70%"}
        onOk={this.onSave}
        onCancel={this.onSave}
        footer={
          <div>
            <Button onClick={this.onSave}>Cancel</Button>
            <Button className="ant-btn-primary" disabled={!selectedUsersKeys.length} onClick={this.onSave}>Add Selected Users</Button>
          </div>
        }
      >
        <>
          <TableTransfer
              className="mt-20"
              dataSource={userList || []}
              targetKeys={selectedUsersKeys}
              showSearch
              listStyle={{
                width: 525,
                // height: 300,
                overflowY: 'auto'
              }}
              operations={['Select', 'Unselect']}
              onChange={this.handleUserChange}
              filterOption={this.filterOption}
              leftColumns={this.getUsersColumns(true)}
              rightColumns={this.getUsersColumns(true)}
          />
        </>
      </Modal>
    )
  }
}

export default CopyUsersModal;
