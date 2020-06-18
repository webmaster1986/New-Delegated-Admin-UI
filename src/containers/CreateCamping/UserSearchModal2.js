import React, { Component } from 'react';
import {Modal, Input, Select, Button, Table, Checkbox, message} from 'antd';
import {Col, Row} from 'reactstrap';

const {Option} = Select;

class UserSearchModal extends Component {

  state = {
    userList: [
      {
        userID: 'AMURRAY',
        firstName: 'Andy',
        lastName: 'Murray',
      },
      {
        userID: 'DCRANE',
        firstName: 'Dany',
        lastName: 'Crane',
      },
      {
        userID: 'JDOE',
        firstName: 'Jane',
        lastName: 'Doe',
      }
    ],
    selectedIndex: '',
    isSearch: false,
  }

  onSelectRecord = (checked, index) => {
    this.setState({
      selectedIndex: checked ? index : ''
    });
  }



  getSearchTable = () => {
    const { selectedIndex, userList, isSearch } = this.state;
    const columns = [
      {
        width: 10,
        render: (record, en, index) => {
          return <Checkbox checked={index === selectedIndex} onChange={(event) => this.onSelectRecord(event.target.checked, index)}/>
        }
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
      },
    ];
    return (<Table size="small" columns={columns} dataSource={isSearch ? userList : []} />);
  }

  onSearch = () => {
    this.setState({
      isSearch: true,
    });
  }

  onSubmit = () => {
    const {selectedIndex, userList} = this.state;
    if (selectedIndex > -1) {
      this.props.onSelect(userList[selectedIndex]);
    } else {
      message.error('Please select one user');
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.props.onHide(false)}
        title="User search and select"
        footer={<Button type="primary" onClick={this.onSubmit}>Submit</Button>}
        width={700}
        size="large"
      >
        <Row>
          <Col md="3" sm="12"><span>Search Criteria</span></Col>
          <Col md="3" sm="12">
            <Select className="w-100-p d-inline-block">
              <Option value="firstName">First Name</Option>
              <Option value="lastName">Last Name</Option>
            </Select>
          </Col>
          <Col md="4" sm="12">
            <Input />
          </Col>
          <Col md="2" sm="12">
            <Button type="primary" onClick={this.onSearch}>Search</Button>
          </Col>
        </Row>
        <Row>
          <div className="w-100-p mt-30">
            {this.getSearchTable()}
          </div>
        </Row>
      </Modal>
    );
  }

}

export default UserSearchModal;
