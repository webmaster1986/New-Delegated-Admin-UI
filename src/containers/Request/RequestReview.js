import React, {Component} from 'react';
import {Card,} from "reactstrap";
import {Input, Menu, Dropdown, Icon, Table} from "antd";
import './request.scss'


class RequestReview extends Component {
    expandedRowRender = (mainRecord) => {
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>{record && record.displayName}</span>
                }
            },
            {
                title: 'Type',
                render: (record) => {
                    return <span>{record && record.type}</span>
                }
            },
            {
                title: (<div><img src={require('../../images/comment.png')}/></div>),
                render: (record) => {
                    return <span className='cursor-pointer'><a><img src={require('../../images/edit.png')} className="size-img"/></a></span>
                }
            },
        ];
        return (
            <Card className="antd-table-nested">
                <Table
                    columns={columns}
                    size="small"
                    dataSource={(mainRecord && mainRecord.requestList) || []}
                    pagination={{pageSize: 25}}
                />
            </Card>
        );
    };

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    render() {
        const {userMappings} = this.props;
        console.log(userMappings)
        const getEmail = (record) => {
            if (Array.isArray(record.emails) && record.emails.length) {
                const primaryEmail = record.emails.find(x => x.primary);
                if (primaryEmail) {
                    return primaryEmail.value;
                } else {
                    return record.emails[0].value;
                }
            }
            return '';
        }
        const columns = [
            {
                title: 'Name',
                render: (record) => {
                    return <span>Name: <b>{record && record.displayName}</b><br/> UserName: <b>{record && record.userName}</b></span>
                }
            },
            {
                render: (record) => {
                    return (
                        <span>Email: <b>{getEmail(record)}</b></span>);
                }
            },

        ];

        return (
            <div>
                <Table
                    columns={columns}
                    size="medium"
                    className={`user-profile-data no-padding-table`}
                    expandedRowRender={this.expandedRowRender}
                    expandIcon={this.customExpandIcon}
                    dataSource={userMappings}
                    showHeader={false}
                />
            </div>
        )
    }
}

export default RequestReview
