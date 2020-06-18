import React, {Component} from 'react';
import moment from 'moment';
import {Card, CardBody, CardHeader, Col, Container, Row,} from "reactstrap";
import {Button, Input, Table, Select, message, Icon, Modal} from "antd";
import {ApiService} from "../../services";

class FileUpload extends Component {
    state = {
        isEdit: false,
        applicationType: '',
        applicationName: '',
        uploadHistory: [],
        isCSV: false,
        csvHeader: [],
        csvFileData: [],
        selectedCsvFileData: [],
        selectedCsvHeader: [],
    };


    getColumns = () => {
        return [
            {
                title: 'File Name',
                dataIndex: 'fileName'
            },
            {
                title: 'Type',
                dataIndex: 'appType'
            },
            {
                title: 'App Name',
                dataIndex: 'applicationName'
            },
            {
                title: 'Load Date',
                render: (record) =>{
                  return <span>{moment(record.loadDate).format('MM/DD/YYYY')}</span>
                }
            },
            {
                title: 'Status',
                dataIndex: 'status',
            },
            {
                title: '',
                render: (record, data, index) => {
                    return <div>
                        <Icon type="eye" onClick={() => this.onToggleCSV(record.file, index, record)}/>
                    </div>
                }
            },
        ];
    }

    onCloseCSV = () => {
        this.setState({
            isCSV: false,
            selectedCsvFileData: [],
            selectedCsvHeader:[],
        })
    }

    onToggleCSV = (selectedFile, SelectedIndex, record) => {
        this.setState({
            isCSV: true,
            selectedFile,
            SelectedIndex,
            selectedCsvFileData: record.selectedCsvFileData,
            selectedCsvHeader: record.selectedCsvHeader,

        })
    }

    CSVModal = () => {
        const {selectedFile, selectedCsvHeader, selectedCsvFileData} = this.state;
           const columns = (selectedCsvHeader || []).map((data, ind) => {
                return {
                    title: data,
                    dataIndex: data,
                    width: '10%'
                }
            })
        return (
            <Modal
                onCancel={this.onCloseCSV}
                visible={this.state.isCSV}
                width={"100%"}
            >
                <Row>
                    <Col md={12}>
                        <Table columns={columns} dataSource={selectedCsvFileData} size={"small"}/>
                    </Col>
                </Row>
            </Modal>
        )

    }

    onFileUpload = (e) => {
        e.preventDefault();
        this.setState({
            file: e.target.files[0],
        });
        const files = e.target.files;
        const f = files[0];
        const reader = new FileReader();
        const self = this;
        reader.onload = function (e) {
            // const data = e.target.result;
            // let readedData = XLSX.read(data, {type: 'binary'});
            // const wsname = readedData.SheetNames[0];
            // const ws = readedData.Sheets[wsname];
            // /* Convert array to json*/
            // const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
            // let csvFileData = [];
            // (dataParse || []).forEach((x, i) => {
            //     if(i !== 0){
            //         let object = {}
            //         x.forEach((y, idx) => {
            //             const key = dataParse[0][idx]
            //             object = {...object, [key]: y}
            //         })
            //         csvFileData.push(object)
            //     }
            // })
            // self.setState({
            //     fileData: dataParse,
            //     csvHeader: dataParse[0],
            //     csvFileData
            // });
            const rows = e.target.result.split('\n');
            const header = rows[0].split(',').filter(x => x);
            const csvFileData = [];
            rows.forEach((x, i) => {
                if (i === 0) {
                    return;
                }
                const data = x.split(',');
                let object = {};
                header.forEach((y, idx) => {
                    object[y]= data[idx];
                });
                csvFileData.push(object)
            });
            self.setState({
                csvHeader: header,
                csvFileData
            });
        };
        reader.readAsText(f);

    }

