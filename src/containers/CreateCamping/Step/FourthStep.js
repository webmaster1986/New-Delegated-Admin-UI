import React, {Component} from 'react';
import { Row, Col} from "reactstrap";
import {Select, Icon, Checkbox, InputNumber,} from 'antd'
const {Option} = Select;

class FourthStep extends Component{
    render() {
        const {reminderFrequencies = [], SendReminderEmailReviewers, reminderFrequencyOption, SendWelcomeEmailToReviewers, onCheckBoxCheck, selectChange, onDeleteFrequency, onAddFrequency} = this.props;
        const length = reminderFrequencies.length;
        const reminderFrequencyOptions = reminderFrequencies.find(x => x.frequency === 'Every') ? reminderFrequencyOption.filter(x => x !== 'Every') : reminderFrequencyOption;
        return (
            <Row className="mt-20 align-items-center  step-row">
                <Col md={12} sm={12} xs={12} className="mt-10">
                    <Checkbox checked={SendWelcomeEmailToReviewers}>Send Welcome Email to Reviewers</Checkbox>
                </Col>
                <Col md={12} sm={12} xs={12} className="mt-10">
                    <Checkbox checked={SendReminderEmailReviewers} name="SendReminderEmailReviewers"
                              onChange={onCheckBoxCheck}>Send Reminder email to Reviewers</Checkbox>
                </Col>
                {
                    SendReminderEmailReviewers ?
                        <Col md={12} sm={12} xs={12} className="mt-10 ml-25">
                            <Checkbox>cc Reminder email to Reviewer manager</Checkbox>
                        </Col> : null
                }
                <Col md={3} sm={12} xs={12} className="mt-10"><b>Email Template</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Select className="w-100-p" name="frequency"
                    >
                        {
                            ['Salesforce AppOwner Certification Template', 'ActiveDirectory AppOwner Certification Template', 'SAP AppOwner Certification Template', 'Enterprise Role Review Template', 'SOX Certification Template'].map(x => <Option
                                value={x}>{x}</Option>)
                        }
                    </Select>
                </Col>
                <Col md={3} sm={12} xs={12} className="mt-10"><b>Reminder Frequency</b></Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    {reminderFrequencies.map((reminderFrequency, index) => {
                        return (
                            <Row key={index}>
                                <Col md={5} className="mt-10">
                                    <Select className="w-100-p" name="frequency" value={reminderFrequency.frequency}
                                            onChange={(value) => selectChange({target: {name: 'frequency', value, index}})}>
                                        {
                                            reminderFrequencyOptions.map(x => <Option
                                                value={x}>{x}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col md={5} className="mt-10">
                                    <InputNumber name="days" className="w-80-p" value={reminderFrequency.days}
                                                 onChange={(value) => selectChange({target: {name: 'days', value, index}})}/> {' '}Days
                                </Col>
                                <Col md={2} className="mt-10">
                                    {index > 0 &&
                                    <Icon type="delete" className="fs-18 mr-10" onClick={() => onDeleteFrequency(index)}
                                          theme="twoTone"/> }
                                    {length - 1 === index ?
                                        <Icon type="plus-circle" className="fs-18" onClick={onAddFrequency} theme="twoTone"/> : null}
                                </Col>
                            </Row>
                        )
                    })}
                </Col>
            </Row>
        )
    }
}
export default FourthStep
