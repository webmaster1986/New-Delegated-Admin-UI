import React, {Component} from 'react'
import {Col, Row} from "reactstrap";
import {Card, Divider, message, Spin} from "antd";
import {Link} from "react-router-dom";
import moment from "moment";
import {ApiService} from "../../services/ApiService1";

const blue = 'rgb(215, 37, 40)'
const gray = 'rgb(0, 157, 219)'
const white = '#ffffff'
const customPanelStyle = (bgColor) => ({
    borderRadius: 4,
    border: 0,
    overflow: 'hidden',
    backgroundColor: bgColor,
    color: white,
    fontWeight: 400,
    fontSize: 16,
});

class GrantRevokeSection extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            isGrantLoading: false,
            isRevokeLoading: false,
            recentGrantsList: [],
            recentRevokesList: [],
        };
    }

    componentDidMount() {
        this.getRecentGrantsList()
        this.getRecentRevokesList()
    }

    getRecentGrantsList = async () => {
        this.setState({
            isGrantLoading: true
        });
        const data = await this._apiService.getRecentGrants();
        if (!data || data.error) {
            this.setState({
                isGrantLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                recentGrantsList: data || [],
                isGrantLoading: false
            })
        }
    }

    getRecentRevokesList = async () => {
        this.setState({
            isRevokeLoading: true
        });
        const data = await this._apiService.getRecentRevokes();
        if (!data || data.error) {
            this.setState({
                isRevokeLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                recentRevokesList: data || [],
                isRevokeLoading: false
            })
        }
    }

    render() {
        const { clientId } = this.props
        const { recentRevokesList, recentGrantsList, isGrantLoading, isRevokeLoading } = this.state
        return(
            <>
                <Col className="mb-10" xs={12} md={6} lg={4}>
                    <Card
                        title={<Link to={`/${clientId}/grant-access-by-users`} style={{color: white}}>Recent Grants</Link>}
                        extra={<div className="total-digit">{recentGrantsList.length || 0}</div>}
                        headStyle={customPanelStyle(blue)}
                    >
                        <>
                            {
                                isGrantLoading ? <div className="text-center"> <Spin /> </div> :
                                    <>
                                        {
                                            (recentGrantsList || []).slice(0, 2).map((item,index) => (
                                                <div key={index}>
                                                    <Row>
                                                        <Col md={12} lg={12}>
                                                            <div className="d-flex">
                                                                <h4 className="mb-5">
                                                                    <b style={{whiteSpace: 'nowrap'}}>{item.groupname}</b>
                                                                </h4>
                                                            </div>

                                                            <div className="mt-10">
                                                                <h5 className="mt-5"><b>User Name: </b>{item.username}</h5>
                                                                <h5 className="mt-5"><b>Type: </b>{item.type}</h5>
                                                                <h5 className="mt-5"><b>Date: </b>{ item && item.date && moment(item.date).format('MM-DD-YYYY, h:mm:ss a') }</h5>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Divider/>
                                                </div>
                                            ))
                                        }
                                        {
                                            (recentGrantsList || []).length > 2 ?
                                                <div className="text-right">
                                                    <Link to={`/${clientId}/grant-access-by-users`}>More</Link>
                                                </div>
                                                : null
                                        }
                                    </>
                            }
                        </>
                    </Card>
                </Col>
                <Col className="mb-10" xs={12} md={6} lg={4}>
                    <Card
                        title={<Link to={`/${clientId}/revoke-access-by-users`} style={{color: white}}>Recent Revokes</Link>}
                        extra={<div className="total-digit">{recentRevokesList.length || 0}</div>}
                        headStyle={customPanelStyle(gray)}
                    >
                        <>
                            {
                                isRevokeLoading ? <div className="text-center"> <Spin /> </div> :
                                    <>
                                        {
                                            (recentRevokesList || []).slice(0, 2).map((item,index) => (
                                                <div key={index}>
                                                    <Row>
                                                        <Col md={12} lg={12}>
                                                            <div className="d-flex">
                                                                <h4 className="mb-5">
                                                                    <b style={{whiteSpace: 'nowrap'}}>{item.groupname}</b>
                                                                </h4>
                                                            </div>

                                                            <div className="mt-10">
                                                                <h5 className="mt-5"><b>User Name: </b>{item.username}</h5>
                                                                <h5 className="mt-5"><b>Type: </b>{item.type}</h5>
                                                                <h5 className="mt-5"><b>Date: </b>{ item && item.date && moment(item.date).format('MM-DD-YYYY, h:mm:ss a') }</h5>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Divider/>
                                                </div>
                                            ))
                                        }
                                        {
                                            (recentRevokesList || []).length > 2 ?
                                                <div className="text-right">
                                                    <Link to={`/${clientId}/revoke-access-by-users`}>More</Link>
                                                </div>
                                                : null
                                        }
                                    </>
                            }
                        </>
                    </Card>
                </Col>
            </>
        )
    }
}

export default GrantRevokeSection