    onFileAdd = async () => {
        let {uploadHistory, file, applicationType, applicationName, csvHeader, csvFileData} = this.state;
        const formData = new FormData();
        formData.append("csvfile", file);
        const data = await ApiService.uploadcsvAuthcontroller(applicationType === 'ApplicationAccount' ? applicationName : applicationType, formData);
        if(!data || data.error){
            return message.error('something is wrong! please try again');
        } else {
            uploadHistory = [{
                fileName: file.name,
                file,
                loadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 'Stage',
                appType: applicationType,
                applicationName: applicationType === 'ApplicationAccount' ? applicationName : '-',
                selectedCsvHeader: csvHeader,
                selectedCsvFileData: csvFileData
            }].concat(uploadHistory);
            this.setState({
                file: null,
                uploadHistory,
                applicationName: '',
                applicationType: ''
            });
            return message.success('File uploaded successfully');
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onRunNow = async () => {
        let {uploadHistory} = this.state;
        let resFileLoader = null;
        let resEnrichmentLoader = null;
        if (uploadHistory.findIndex(x => x.applicationType === 'Role' || x.applicationType === 'Entitlement' || x.applicationType === 'Application')) {
            resEnrichmentLoader = await ApiService.LoadEnrichmentScheduler();
            if(!resEnrichmentLoader || resEnrichmentLoader.error){
              return message.error('something is wrong! please try again');
            }
        }
        if (uploadHistory.findIndex(x => x.applicationType === 'Users' || x.applicationType === 'ApplicationAccount')) {
          resFileLoader = await ApiService.LoadCSVScheduler();
          if(!resFileLoader || resFileLoader.error){
            return message.error('something is wrong! please try again');
          }
        }
        message.success('Data processed successfully!');
        this.setState({
          isEdit: false,
          applicationType: '',
          applicationName: '',
          uploadHistory: [],
        });
    }

    render() {
        const {applicationType, applicationName, uploadHistory, isCSV} = this.state;
        const getFileName = (selectedApplicationType) => {
            if(selectedApplicationType === 'Application'){
                return '/iga/Applications.csv';
            } else if(selectedApplicationType === "Entitlement"){
                return '/iga/Entitlements.csv';
            } else if(selectedApplicationType === "Role"){
                return '/iga/Roles.csv';
            } else if(selectedApplicationType === "Users"){
                return '/iga/Users.csv';
            } else if(selectedApplicationType === "ApplicationAccount"){
                return '/iga/ApplicationAccount.csv';
            }
        };
        return (
            <Container className="dashboard">
                {isCSV && this.CSVModal()}
                <Card>
                    <CardHeader className='custom-card-header'>
                        <Row className="main-div">
                            <Col md={10} sm={12} xs={12}>
                                <Col md={6} sm={12} xs={12} className="d-flex">
                                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/upload-file.png")} style={{width: 40}}/></a></span>
                                    <h4 className="mt-10">File Upload</h4>
                                </Col>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody  style={{minHeight: 600}}>
                        <Row className='align-items-center'>
                            <Col md={2} sm={12} xs={12}>
                                <span className="mr-10"><b>Type</b></span>
                            </Col>
                            <Col md={10} sm={12} xs={12}>
                                <Select className='w-100-p' value={applicationType}
                                        onChange={value => this.onChange({
                                            target: {
                                                name: 'applicationType',
                                                value
                                            }
                                        })}>
                                    <Select.Option value={""} disabled={true}>Select application type</Select.Option>
                                    <Select.Option value={"ApplicationAccount"}>Application Account</Select.Option>
                                    <Select.Option value={"Users"}>Identity/User Data</Select.Option>
                                    <Select.Option value={"Entitlement"}>Entitlement Enrichment</Select.Option>
                                    <Select.Option value={"Application"}>Application Enrichment</Select.Option>
                                    <Select.Option value={"Role"}>Role Enrichment</Select.Option>
                                </Select>
                            </Col>
                            {
                                applicationType === "ApplicationAccount" && <>
                                <Col md={2} sm={12} xs={12} className='mt-10'/>
                                <Col md={10} sm={12} xs={12} className='mt-10'>
                                <Input name='applicationName' value={applicationName} placeholder='Application Name' onChange={this.onChange}/>
                                </Col>
                                </>
                            }
                            {
                                !applicationType ? null :
                                    <>
                                    <Col md={2} sm={12} xs={12}/>
                                    <Col md={10} sm={12} xs={12} className='mt-10'>
                                        <p className='text-danger'>Note: Please upload file in required format.
                                            <a href={getFileName(applicationType)}
                                               download className='text-primary'>Sample File</a>
                                        </p>
                                    </Col>
                                    </>
                            }
                            <Col md={2} sm={12} xs={12}/>
                            <Col md={10} sm={12} xs={12} className='mt-10 d-flex'>
                               <input type='file' onChange={this.onFileUpload} accept=".csv"/>
                               <Button type="primary" disabled={!this.state.file || !applicationType || (applicationType === 'ApplicationAccount' && !applicationName)} onClick={this.onFileAdd}>Upload</Button>
                               {uploadHistory.length ?  <Button type="primary" className="pull-right ml-20" onClick={this.onRunNow}>Process</Button> : null}
                            </Col>
                            <Col md={2} sm={12} xs={12}/>
                            <Col md={10} sm={12} xs={12} className='mt-10'>
                                <Table columns={this.getColumns()} size='small' dataSource={this.state.uploadHistory}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default FileUpload
