import React, {Component} from 'react';
import {Button, message} from "antd";
import {ApiService} from "../../../services";
import * as exceljs from 'exceljs';
import { saveAs } from 'file-saver';

class XLSXDownloadButton extends Component{
    constructor(props) {
        super(props);
        this.state = {}
    }

    onDownloadXLS = async () => {
        try {
            const {certificationId} = this.props;
            const data = await ApiService.getOfflineCertificationDetails(certificationId)
            if (!data || data.error) {
                return message.error('something is wrong! please try again');
            } else {
                if (!data.length) {
                    return message.error('No data found');
                } else {
                    /* const headerArray = ['UserName', 'DisplayName', 'Role', 'Application', 'Entitlement', 'Action', 'Comments'];
                     const bodyArray = [headerArray];
                     data.forEach(x => {
                         bodyArray.push([x.userName || '', x.displayName || '', x.roleName || '', x.applicationName || '', x.entitlement || '', x.action || '', x.comments || '']);
                     });
                     const wb = XLSX.utils.book_new();
                     const ws = XLSX.utils.aoa_to_sheet(bodyArray);

                     XLSX.utils.book_append_sheet(wb, ws, 'Certification');
                     XLSX.writeFile(wb, 'certification.xlsx', {compression: true});*/

                    data.map(x => {
                        x.action = x.action === 'certified' ? 'Approve' : (x.action === 'rejected' ? 'Revoke' : 'No-Action');
                        return x;
                    });
                    this.prepareAndDownload(data);
                }
            }
        } catch(err) {
            return message.error('Something went wrong! Please try again later!')
        }
    }

    prepareAndDownload = (rows) => {
        const workbook = new exceljs.Workbook();
        workbook.creator = 'Paul Leger';
        workbook.created = new Date();
        workbook.modified = new Date();

        const worksheet = workbook.addWorksheet("Certification");
        worksheet.columns = [
            {header: 'UserName', key: 'userName', width: 30},
            {header: 'DisplayName', key: 'DisplayName', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Role', key: 'roleName', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Application', key: 'applicationName', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Entitlement', key: 'entitlement', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Action', key: 'action', width: 25, style: {alignment: {wrapText: true}}},
            {header: 'Comments', key: 'comments', width: 25, style: {alignment: {wrapText: true}}},
        ];
        rows.forEach((x) => {
            worksheet.addRow(x);
        });
        rows.forEach((x, index) => {
            worksheet.getCell(`F${index+2}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                showErrorMessage: true,
                promptTitle: 'The value must be Approve or Revoke or No-Action',
                prompt: 'The value must be Approve or Revoke or No-Action',
                formulae: ['"Approve, Revoke, No-Action"']
            };
        });

        const firstRow = worksheet.getRow(1);
        firstRow.font = {name: 'New Times Roman', family: 4, size: 10, bold: true};
        firstRow.alignment = {vertical: 'middle', horizontal: 'center'};
        firstRow.height = 20;

        worksheet.getCell('B2').dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"Approve, Revoke, No-Action"']
        };

        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, "Certification.xlsx");
        });
    }

    onFileUpload = async (e) => {
        try {
            const {certificationId, campaignId, clientId, history} = this.props;
            e.preventDefault();
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("xlsxfile", file);
            const data = await ApiService.uploadXLSAuthcontroller(certificationId, campaignId, formData);
            if (!data || data.error) {
                return message.error('something is wrong! please try again');

            } else {
                message.success('File uploaded successfully')
                history.push(`/${clientId}/certification`)
            }
        } catch(er) {
            return message.error('Something went wrong! Please try again later!')
        }
    }

    render() {
        return(
            <>
            <Button className="icon square mb-0 ml-10" color="primary" size={"large"} onClick={this.onDownloadXLS}><a>
                <img src={require('../../../images/download.png')} style={{width: 22}}/></a>
                &nbsp; Download
            </Button>
            <Button className="icon upload-btn-wrapper square mb-0 ml-10" color="primary" size={"large"}>
                <img src={require('../../../images/download.png')} style={{width: 22}}/>&nbsp; Upload
                <input type="file" onChange={this.onFileUpload} accept=".xlsx"/>
            </Button>
                </>

        )
    }

}
export default XLSXDownloadButton
