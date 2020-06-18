import React from "react";
import {Modal, Button, Spin, Radio, Table} from 'antd';
import {Form, InputGroup, Row, Col} from "react-bootstrap";
import {ApiService} from "../../services/ApiService";
import TableTransfer from "../GlobalComponents/TableTransfer"
import clonedeep from "lodash.clonedeep";

class CopyUsersModal extends React.Component {
  _apiService = new ApiService();
  state = {
    isLoading: false,
    selectedUsersIds: [],
    userList: [],
    search: '',
    step: 1
  }

  getUsersColumns = () => {
    return [
      {
        title: 'User Name',
        render: (record) => {
          return <span>{record && (record.name)}</span>
        }
      },
      {
        title: 'Display Name',
        render: (record) => {
          return <span>{record && (record.display)}</span>
        }
      }
    ]
  }

  handleUserChange = (selectedUsersIds) => {
    this.setState({
      selectedUsersIds
    });
  };

  filterOption = (inputValue, option) => {
    return  option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  };

  onUsersSet = (record) => {
    record.members.forEach((member, index) => {
      member.key = index
      member.id = index
    })
    this.setState({
      userList: (record.members) || [],
      step: 2
    })
  }

  getGroupsColumns = () => {
    return [
      {
        title: 'Name',
        render: (record) => {
          return <span className="ws-nowrap cursor-pointer" style={{color: '#005293'}} onClick={() => this.onUsersSet(record)}>{record && (record.displayName)}</span>
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

  getFiltered = () => {
    const { search } = this.state
    const { groupList } = this.props
    let arrayList = clonedeep(groupList) || [];
    if(!search) {
      return arrayList
    }

    arrayList = arrayList.filter(x => {
      const name = x && x.displayName;
      const description = x && x.description;
      return name.toLowerCase().includes(search.toLowerCase()) || description.toLowerCase().includes(search.toLowerCase());
    });
    return arrayList || []
  }

  onChange = (event) => {
    this.setState({
      search: event.target.value
    })
  }

  onSave = () => {
    const { selectedUsersIds, userList } = this.state
    let array = []
    userList.forEach(user => {
      if(selectedUsersIds.includes(user.key)) {
        array.push(user.value)
      }
    })
    this.props.onCopyUsers(array)
  }

  render(){
    const { isLoading, step, search, selectedUsersIds, userList } = this.state
    const { onClose } = this.props

    return (
      <Modal
        title="Copy Users"
        visible={true}
        width={"50%"}
        onOk={this.onSave}
        onCancel={onClose}
        footer={
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button className="ant-btn-primary" disabled={!selectedUsersIds.length} onClick={this.onSave}>Add Selected Users</Button>
          </div>
        }
      >

        <>
          {
            isLoading ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
              <div>
                { step === 2 ?
                  <a className="back-btn" onClick={() => this.setState({step: 1, selectedUsersIds: [], userList: []})}>
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
                      columns={this.getGroupsColumns()}
                    />

                  </div> : null
                }

                {
                  step === 2 ?
                    <div>
                      <TableTransfer
                        className="mt-20"
                        dataSource={userList || []}
                        targetKeys={selectedUsersIds}
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
                    </div> : null
                }
              </div>
          }
        </>

      </Modal>
    )
  }
}

export default CopyUsersModal;
