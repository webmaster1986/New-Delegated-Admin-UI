import React, {Component} from 'react';
import { Select, Transfer,} from 'antd'

class SecondStep extends Component{
    render() {
        const {applicationList, selectedApps, handleAppChange,} = this.props;
        return(
            <div className="mt-10">
                <Transfer
                    dataSource={applicationList}
                    showSearch
                    listStyle={{
                        width: 300,
                        height: 300,
                    }}
                    operations={['Select', 'Unselect']}
                    targetKeys={selectedApps}
                    onChange={handleAppChange}
                    render={item => `${item.name}`}
                />
            </div>
        );
    }
}

export default SecondStep
