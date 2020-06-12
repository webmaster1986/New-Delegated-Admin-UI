import React, {Component} from 'react';
import {Select, Spin, Transfer,} from 'antd'


class FirstStep extends Component{
    render() {
        const {isLoading, userList, selectedUsers, handleUserChange} = this.props;
        return(
            <div>
                {
                    isLoading ?
                        <Spin className='custom-loading mt-50'/> :
                        <Transfer
                            dataSource={userList || []}
                            showSearch
                            listStyle={{
                                width: 300,
                                height: 300,
                            }}
                            operations={['Select', 'Unselect']}
                            targetKeys={selectedUsers}
                            onChange={handleUserChange}
                            render={(item) => `${item.firstName} ${item.lastName}`}
                        />}
            </div>
        );
    }
}

export default FirstStep
