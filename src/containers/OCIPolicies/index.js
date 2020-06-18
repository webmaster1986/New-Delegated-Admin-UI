import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, CardHeader} from "reactstrap";
import { message } from 'antd';
import '../Home/Home.scss';
import {ApiService} from "../../services";
import OCIPoliciesList from "./OCIPoliciesList"


class OCIPolicies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            policiesList: []
        };

    }

    componentDidMount() {
        this.getAllApplications()
    }

    getAllApplications = async () => {
        this.setState({
            isLoading: true
        });

        const data = await ApiService.getOCIPolicies()
        if(!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                policiesList: data || []
            });
        }
    }


    render() {
        const { policiesList, isLoading } = this.state
        return (
            <Container className="dashboard application-manage">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/website (1).png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">OCI Policies</h4>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <OCIPoliciesList
                                    isLoading={isLoading}
                                    dataList={policiesList}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

        )
    }
}

export default OCIPolicies

