import React, {Component} from 'react';
import { Row, Col} from "reactstrap";
import {Input, Select, Icon, Checkbox,} from 'antd'
const {TextArea} = Input;
const {Option} = Select;

class FirstStep extends Component {
    render() {
        const {certOwner, certificationType, certificationName, isUserManager, isRoleOwner, isApplicationOwner, certificationDescription, toggleUserSearchModal, toggleHideShowModal, certifier, onChange, onCheckBoxCheck} = this.props;
        return (
            <Row className="align-items-center step-row">
                <Col md={3} sm={12} xs={12}><b>Campaign Type</b></Col>
                <Col md={9} sm={12} xs={12}>
                    <Select disabled={false} value={certificationType} style={{width: "100%"}} onChange={(value) => onChange({target: {name: "certificationType", value}})}>
                        <Option value="UserCertification">User Manager</Option>
                        <Option value="ApplicationCertification">Application Owner</Option>
                        <Option value="RoleCertification">Role Certification</Option>
                        <Option value="SelfCertification">Self certification</Option>
                    </Select>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Certification Name</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10"><Input name="certificationName" value={certificationName} onChange={onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Description</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10"><TextArea name="certificationDescription" value={certificationDescription} onChange={onChange}/></Col>
                <Col md={3} sm={12} xs={12}><b>Owner</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Input value={certOwner} disabled={true} onChange={onChange} name="certOwner"  addonAfter={<Icon type="search" onClick={toggleUserSearchModal}/>}/>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Certifier</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    { certificationType === 'ApplicationCertification' ?
                        (
                            <Row>
                                <Col md={4} sm={6} xs={12} className="mt-10">
                                    <Checkbox name='isApplicationOwner' checked={isApplicationOwner} disabled={false} onChange={onCheckBoxCheck}>Is Application Owner</Checkbox>
                                </Col>
                                <Col md={8} sm={6} xs={12} className="mt-10">
                                    <Input className="pr-0" value={certifier} disabled={true} onChange={onChange} name="certifier"  addonAfter={<Icon type="search" onClick={toggleHideShowModal}/>}/>
                                </Col>
                            </Row>
                        ) :
                        (certificationType === 'UserCertification' || certificationType === 'SelfCertification') ?
                        (<Checkbox name='isUserManager' checked={isUserManager} disabled={true} onChange={onCheckBoxCheck}>{`${certificationType === 'SelfCertification' ? 'Self' : 'Is User Manager'}`}</Checkbox>) :
                        <Row>
                            <Col md={4} sm={6} xs={12} className="mt-10">
                                <Checkbox name='isRoleOwner' checked={isRoleOwner} disabled={false} onChange={onCheckBoxCheck}>Is Role Owner</Checkbox>
                            </Col>
                            <Col md={8} sm={6} xs={12} className="mt-10">
                                <Input className="pr-0" value={certifier} disabled={true} onChange={onChange} name="certifier"  addonAfter={<Icon type="search" onClick={toggleHideShowModal}/>}/>
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        )
    }
}

export default FirstStep
