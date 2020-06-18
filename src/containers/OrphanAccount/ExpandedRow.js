import React,{Component} from 'react'
import {Col, Row} from "reactstrap";
import _ from "lodash"

const toJSON = (tags) => {
    try {
        return JSON.parse(tags);
    } catch(err) {
        return {};
    }
}

class ExpandedRow extends Component{

    state = {
        applicationProfile: {},
        entitlements: {},
        isLoading: false,
    }

    componentDidMount() {
        let { applicationProfile, entitlements } = this.props
        const tags = toJSON(this.props.applicationProfile.tags)
        let data = {}
        let entitle = {}
        if(tags && Object.keys(tags).length){
            delete applicationProfile.tags
            data = {...this.props.applicationProfile, ...tags}
        } else {
            delete applicationProfile.tags
            data = this.props.applicationProfile
        }

        entitlements.forEach(ent => {
            entitle[ent.Name] = entitle[ent.Name] && entitle[ent.Name].length ? entitle[ent.Name].push(ent.Value) : [ent.Value]
        })
        const result=_.chain(entitlements).groupBy("Name").map(function(v, i) {
            return {
                [i]: _.map(v, 'Value')
            }

        }).value();

        this.setState({
            applicationProfile: data || {},
            entitlements: result
        })
    }


    render() {
        const {applicationProfile, entitlements} = this.state;
        return(
            <div>
                <div className="expand-header">
                    <Row className="mt-10">
                        <Col md={6} sm={12} xs={12}>
                            <h4>Profile</h4>
                            {
                                applicationProfile && Object.keys(applicationProfile).map((x, index) => {
                                    return (
                                        <Row className="mt-10" key={index.toString()}>
                                            <Col md={6} sm={12} xs={12}>
                                                <p><b>{this.props.keyRegexToLabel(x)}: </b></p>
                                            </Col>
                                            <Col md={6} sm={12} xs={12}>
                                                <p>{applicationProfile[x]}</p>
                                            </Col>
                                        </Row>
                                    );
                                })
                            }
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <h4>Entitlements</h4>
                            {
                                entitlements && entitlements.length ? entitlements.map((x, index) => {
                                    const dataArray = entitlements.find(ent =>  (Object.keys(ent)[0] === Object.keys(x)[0]))
                                    return (
                                        <div key={index.toString()}>
                                            { dataArray && Object.values(dataArray)[0].map((d, i) => {
                                                return(
                                                    <Row className="mt-10" key={i.toString()}>
                                                        <Col md={6} sm={12} xs={12}>
                                                            { i === 0 ? <p><b>{this.props.keyRegexToLabel(Object.keys(x)[0])}: </b></p> : null }
                                                        </Col>
                                                        <Col md={6} sm={12} xs={12}>
                                                            <p>{d}</p>
                                                        </Col>
                                                    </Row>
                                                )
                                            }) }
                                            <hr/>
                                        </div>
                                    );
                                }) : null
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default ExpandedRow
