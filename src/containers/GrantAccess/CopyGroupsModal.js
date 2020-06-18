import React from "react";
import {Modal, Button, Spin, Table, message} from 'antd';
import {ApiService} from "../../services/ApiService1";
import TableTransfer from "../GlobalComponents/TableTransfer"
import {Col, Form, InputGroup, Row} from "react-bootstrap";
import clonedeep from "lodash.clonedeep";

class CopyGroupsModal extends React.Component {
  _apiService = new ApiService();
  state = {
    isLoading: false,
    isLoadingGroup: false,
    selectedGroupsIds: [],
    groupList: [],
    search: '',
    step: 1
  }

  getUsersColumns = () => {
    return [
      {
        title: 'User Name',
        render: (record) => {
          return <span className="ws-nowrap cursor-pointer" style={{color: '#005293'}} onClick={() => this.onGetGroupsList(record)}>{record && (record.userName)}</span>
        }
      },
      {
        title: 'Display Name',
        render: (record) => {
          return <span>{record && (record.displayName)}</span>
        }
      }
    ]
  }

  getGroupsColumns = () => {
    return [
      {
        title: 'Name',
        render: (record) => {
          return <span className="ws-nowrap">{record && (record.groupName)}</span>
        },
      }
    ]
  }

  onGetGroupsList = async (record) => {
    this.setState({
      isLoadingGroup: true
    })
    const data = await this._apiService.getUserGroups(record.id)

    if (!data || data.error) {
      this.setState({
        isLoadingGroup: false
      });
      return message.error('something is wrong! please try again');
    } else {
      data.userGroups.forEach((user, index) => {
        user.key = index
        user.id = index
      })
      this.setState({
        groupList: data.userGroups || [],
        step: 2,
        isLoadingGroup: false
      })
    }
  };

  handleGroupChange = selectedGroupsIds => {
    this.setState({
      selectedGroupsIds,
    });
  }

  onSave = () => {
    const { selectedGroupsIds, groupList } = this.state
    let array = []
    groupList.forEach(user => {
      if(selectedGroupsIds.includes(user.key)) {
        array.push(user.groupId)
      }
    })
    this.props.onCopyGroups(array)
  }

  filterOption = (inputValue, option) => {
    return  option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  };

  getFiltered = () => {
    const { search } = this.state
    const { userList } = this.props
    let arrayList = clonedeep(userList) || [];
    if(!search) {
      return arrayList
    }

    arrayList = arrayList.filter(x => {
      const name = x && x.displayName;
      const description = x && x.userName;
      return name.toLowerCase().includes(search.toLowerCase()) || description.toLowerCase().includes(search.toLowerCase());
    });
    return arrayList || []
  }

  onChange = (event) => {
    this.setState({
      search: event.target.value
    })
  }

  render(){
    const { isLoading, step, search, selectedGroupsIds, groupList, isLoadingGroup } = this.state
    const { onClose } = this.props
    return (
      <Modal
        title="Copy Groups"
        visible={true}
        width={"50%"}
        onOk={this.onSave}
        onCancel={onClose}
        footer={
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button className="ant-btn-primary" disabled={!selectedGroupsIds.length} onClick={this.onSave}>Add Selected Groups</Button>
          </div>
        }
      >

        <>
          {
            (isLoading || isLoadingGroup) ? <div className={'text-center'}><Spin className='mt-50'/></div> :
              <div>
                { step === 2 ?
                  <a className="back-btn" onClick={() => this.setState({step: 1, selectedGroupsIds: [], groupList: []})}>
                    <i className="fa fa-chevron-left"/>{"  Back"}
                  </a> : null
                }
                { step === 1 ?
                  <div>

                    <Row>
                      <Col>
                        <InputGroup className="input-prepend">
                          <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-search" /></InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="text"
                            placeholder="search"
                            aria-describedby="inputGroupPrepend"
                            value={search || ""}
                            onChange={this.onChange}
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <Table
                      dataSource={this.getFiltered()}
                      className="mt-20"
                      size="small"
                      rowKey={"id"}
                      columns={this.getUsersColumns()}
                    />

                  </div> : null
                }

                {
                  step === 2 ?
                    <div>
                      <TableTransfer
                        className="mt-20"
                        dataSource={groupList || []}
                        targetKeys={selectedGroupsIds}
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
                    </div> : null
                }
              </div>
          }
        </>

      </Modal>
    )
  }
}

export default CopyGroupsModal;
