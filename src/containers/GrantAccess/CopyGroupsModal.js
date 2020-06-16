import React from "react";
import {Modal, Button} from 'antd';
import {ApiService} from "../../services/ApiService";
import TableTransfer from "../GlobalComponents/TableTransfer"

class CopyGroupsModal extends React.Component {
  _apiService = new ApiService();
  state = {
    isLoading: true,
    selectedGroupsKeys: []
  }

  getGroupsColumns = () => {
    return [
      {
        title: 'Name',
        render: (record) => {
          return <span className="ws-nowrap">{record && (record.name)}</span>
        },
      },
      {
        title: 'Description',
        render: (record) => {
          return <span className="ws-nowrap">{record && (record.description)}</span>
        },
      }
    ]
  }

  handleGroupChange = selectedGroupsKeys => {
    this.setState({
      selectedGroupsKeys,
    });
  };

  onSave = () => {
    this.props.onClose()
  }

  filterOption = (inputValue, option) => {
    return  option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  };

  render(){
    const {groupsList} = this.props
    const {selectedGroupsKeys} = this.state

    return (
      <Modal
        title="Copy Groups"
        visible={true}
        width={"70%"}
        onOk={this.onSave}
        onCancel={this.onSave}
        footer={
          <div>
            <Button onClick={this.onSave}>Cancel</Button>
            <Button className="ant-btn-primary" disabled={!selectedGroupsKeys.length} onClick={this.onSave}>Add Selected Groups</Button>
          </div>
        }
      >
        <>
          <TableTransfer
              className="mt-20"
              dataSource={groupsList || []}
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
          />
        </>
      </Modal>
    )
  }
}

export default CopyGroupsModal;
