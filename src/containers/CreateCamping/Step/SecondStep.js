import React, {Component} from 'react';
import { Row, Col} from "reactstrap";
import {Input, Select, Icon, Checkbox, InputNumber, DatePicker, Radio,} from 'antd'
import moment from "moment";
const {TextArea} = Input;
const {Option} = Select;

const frequencyData = [
    {
        key: "Days",
        value: "Days"
    },
    {
        key: "Months",
        value: "Months"
    },
];

class SecondStep extends Component {
    render() {
        const {certificationForOneTime, certificationToRunNow, certificationFrequency, certificationStartDate, campaignDuration, undecidedAccess, certificationNumberFrequency, onChange, onCheckBoxCheck, onDatePickerChange} = this.props;
        return (
            <Row className="align-items-center mt-20  step-row">
                <Col md={3} sm={12} xs={12}><b>Frequency</b></Col>
                <Col md={3} sm={12} xs={12} className="mt-10 pr-5">
                    <InputNumber name="certificationNumberFrequency" value={certificationNumberFrequency} onChange={(value) =>  onChange({target: {name: 'certificationNumberFrequency', value: value}})}  className="w-100-p"/>
                </Col>
                <Col md={4} sm={12} xs={12} className="mt-10 pr-5">
                    <Select disabled={certificationForOneTime} value={certificationFrequency}
                            onChange={(value) => onChange({target: {name: 'certificationFrequency', value}})} style={{width: "100%"}}>
                        {
                            frequencyData.map((x)=>( <Option value={x.value}>{x.key}</Option> ))
                        }
                    </Select>
                </Col>
                <Col md={2} sm={12} xs={12} className="pl-0"><Checkbox checked={certificationForOneTime} name="certificationForOneTime" onChange={onCheckBoxCheck}>One
                    Time</Checkbox></Col>
                <Col md={3} sm={12} xs={12}><b>Start Date</b></Col>
                <Col md={7} sm={12} xs={12} className="mt-10 pr-5">
                    <DatePicker disabledDate={(current) => {return moment().add(-1, 'days')  >= current || moment().add(1, 'month')  <= current;}}
                                disabled={certificationToRunNow} value={certificationStartDate || null} className="w-100-p"
                                onChange={(date, dateString) => onDatePickerChange(date, dateString, 'certificationStartDate')}/>
                </Col>
                <Col md={2} sm={12} xs={12} className="pl-0">
                    <Checkbox checked={certificationToRunNow} name="certificationToRunNow" onChange={onCheckBoxCheck}>
                        Run Now
                    </Checkbox>
                </Col>
                <Col md={3} sm={12} xs={12}><b>Campaign Duration</b></Col>
                <Col md={7} sm={12} xs={12} className="mt-10 pr-5">
                    <InputNumber name="campaignDuration" value={campaignDuration} onChange={(value) =>  onChange({target: {name: 'campaignDuration', value: value}})}  className="w-100-p"/>
                </Col>
                <Col md={1} sm={12} xs={12} className="mt-10 pl-0" >
                    <span>Days</span>
                </Col>

                <Col md={3} sm={12} xs={12}>
                    <b>Undecided Access</b>
                </Col>
                <Col md={9} sm={12} xs={12} className="mt-10">
                    <Radio.Group name="undecidedAccess" value={undecidedAccess} onChange={onChange}>
                        <Radio value={'Maintain access to undecided items'}>Maintain access to undecided items</Radio>
                        <Radio value={'Flag access to undecided items'}>Flag access to undecided items</Radio>
                    </Radio.Group>
                </Col>
            </Row>
        )
    }

}
export default SecondStep
