import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import InvoiceForm from './InvoiceForm';

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }

  GenerateInvoice = (event) => {
    html2canvas( document.querySelector("#invoiceCapture"), { logging: false, letterRendering: 1, allowTaint: true, useCORS: true } ).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4'
        });

        pdf.internal.scaleFactor = 1;
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('facture-001.pdf');
    })
  };

  render() {
    return(
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <InvoiceForm isEdit={false} info={this.props.info} />
          </div>

          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={this.GenerateInvoice}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Télécharger une copie
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

export default InvoiceModal;
