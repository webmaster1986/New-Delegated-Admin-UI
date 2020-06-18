import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Input, Menu, Select, Spin, Table, Tooltip} from "antd";
import {get} from 'lodash';
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";

const {Search} = Input;
const {Option} = Select;

class RevokeAccessDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expendedRows: []
    };
  }

  tab = () => {
    const { isLoadingUser, selected, onCheckBoxChange, undoDecision, onUpdateStatus, onToggleComment, getFilterData, dataType, isLoading } = this.props;
    const columns = [];
    if(dataType === "user") {
      columns.push(
        {
          title: '',
          width: 50,
          render: (record) => {
            return (
              <div>
                <Checkbox
                    className={'custom-check-box pl-10'}
                    checked={selected.includes(record.key)}
                    onChange={(e) => onCheckBoxChange(record.key, e)}
                />
              </div>
            )
          }
        },
        {
          title: 'Group Name',
          render: (record) => {
            return (<span className="ws-nowrap">
            {
              record.groupName
            }
          </span>);
          }
        },
        {
          title: 'Description',
          render: (record) => {
            return (<span className="ws-nowrap">
            {
              record.description
            }
          </span>);
          }
        },
        {
          title: 'Decision',
          width: 200,
          render: (record) => {
            const action = get(record, 'action');

            return (
              <div>
                <span
                  className={`mr-10 ws-nowrap row-action-btn-a ${action === 'rejected' ? 'text-success' : 'text-initial'}`}
                  onClick={() => onUpdateStatus(record.key, action === 'rejected' ? 'required' : 'rejected')}
                >
                  {action === 'rejected' ? 'Revoked' : 'Revoke'}
                </span>
              </div>
            )
          }
        }
      )
    }
    if(dataType === "group") {
      columns.push(
        {
          title: '',
          width: 80,
          render: (record) => {
            return (
                <div>
                  <Checkbox className={'custom-check-box pl-10'} checked={selected.includes(record.key)}
                            onChange={(e) => onCheckBoxChange(record.key, e)}/>
                </div>
            )
          }
        },
        {
          title: 'User Name',
          render: (record) => {
            return (<span>
            {
              record && record.name
            }
          </span>);
          }
        },
        {
          title: 'Display Name',
          render: (record) => {
            return (<span>
            {
              record && record.display
            }
          </span>);
          }
        },
        {
          title: 'Type',
          render: (record) => {
            return (
              <span>
                {
                  record && record.type
                }
              </span>
            );
          }
        },
        {
          title: 'Department',
          render: (record) => {
            return (
              <span>
                {
                  record && record.department
                }
              </span>
            );
          }
        },
        {
          title: 'Decision',
          width: 200,
          render: (record) => {
            const action = get(record, 'action');

            return (
              <div>
                <span
                  className={`mr-10 ws-nowrap row-action-btn-a ${action === 'rejected' ? 'text-success' : 'text-initial'}`}
                  onClick={() => onUpdateStatus(record.key, action === 'rejected' ? 'required' : 'rejected')}
                >
                  {action === 'rejected' ? 'Revoked' : 'Revoke'}
                </span>
              </div>
            )
          }
        },
        // {
        //   title: (<div><img src={require('../../images/comment.png')}/></div>),
        //   width: 50,
        //   align: 'right',
        //   render: (record) => {
        //     return <span className='cursor-pointer'
        //                  onClick={() => onToggleComment(record.mainId, record.entInfo.newComment)}><a><img
        //         src={require('../../images/edit.png')} className="size-img"/></a></span>
        //   }
        // },
      )
    }
    return (
      <div className='border-1 mt-20' style={{flex: 1}}>
        {isLoadingUser ?
          <Spin className='mt-50 custom-loading'/> :
          <Row>
            <Col md="12" sm="12" className='pl-15'>
              <div className="inner-profile-right certification-owner">
                <Table
                  columns={columns}
                  size="medium"
                  sorting={false}
                  rowKey={"name"}
                  pagination={{pageSize: 25}}
                  className={`user-profile-data no-padding-table`}
                  dataSource={getFilterData()}
                  scroll={{x: 992}}
                  loading={isLoading || false}
                />
              </div>
            </Col>
          </Row>
        }
      </div>
    );
  }

  render() {
    const { onSelectAll, groupList, confirmRevokeSelected, onChange, selected, searchKey, changedCount, submitData, userList, activeKey, dataType, isSaving, isLoading } = this.props;
    const type = dataType === "group" ? "Users" : "Groups"
    return (
      <div className="custom-content">
        <Card className="mt-10">
          <CardHeader className="pl-20">
            <div className="d-flex flex-wrap top-filter" style={{margin: '0px -30px'}}>
              <Col md={12} sm={12} xs={12}>

                <div className="d-flex flex-wrap">

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Button className="square w-100-p" size={"large"} color="primary">
                      <Checkbox
                        onChange={onSelectAll} className="custom-check-box   "
                        checked={(selected.length && selected.length === groupList.length)}
                      >
                        Select All
                      </Checkbox>
                    </Button>
                  </Col>

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Button
                      className="square w-100-p"
                      size={"large"}
                      color="primary"
                      onClick={confirmRevokeSelected}
                    >
                      <Icon type="minus-circle"/>Revoke
                    </Button>
                  </Col>

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Search
                      size="large"
                      placeholder={`Search for ${type}`}
                      // style={{width: 220}}
                      className="float-right w-100-p"
                      value={searchKey}
                      name="searchKey"
                      onChange={onChange}
                    />
                  </Col>

                </div>

              </Col>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <Row>
              {
                userList.map(item => {
                  const name = this.props.dataType === "group" ? "name" : "userName"
                  if (item.id === activeKey) {
                    return this.tab(item)
                  }
                  return null;
                })
              }
            </Row>
            <div className="sticky-btn cstm-btn">
              <Button
                  className="icon square float-right mb-0"
                  size={"large"} color="primary"
                  disabled={changedCount === 0 || isSaving}
                  onClick={submitData}
              >
                <span>
                  {
                    isSaving ?
                        <Spin className='color-white mr-10'/> :
                        null
                  }
                </span>
                Save & Review Later ({changedCount && changedCount})
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default RevokeAccessDataTable
