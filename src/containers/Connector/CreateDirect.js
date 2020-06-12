import React, {Component} from 'react';
import {Col,  Row,} from "reactstrap";
import {Button, Icon, Input, Select, Checkbox, Spin, } from "antd";
import {DIRECT_TYPES} from '../../services/constants';
const {TextArea} = Input;

class CreateDirect extends Component{
    render() {
        const {provider, description, url, token, username, hostname, userSearchBase, port, name, runNow, isLoading, endpoint, password, groupSearchBase, userSearchFilter, groupSearchFilter,
            clientSecret, clientId, onChange, checkBoxChange, onSubmitData, onCancel, isEdit, appid, apiToken, isTrustedSource, ownerName, linkedHRAttribute, ownerId} = this.props;

        const getForm  = () => {
            if (provider === 'OKTA') {
                return (<Row className='align-items-center'>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>OKTA URL</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='url' value={url} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Token</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='token' value={token} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Run Now</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Checkbox disabled={isEdit} name="runNow" checked={runNow} onChange={checkBoxChange}/>
                    </Col>
                    <Col md={12} sm={12} xs={12} className="mt-10 text-right">
                        <Button type="primary">Test Connection</Button>
                        <Button type="primary" className="mb-0 ml-5" disabled={isLoading || !name}
                                onClick={() => onSubmitData('OKTA')}>{isLoading ?
                            <Spin className='color-white'/> : 'Submit'}</Button>
                    </Col>
                </Row>);
            } else if (provider === 'IDCS') {
                return (<Row className='align-items-center'>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>IDCS URL</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='endpoint' value={endpoint} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Client Id</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='clientId' value={clientId} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Client Secret</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='clientSecret' value={clientSecret} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Run Now</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Checkbox disabled={isEdit} name="runNow" checked={runNow} onChange={checkBoxChange}/>
                    </Col>
                    <Col md={12} sm={12} xs={12} className="mt-10 text-right">
                        <Button type="primary">Test Connection</Button>
                        <Button type="primary" className="mb-0 ml-5" disabled={isLoading || !name}
                                onClick={() => onSubmitData('IDCS')}>{isLoading ?
                            <Spin className='color-white'/> : 'Submit'}</Button>
                    </Col>
                </Row>);
            } else if(provider === 'LDAP' || provider === 'AD') {
                return (<Row className='align-items-center'>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Host Name</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='hostname' value={hostname} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Port</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='port' value={port} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>User Name</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='username' value={username} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Password</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input type="password" name='password' value={password} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>User Search Base</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='userSearchBase' value={userSearchBase} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>User Search Filter</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='userSearchFilter' value={userSearchFilter} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Group Search Base</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='groupSearchBase' value={groupSearchBase} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Group Search Filter</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='groupSearchFilter' value={groupSearchFilter} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Run Now</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Checkbox disabled={isEdit} checked={runNow} name="runNow" onChange={checkBoxChange}/>
                    </Col>
                    <Col md={12} sm={12} xs={12} className="mt-10 text-right">
                        <Button type="primary">Test Connection</Button>
                        <Button type="primary" className="mb-0 ml-5" disabled={isLoading || !name}
                                onClick={() => onSubmitData(provider)}>{isLoading ?
                            <Spin className='color-white'/> : 'Submit'}</Button>
                    </Col>
                </Row>);
            } else if (provider==='AWS') {
                return (<Row className='align-items-center'>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Application Id</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='appid' value={appid} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Token</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='apiToken' value={apiToken} onChange={onChange}/>
                    </Col>

                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Owner Name</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='ownerName' value={ownerName} onChange={onChange}/>
                    </Col>

                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Owner ID</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='ownerId' value={ownerId} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Linked HR Attribute</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Input name='linkedHRAttribute' value={linkedHRAttribute} onChange={onChange}/>
                    </Col>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Is Trusted Source</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Checkbox name="isTrustedSource" checked={isTrustedSource === 'yes'} onChange={checkBoxChange}/>
                    </Col>

                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Run Now</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12} className="mt-10">
                        <Checkbox disabled={isEdit} name="runNow" checked={runNow} onChange={checkBoxChange}/>
                    </Col>
                    <Col md={12} sm={12} xs={12} className="mt-10 text-right">
                        <Button type="primary">Test Connection</Button>
                        <Button type="primary" className="mb-0 ml-5" disabled={isLoading || !name}
                                onClick={() => onSubmitData('AWS')}>{isLoading ?
                            <Spin className='color-white'/> : 'Submit'}</Button>
                    </Col>
                </Row>);
            }
        };
        return(
            <>
                <span className="fs-18 text-primary cursor-pointer" onClick={onCancel}><Icon type="arrow-left"/></span>
                <Row className='align-items-center'>
                    <Col md={2} sm={12} xs={12}>
                        <span className="mr-10"><b>Authoritative Source</b></span>
                    </Col>
                    <Col md={10} sm={12} xs={12}>
                        <Select className='w-100-p' value={provider} disabled={isEdit} onChange={value => onChange({target: {name: 'provider',value}})}>
                            <Select.Option value={""} disabled={true}>Add Source</Select.Option>
                            {
                                DIRECT_TYPES.map(type => <Select.Option key={type.value} value={type.value}>{type.text}</Select.Option>)
                            }
                        </Select>
                    </Col>
                    {
                        provider &&
                            <>
                                <Col md={2} sm={12} xs={12}>
                                    <span className="mr-10"><b>Name</b></span>
                                </Col>
                                <Col md={10} sm={12} xs={12} className="mt-10">
                                    <Input disabled={isEdit} name='name' value={name} onChange={onChange}/>
                                </Col>
                                <Col md={2} sm={12} xs={12}>
                                    <span className="mr-10"><b>Description</b></span>
                                </Col>
                                <Col md={10} sm={12} xs={12} className="mt-10">
                                    <TextArea name='description' value={description} onChange={onChange}/>
                                </Col>
                            </>
                    }
                </Row>
                {
                    getForm()
                }
            </>
        )
    }

}
export default CreateDirect
