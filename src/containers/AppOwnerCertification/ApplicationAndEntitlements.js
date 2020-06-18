import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Input, Menu, Select, Spin, Table, Tabs} from "antd";
import {get} from 'lodash';
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import '../Home/ApplicationsAndEntitilements.scss'

const {Option} = Select;

class ApplicationAndEntitlements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expendedRows: []
    };
  }
  
  tab = () => {
    const {
      isLoadingUser, selectedEnt, entCheckBoxChange, showInfoDrawer, undoDecisionEnt, onUpdateEntStatus, onToggleComment, getFilterData
    } = this.props;
    const columns = [
      {
        title: '',
        width: 30,
        render: (record) => {
          return (
            <div>
              <Checkbox className={'custom-check-box pl-10'} checked={selectedEnt.includes(record.entId)}
                        onChange={(e) => entCheckBoxChange(record.entId, e)}/>
            </div>
          )
        }
      },
      {
        title: 'Account',
        render: (record) => {
          return (<span>{record.accountId}<Icon type="info-circle" theme="twoTone" className="pl-5"
                                                onClick={() => showInfoDrawer(record)}/></span>);
        }
      },
      {
        title: 'Application',
        render: (record) => {
          return <span>{get(record, 'applicationInfo.applicationName')}
            <Icon type="info-circle" className="pl-5" theme="twoTone"
                  onClick={() => showInfoDrawer(record, 'app')}/></span>
        }
      },
      {
        title: 'Type',
        render: (record) => {
          return (<span>{get(record, 'entInfo.entitlementInfo.entitlementType')}</span>);
        }
      },
      {
        title: 'Name',
        render: (record) => {
          return (<span>{get(record, 'entInfo.entitlementInfo.entitlementName')}</span>);
        }
      },
      {
        title: 'Description',
        render: (record) => {
          return (<span>{get(record, 'entInfo.entitlementInfo.entitlementDescription')}</span>);
        }
      },
      {
        title: 'Last Login',
        render: (record) => {
          return (<span>{get(record, 'applicationInfo.lastLogin')}</span>);
        }
      },
      {
        title: 'Decision',
        width: 200,
        render: (record) => {
          const menu = (
            <Menu>
              <Menu.Item><span
                className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
              <Menu.Item><span
                className="text-primary ml-5 cursor-pointer"
                onClick={() => undoDecisionEnt(record.entId)}>Undo decision</span></Menu.Item>
            </Menu>
          );
          const action = get(record, 'entInfo.action');
          
          return (
            <div>
                    <span
                      className={`mr-10 row-action-btn ${action === 'certified' ? 'text-success' : 'text-initial'}`}
                      onClick={() => onUpdateEntStatus(record.entId, action === 'certified' ? 'required' : 'certified')}>
                         {action === 'certified' ? 'Approved' : 'Approve'}
                    </span>
              <span
                className={`mr-10 row-action-btn-a ${action === 'rejected' ? 'text-success' : 'text-initial'}`}
                onClick={() => onUpdateEntStatus(record.entId, action === 'rejected' ? 'required' : 'rejected')}>
                                      {action === 'rejected' ? 'Revoked' : 'Revoke'}
                                </span>
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="unordered-list" className='text-primary'/>
              </Dropdown>
            </div>
          )
        }
      },
      {
        title: (<div><img src={require('../../images/comment.png')}/></div>),
        width: 50,
        align: 'right',
        render: (record) => {
          return <span className='cursor-pointer'
                       onClick={() => onToggleComment(record.entId, record.entInfo.newComment)}><a><img
            src={require('../../images/edit.png')} className="size-img"/></a></span>
        }
      },
    ];
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
                  className={`user-profile-data no-padding-table`}
                  dataSource={getFilterData()}
                />
              </div>
            </Col>
          </Row>
        }
      </div>
    );
  }
  
  render() {
    const {
      members, activeKey, onSelectAll, confirmApproveSelected, apps,
      confirmRevokeSelected, onChange, selectedEnt, changedCount, submitData
    } = this.props;
    return (
      <div className="custom-content">
        <Card className="mt-10">
          <CardHeader className="pl-20">
            <Row className="top-filter">
              <Col md={12} sm={12} xs={12}>
                <Button className="square" size={"large"} color="primary">
                  <Checkbox
                    onChange={onSelectAll} className="custom-check-box   "
                    checked={(selectedEnt.length && selectedEnt.length === apps.length)}
                  > Select All</Checkbox></Button>
                <Button className="square ml-10" size={"large"} color="primary"
                        onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                <Button className="square ml-10" size={"large"} color="primary"
                        onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Revoke</Button>
                <Select placeholder='' defaultValue="" size="large"
                        className='border-0 ml-10 float-right ' style={{width: 220}}>
                  <Option value=""></Option>
                  <Option value="1">Show New Access</Option>
                  <Option value="2">Show All Access</Option>
                </Select>
                <Select placeholder='Filter' className='border-0 ml-10 float-right' size="large"
                        onChange={(value) => onChange({
                          target: {
                            name: 'filter',
                            value
                          }
                        })} style={{width: 220}}>
                  <Option value="">All</Option>
                  <Option value="certified">Approved</Option>
                  <Option value="rejected">Revoked</Option>
                  <Option value="required">Undecided</Option>
                  <Option value="mustReview">Must Review</Option>
                </Select>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            <Row>
              {
                members.map(item => {
                  if (item.userInfo.UserName === activeKey) {
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
                disabled={changedCount === 0}
                onClick={submitData}>
                Save & Review Later ({changedCount && changedCount})
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ApplicationAndEntitlements
