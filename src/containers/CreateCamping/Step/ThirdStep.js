import React, {Component} from 'react';
import { Row, Col} from "reactstrap";
import {Input, Select, Icon, Radio, Button, Table,} from 'antd'
const {Option} = Select;

class ThirdStep extends Component {
    render() {
        const {
            selectedApp, includedAppsOptions, includedAppsData, selectedUserCriteria, selectedRole, selectedRoleList,
            selectedUserCriteriaOption, departmentList, rolesList, selectedDepartment, selectedDepartmentList, isObjective, onChangeEntitlement, removeIncludedApps,
            removeSelected, addIncludedApps, onChange, addDepartment, addRole, inputText, selectedList, addInputValue
        } = this.props;

        const userName = selectedUserCriteria === 'userName'
        const email = selectedUserCriteria === 'email'
        const department = selectedUserCriteria === 'department'
        const roles = selectedUserCriteria === 'roles'

        const includedAppsOptionList = includedAppsOptions.filter(x => {
            return includedAppsData.find(y => y.AppName === x) ? false : true;
        });
        const includedDepartmentOptionList = departmentList.filter(x => {
            return selectedDepartmentList.find(y => y.Name === x) ? false : true;
        });
        const includedRoleOptionList = rolesList.filter(x => {
            return selectedRoleList.find(y => y.Name === x) ? false : true;
        });

        const columns = [
            {
                title: "App Name",
                dataIndex: 'AppName',
                width: '20%'
            },
            {
                title: "Entitlement",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Select name="Entitlement"
                                style={{width: "100%"}}
                                value={record.Entitlement}
                                onChange={(value) => onChangeEntitlement({target: {name: 'Entitlement', value}}, index)}>
                            <Option value={"All"}>All</Option>
                            <Option value={"HighRisk"}>High Risk</Option>
                            <Option value={"MediumRisk"}>Medium Risk</Option>
                            <Option value={"LowRisk"}>Low Risk</Option>
                            <Option value={"Objective"}>Objective</Option>
                        </Select>
                    )
                }
            },
            {
                title: "Objective",
                width: '20%',
                render: (record, el, index) => {
                    return ( <Input disabled={record.Entitlement !== 'Objective'} name={"Objective"} value={record.Objective} onChange={(e) => onChangeEntitlement(e, index)}/>)
                }
            },
            {
                title: "",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Icon type="delete" onClick={() => removeIncludedApps(index)}/>
                    )
                }
            },
        ]

        const departmentColumns = [
            {
                title: "Department Name",
                dataIndex: 'Name',
                width: '20%'
            },
            {
                title: "Action",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Icon type="delete" onClick={() => removeSelected(index)}/>
                    )
                }
            },
        ]

        const rolesColumns = [
            {
                title: userName ? 'User Name' : email ? 'Email' : 'Role Name',
                dataIndex: 'Name',
                width: '20%'
            },
            {
                title: "Action",
                width: '20%',
                render: (record, el, index) => {
                    return (
                        <Icon type="delete" onClick={() => removeSelected(index)}/>
                    )
                }
            },
        ]

        return (
            <Row className="align-items-center step-row mt-20">
                <Col md="12" sm="12">
                    <Row className="align-items-center">
                        <Col md={3} sm={12} xs={12}><b>Applications: </b></Col>
                        <Col md={7} sm={12} xs={12}>
                            <Select name="selectedApp"
                                    style={{width: "100%"}}
                                    value={selectedApp}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                    onChange={(value) => onChange({
                                        target: {
                                            name: 'selectedApp',
                                            value
                                        }
                                    })}>
                                {
                                    includedAppsOptions.map(x => <Option
                                        value={x.application}>{x.application}</Option>)
                                }
                            </Select>
                        </Col>
                        <Col md={1} sm={12} xs={12}>
                            <Button className="mb-0" type="primary" onClick={addIncludedApps}>Add</Button>
                        </Col>
                        {
                            includedAppsData.length ?
                                <>
                                    <Col md={3} sm={12} xs={12}/>
                                    <Col md={9} sm={12} xs={12} className="mt-20">
                                        <Table columns={columns} dataSource={includedAppsData} size="small"/>
                                    </Col></> : null
                        }

                    </Row>
                </Col>
                <Col md="12" sm="12">
                    <Row className="align-items-center">
                        <Col md={3} sm={12} xs={12}><b>Users:</b></Col>
                        <Col md={7} sm={12} xs={12} className="mt-20">
                            <Select value={selectedUserCriteria}  style={{width: "100%"}}
                                    onChange={value => onChange({target: {name: 'selectedUserCriteria', value}})}>
                                <Option value="userName">Username</Option>
                                <Option value="email">Email</Option>
                                <Option value="department">Departments</Option>
                                <Option value="roles">Roles</Option>
                            </Select>
                        </Col>
                        {
                            (department || roles) &&
                            <>
                                <Col md={3} sm={12} xs={12}/>
                                <Col md={9} sm={12} xs={12} className="mt-20">
                                    <Radio.Group name="selectedUserCriteriaOption" onChange={onChange}
                                                 value={selectedUserCriteriaOption}>
                                        <Radio value="all">All</Radio>
                                        <Radio value="manuallySelect">Manually Select</Radio>
                                    </Radio.Group>
                                </Col>
                            </>
                        }

                    </Row>
                    <Row>
                        {
                            selectedUserCriteriaOption === 'manuallySelect' && department &&
                            <>
                                <Col md={3} sm={12} xs={12}><b>Department:</b></Col>
                                <Col md={7} sm={12} xs={12} className="mt-20">
                                    <Select value={selectedDepartment}
                                            className="w-50-p mr-10"
                                            onChange={value => onChange({target: {name: 'selectedDepartment', value}})}>
                                        {
                                            includedDepartmentOptionList.map(x => <Option value={x}>{x}</Option>)
                                        }
                                    </Select>
                                    <Button  className="mb-0"  type="primary"  onClick={addDepartment}>Add
                                    </Button>
                                </Col>
                                {
                                    selectedDepartmentList.length ?
                                        <>
                                            <Col md={3} sm={12} xs={12}/>
                                            <Col md="9" className="mt-20">
                                                <Table size="small" columns={departmentColumns} dataSource={selectedDepartmentList}/>
                                            </Col>
                                        </> : null
                                }

                            </>
                        }
                    </Row>
                    <Row>
                        {
                            selectedUserCriteriaOption === 'manuallySelect' && roles &&
                            <>
                                <Col md={3} sm={12} xs={12}><b>Role:</b></Col>
                                <Col md={7} sm={12} xs={12} className="mt-20">

                                    <Select value={selectedRole} className="w-50-p mr-10"
                                            onChange={value => onChange({target: {name: 'selectedRole', value}})}>
                                        {
                                            includedRoleOptionList.map(x => <Option value={x}>{x}</Option>)
                                        }
                                    </Select>
                                    <Button className="mb-0"  type="primary" onClick={addRole}>Add</Button>
                                </Col>
                                {
                                    selectedRoleList.length ?
                                        <>
                                            <Col md={3} sm={12} xs={12}/>
                                            <Col md="9" className="mt-20">
                                                <Table size="small" columns={rolesColumns} dataSource={selectedRoleList}/>
                                            </Col>
                                        </> : null
                                }

                            </>
                        }
                    </Row>
                    <Row>
                        {
                            (userName || email) &&
                            <>
                                <Col md={3} sm={12} xs={12} className="mt-20"><b>{userName ? "Username" : "Email"}:</b></Col>
                                <Col md={7} sm={12} xs={12} className="mt-20">
                                    <Input className={"w-50-p mr-10"} name="inputText" value={inputText} onChange={onChange}/>
                                    <Button className="mb-0"  type="primary" onClick={addInputValue}>Add</Button>
                                </Col>
                                {
                                    (selectedList).length ?
                                        <>
                                            <Col md={3} sm={12} xs={12}/>
                                            <Col md="9" className="mt-20">
                                                <Table size="small" columns={rolesColumns} dataSource={selectedList}/>
                                            </Col>
                                        </> : null
                                }

                            </>
                        }
                    </Row>
                </Col>
            </Row>
        )
    }

}
export default ThirdStep
