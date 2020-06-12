import React, {Component} from 'react';
import {Card, CardBody, Col, Container, Row} from "reactstrap";
import clonedeep from "lodash.clonedeep";
import {Button,  Icon, Steps, Table, Transfer, Input, Modal, message, Spin} from "antd";
const {Step} = Steps;
const {TextArea} = Input;
import '../Home/Home.scss';
import {ApiService} from "../../services/ApiService";
import FirstStep from "./Steps/FirstStep";
import SecondStep from "./Steps/SecondStep";
import ThirdStep from "./Steps/ThirdStep";

class AddAccess extends Component {
    _apiService = new ApiService();
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            selectedUsers: [],
            selectedApps: [],
            userList: [],
            applicationList: [],
            isModal: false,
            isLoading: false,
            userMappings: [],
            selectedApp: null,
        };
    }

    handleUserChange = selectedUsers => {
        this.setState({ selectedUsers });
    };

    handleAppChange = selectedApps => {
        this.setState({ selectedApps });
    };

    componentDidMount() {
        this.getAllUsers()
        this.getAllApplications()
    }

    getAllUsers = async () => {
        const {userList} = this.state
        this.setState({
            isLoading: true
        });
        const data = await this._apiService.getAllUsers()
        if(!data || data.error){
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        }else {
           let obj = {};
           (data || []).forEach((x, i) => {
               obj = {
                   ...x,
                   key: i
               };
               userList.push(obj)
           })
           this.setState({
               userList,
               isLoading: false
           })
        }
    }

    getAllApplications = async () => {
        const {applicationList} = this.state
        const data = await this._apiService.getAllApplications()
        if(!data || data.error){
            return message.error('something is wrong! please try again');
        }else {
            let obj = {};
            (data || []).forEach((x, i)=>{
                obj = {
                    name: x,
                    key: i
                };
                applicationList.push(obj)
            });

        }
    }

    onTextChange = (index, e, mainIndex) => {
        const {userMappings} = this.state;
        userMappings[mainIndex].apps[index][e.target.name] = e.target.value ;
        this.setState({
            userMappings
        })
    }

    modal = () => {
        return (
            <Modal
                visible={this.state.isModal}
                onCancel={this.showModal}
                title="Comments"
                footer={null}
                width={410}
            >
                <Row>
                    <Col md={12}>
                        <TextArea
                            placeholder="Comments"
                            autosize={{minRows: 2, maxRows: 6}}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }

    showModal = () => {
        this.setState({
            isModal: !this.state.isModal,
        });
    };

    onDelete = (appIndex, userIndex) => {
        const {userMappings} = this.state;
        const data = userMappings.find(u => String(u.key) === String(userIndex));
        data.apps = data.apps.filter(x => String(x.key) !== String(appIndex));
        this.setState({
            userMappings
        })
    };

    onAppSelect = (record) => {
        this.setState({
          selectedApp: record,
        });
    }

    next = () => {
        const current = this.state.current + 1;
        const userMappings = [];
        if (current === 2) {
            const {selectedUsers, selectedApps, userList, applicationList} = this.state;
            userList.forEach(user => {
                const apps = clonedeep(applicationList.filter(x => selectedApps.indexOf(x.key) !== -1));
                if (selectedUsers.indexOf(user.key) !== -1) {
                  userMappings.push({
                        ...user,
                        apps,
                    })
                }
            });
        }
        this.setState({
            current,
            userMappings
        });
    }

    onSubmit = async () => {
        this.setState({
            isSaving: true
        });
        const {userMappings} = this.state;
        let payload = [];
        (userMappings || []).forEach((x, i) => {
            const app = x.apps[i];
            const objPayload = {
                daEmail: "man1.sa@gmail.com",
                daFirstName: "DA_Manas",
                daLastName: "DA_Sama1",
                euEmail: x.email,
                euFirstName: x.firstName,
                euLastName: x.lastName,
                accessType: app && app.accessType ? app.accessType : '',
                appName: app && app.name,
                specialInstruction: app && app.specialInstruction ? app.specialInstruction : '',
                appDesc: app && app.description ? app.description : '',
                createdDate: new Date(),
                closingComment: '',
                appRole: '',
                orgId: "89",
                requestId: 3,
                decision: 'required',

            };
            payload.push(objPayload);
        });
        const data = await ApiService.putReviewAndApproveData(payload);
        if(!data || data.error) {
            this.setState({
                isSaving: false
            });
            return message.error('something is wrong! please try again');
        }else {
            this.setState({
                isSaving: false
            });
            return message.success('Review And Approve update successfully!');
        }
    }

    previous = () => {
      this.setState({
        current: this.state.current - 1
      });
    }

    render() {
        const {current, selectedUsers, selectedApps, isLoading, userList, applicationList, userMappings} = this.state;
        return (
            <Container className="dashboard">
                {this.modal()}
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="12" sm="12">
                                        <Steps direction="horizontal" size="small" current={current}>
                                            <Step title="Select User(s)"/>
                                            <Step title="Select App(s)"/>
                                            <Step title="Review & Add Details"/>
                                        </Steps>
                                    </Col>
                                </Row>
                                <Row className="mt-10">
                                    <Col md="12" sm="12">
                                        {current === 0 &&
                                        <div>
                                            <FirstStep
                                                isLoading={isLoading}
                                                userList={userList}
                                                selectedUsers={selectedUsers}
                                                handleUserChange={this.handleUserChange}
                                            />
                                        </div>}
                                        {current === 1 &&
                                        <div>
                                            <SecondStep
                                                selectedApps={selectedApps}
                                                applicationList={applicationList}
                                                handleAppChange={this.handleAppChange}
                                            />
                                        </div>}
                                        {current === 2 &&
                                        <div>
                                            <ThirdStep
                                                userMappings={userMappings}
                                                onDelete={this.onDelete}
                                                onTextChange={this.onTextChange}
                                                onAppSelect={this.onAppSelect}
                                            />
                                        </div>}
                                    </Col>
                                </Row>
                                <div className="mt-20">
                                    {current >= -1 && current < 2 &&
                                        <Button disabled={(current === 0 && !selectedUsers.length) || (current === 1 && !selectedApps.length)}
                                                className="float-right" type="primary" onClick={this.next}>
                                            Next
                                        </Button>
                                    }
                                    {current >= 1 && current <= 2 &&
                                      <Button className="float-left" type="primary" onClick={this.previous}>
                                          Previous
                                      </Button>
                                    }
                                    {
                                        current === 2 &&
                                        <>
                                            <Button type="primary float-right" className="mr-5" onClick={this.onSubmit}>Submit</Button>
                                        </>
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

}
export default AddAccess


