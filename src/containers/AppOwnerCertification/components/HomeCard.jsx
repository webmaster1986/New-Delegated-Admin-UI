import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import CardHeader from "reactstrap/es/CardHeader";
import UserIcon from 'mdi-react/UserIcon';
const HomeCard = () => (
    <>
        <Col md={12} lg={6} xl={3} sm={12} sx={12}>
            <Card>
                <CardHeader className="bg-primary text-center">
                    <UserIcon style={{width: 100, height: 100, color: "#fff"}}/>
                </CardHeader>
                <CardBody className="p-3">
                    <h4>Self Service</h4>
                </CardBody>
            </Card>
        </Col>
        <Col md={3} sm={12} sx={12}>
            <Card>
                <CardHeader className="bg-primary text-center">
                    <UserIcon style={{width: 100, height: 100, color: "#fff"}}/>
                </CardHeader>
                <CardBody className="p-3">
                    <h4>Manage</h4>
                </CardBody>
            </Card>
        </Col>
    </>
);

export default HomeCard;
