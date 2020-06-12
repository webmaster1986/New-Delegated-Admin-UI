import React,{Component} from 'react'
import {Col, Row} from "reactstrap";

const toJSON = (tags) => {
    try {
        return JSON.parse(tags);
    } catch(err) {
        return {};
    }
}

class NoneGroupExpandedRow extends Component{

    state = {
        applicationProfile: {},
        entitlements: {},
        isLoading: false,
    }

    componentDidMount() {
        let { applicationProfile } = this.props
        const tags = toJSON(this.props.applicationProfile.tags)
        let data = {}
        if(tags && Object.keys(tags).length){
            delete applicationProfile.tags
            data = {...this.props.applicationProfile, ...tags}
        } else {
            delete applicationProfile.tags
            data = this.props.applicationProfile
        }

        this.setState({
            applicationProfile: data || {},
        })
    }

    keyRegexToLabel = (key) => {
        return (key && key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\_/g, " ").replace(/\b[a-z]/g, (x) => x.toUpperCase())) || key
    }


    render() {
        const {applicationProfile} = this.state;
        const {userInfo, isShowUserInfo} = this.props;
        return(
            <div>
                <div className="expand-header">
                    <Row className="mt-10">
                        <Col md={6} sm={12} xs={12}>
                            <h4>Application Profile</h4>
                            {
                                applicationProfile && Object.keys(applicationProfile).map((x, index) => {
                                    return (
                                        <Row className="mt-10" key={`${index}${index.toString()}`}>
                                            <Col md={6} sm={12} xs={12}>
                                                <p><b>{this.keyRegexToLabel(x)}: </b></p>
                                            </Col>
                                            <Col md={6} sm={12} xs={12}>
                                                <p>{applicationProfile[x]}</p>
                                            </Col>
                                        </Row>
                                    );
                                })
                            }
                        </Col>

                        { isShowUserInfo ?
                            <Col md={6} sm={12} xs={12}>
                                <h4>User Information</h4>
                                {
                                    userInfo && Object.keys(userInfo).map((x, index) => {
                                        return (
                                            <Row className="mt-10" key={index.toString()}>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p><b>{this.keyRegexToLabel(x)}: </b></p>
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p>{userInfo[x]}</p>
                                                </Col>
                                            </Row>
                                        );
                                    })
                                }
                            </Col> : null
                        }
                    </Row>
                </div>
            </div>
        )
    }
}

export default NoneGroupExpandedRow
