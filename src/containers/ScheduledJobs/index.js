import React, {Component} from 'react'
import moment from 'moment'
import {Card, CardBody, Col, Container, Row, CardHeader} from "reactstrap";
import {Button, message, Table, Switch, Spin} from "antd";
import {ApiService} from "../../services";

class ScheduledJobs extends Component {
  state = {
    isEdit: false,
    jobs: [],
    isLoading: false,
    isModifyUser: false,
    selectedRecord: {}
  };
  
  componentDidMount() {
    this.getJobs()
  }
  
  getFilteredJobs = () => {
    let {jobs, searchJob} = this.state;
    if (!searchJob) {
      jobs = (jobs || []).sort((a, b) => a.jobStatus > b.jobStatus ? 1 : -1);
      return jobs;
    }
    let filteredUserData = jobs || [];
    filteredUserData = filteredUserData.filter(x => {
      const name =  `${(x.FirstName || '')} ${(x.LastName || '')}`;
      return (name.toLowerCase().includes(searchJob.toLowerCase())) || (x.UserName.toLowerCase().includes(searchJob.toLowerCase())) || (x.Email.toLowerCase().includes(searchJob.toLowerCase()));
    });
    return filteredUserData;
  }
  
  getJobs = async () => {
    this.setState({
      isLoading: true
    });
    const data = await ApiService.GetScheduledJobs();
    if (!data || data.error) {
      this.setState({
        isLoading: false
      })
      return message.error('something is wrong! please try again');
    } else {
      this.setState({
        isLoading: false,
        jobs: (data && data.data) || []
      })
    }
    
  }
  
  getColumns = () => {
    return [
      {
        title: 'Job Name',
        dataIndex: 'jobName',
        width: '40%',
      },
      {
        title: 'Status',
        dataIndex: 'jobStatus',
      },
      {
        title: 'Next Schedule Time',
        render: (record) => {
          return record.nextFireTime ? moment(record.nextFireTime).format('MM/DD/YYYY') : ''
        }
      },
    ];
  }
  
  onChangeSearchUser = (event) => {
    this.setState({
      searchUser: event.target.value
    })
  }
  
  render() {
    const {isLoading} = this.state;
    return(
      <Container className="dashboard create-user">
          <Card>
            <CardHeader className='custom-card-header'>
              <Row className="main-div">
                <Col md={10} sm={12} xs={12}>
                  <Col md={6} sm={12} xs={12} className="d-flex">
                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/sources.png")} style={{width: 40}}/></a></span>
                    <h4 className="mt-10">Jobs</h4>
                  </Col>
                </Col>
                <Col md={2} sm={12} xs={12} className="text-right">
                  <Button className="square" size={"large"} onClick={this.getJobs} color="primary">Refresh</Button>}
                </Col>
              </Row>
            </CardHeader>
              <CardBody>
                {isLoading ? <Spin className='mt-50 custom-loading'/> :
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <Table
                          columns={this.getColumns()}
                          size="small"
                          dataSource={this.getFilteredJobs()}
                          pagination={{pageSize: 25}}
                      />
                    </Col>
                  </Row>
                }
              </CardBody>
            </Card>
      </Container>
    )
  }
}
export default ScheduledJobs
