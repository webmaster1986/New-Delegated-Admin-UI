import React from 'react'
import {Col, Row} from "reactstrap";
import {Progress} from "antd";
import {Link} from "react-router-dom";

const blue = '#1890ff'
const yellow = '#ffed18'
const red = '#ff0b0b'
const colorBox = (bgColor) => ({
  borderRadius: 2,
  background: bgColor,
  textAlign: 'center',
  fontWeight: 600,
  width: 15,
  height: 15,
  display: 'inline-block'
})

export const KeyItemChart = ({ title, mediumPerc, lowPerc }) => (
  <Row className="mt-10 content-center">
    <Col md={12} >
      <Row className="mb-10">
        <Col sm={12} md={12} lg={4} >
          <h5>{title}</h5>
        </Col>
        <Col sm={12} md={12} lg={8} >
          <div className="content-center">
            <div className="ml-8 mr-5">
              <div style={colorBox(red)}/>
                &nbsp;&nbsp;
                <span>{"< 10 Days "}</span>
              </div>
            <div className="ml-8 mr-5">
              <div style={colorBox(yellow)}/>
              &nbsp;&nbsp;
              <span>{"5 - 10 Days "}</span>
            </div>
            <div className="ml-8 mr-5">
              <div style={colorBox(blue)}/>
              <span>&nbsp;&nbsp;{"> 5 Days "}</span>
            </div>
          </div>
        </Col>
      </Row>
      <Progress
        strokeWidth={17}
        percent={mediumPerc}
        successPercent={lowPerc}
        format={() => ""}
      />
    </Col>
  </Row>
)

