import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);

    if (!props.isEdit) {
      this.state = props.info
    } else {
      this.state = {
        factureDate: this.getCurrentDate(),
        isOpen: false,
        currency: '€',
        currentDate: '',
        invoiceNumber: 1,
        dateOfIssue: '',
        billTo: '',
        billToEmail: '',
        billToAddress: '',
        billFrom: '',
        billFromEmail: '',
        billFromAddress: '',
        notes: '',
        total: '0.00',
        subTotal: '0.00',
        taxRate: '',
        taxAmmount: '0.00',
        discountRate: '',
        discountAmmount: '0.00',
        entrepriseLogo: 'https://placehold.co/400x400/jpeg?text=VOTRE+LOGO',
        entrepriseName: 'Sigma Consulting',
        entrepriseAddress: '2 allée victor hugo',
        entreprisePostalCode: '75310',
        entrepriseCountry: 'France',
        entrepriseCity: 'Paris',
        entrepriseSiret: '123 568 941 00056',
        entrepriseTva: 'FR 32 123456789',
        entreprisePhone: '06 01 33 33 20',
        entrepriseEmail: 'service@sigmaconsult.com',
        customerName: 'Ive BRACHET',
        customerAddress: '7 avenue richard lenoire',
        customerPostalCode: '75120',
        customerCountry: 'France',
        customerCity: 'Paris',
      };
      this.state.items = [
        {
          id: 0,
          description: 'AAAA',
          price: '1.00',
          quantity: 1,
          total: 1
        }
      ];
    }

    this.editField = this.editField.bind(this);
  }

  getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  componentDidMount(prevProps) {
    this.handleCalculateTotal();
  }

  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };

  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
    this.handleCalculateTotal();
  }

  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.map(function(item) {
      subTotal += parseFloat(parseFloat(item.price) * parseInt(item.quantity))
    });

    this.setState({
      subTotal: parseFloat(subTotal).toFixed(2)
    }, () => {
      this.setState({
        taxAmmount: parseFloat(parseFloat(subTotal) * (this.state.taxRate / 100)).toFixed(2)
      }, () => {
        this.setState({
          discountAmmount: parseFloat(parseFloat(subTotal) * (this.state.discountRate / 100)).toFixed(2)
        }, () => {
          this.setState({
            total: ((subTotal - this.state.discountAmmount) + parseFloat(this.state.taxAmmount))
          });
        });
      });
    });
  };

  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({items: newItems});
    this.handleCalculateTotal();
  };

  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({isOpen: true})
  };

  closeModal = (event) => this.setState({isOpen: false});

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;

        this.state.entrepriseLogo = imageUrl;
        this.editField(event);
      };

      reader.readAsDataURL(file);
    }
  };

  render() {
    return (<Form onSubmit={this.openModal}>
      <Row>
        <Col md={this.props.isEdit ? 8 : 12} lg={this.props.isEdit ? 9 : 12}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <Row className="pb-3 ent-logo">
              {this.props.isEdit && (
              <input type="file" className="d-none" id="entrepriseLogo" onChange={this.handleImageChange} />
              )}
              <label className="w-auto" htmlFor="entrepriseLogo">
                <Image src={this.state.entrepriseLogo} style={{width: 120 + 'px', height: 120 + 'px'}} />
              </label>
            </Row>
            <Row className="invoice-header mb-5">
              <Col>
                {this.props.isEdit ? (
                <Form.Control placeholder={"Nom de l'entreprise"} value={this.state.entrepriseName} type="text" name="entrepriseName" onChange={(event) => this.editField(event)} required="required" className="entreprise-name"/>
                ) : (
                  <h4>{this.state.entrepriseName}</h4>
                )}

                {this.props.isEdit ? (
                <Form.Control placeholder={"Adresse"} value={this.state.entrepriseAddress} type="text" name="entrepriseAddress" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.entrepriseAddress}</h6>
                )}

                {this.props.isEdit ? (
                <Form.Control placeholder={"Code Postal"} value={this.state.entreprisePostalCode} type="text" name="entreprisePostalCode" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.entreprisePostalCode}</h6>
                )}
                <Row>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"Pays"} value={this.state.entrepriseCountry} type="text" name="entrepriseCountry" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.entrepriseCountry}</h6>
                    )}
                  </Col>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"Ville"} value={this.state.entrepriseCity} type="text" name="entrepriseCity" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.entrepriseCity}</h6>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"SIRET"} value={this.state.entrepriseSiret} type="text" name="entrepriseSiret" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.entrepriseSiret}</h6>
                    )}
                  </Col>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"TVA"} value={this.state.entrepriseTva} type="text" name="entrepriseTva" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.entrepriseTva}</h6>
                    )}
                  </Col>
                </Row>
                {this.props.isEdit ? (
                <Form.Control placeholder={"Numéro de téléphone"} value={this.state.entreprisePhone} type="tel" name="entreprisePhone" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.entreprisePhone}</h6>
                )}
                {this.props.isEdit ? (
                <Form.Control placeholder={"Email"} value={this.state.entrepriseEmail} type="email" name="entrepriseEmail" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.entrepriseEmail}</h6>
                )}
              </Col>

              <Col>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2 h4">FACTURE&nbsp;N°&nbsp;</span>
                  {this.props.isEdit ? (
                  <Form.Control type="number" value={this.state.invoiceNumber} name={"invoiceNumber"} onChange={(event) => this.editField(event)} min="1" required="required"/>
                  ) : (
                    <h6>{this.state.invoiceNumber}</h6>
                  )}
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <span className="fw-bold me-2 h4">Date&nbsp;</span>
                  {this.props.isEdit ? (
                  <Form.Control type="date" value={this.state.factureDate} name="factureDate" onChange={(event) => this.editField(event)} style={{
                    }} required="required"/>
                  ) : (
                    <h6>{this.state.factureDate}</h6>
                  )}
                </div>

                {this.props.isEdit ? (
                <Form.Control placeholder={"Nom du client"} value={this.state.customerName} type="text" name="customerName" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.customerName}</h6>
                )}

                {this.props.isEdit ? (
                <Form.Control placeholder={"Adresse"} value={this.state.customerAddress} type="text" name="customerAddress" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.customerAddress}</h6>
                )}

                {this.props.isEdit ? (
                <Form.Control placeholder={"Code Postal"} value={this.state.customerPostalCode} type="text" name="customerPostalCode" onChange={(event) => this.editField(event)} required="required"/>
                ) : (
                  <h6>{this.state.customerPostalCode}</h6>
                )}

                <Row>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"Pays"} value={this.state.customerCountry} type="text" name="customerCountry" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.customerCountry}</h6>
                    )}
                  </Col>
                  <Col>
                    {this.props.isEdit ? (
                    <Form.Control placeholder={"Ville"} value={this.state.customerCity} type="text" name="customerCity" onChange={(event) => this.editField(event)} required="required"/>
                    ) : (
                      <h6>{this.state.customerCity}</h6>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <InvoiceItem isEdit={this.props.isEdit} onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items}/>

            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Total HT:
                  </span>
                  <span>{this.state.currency}{this.state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Remise:</span>
                  <span>
                    <span className="small ">({this.state.discountRate || 0}%)</span>
                    {this.state.currency} {this.state.discountAmmount || 0}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">TVA:</span>
                  <span>
                    <span className="small ">({this.state.taxRate || 0}%)</span>
                    {this.state.currency} {this.state.taxAmmount || 0}</span>
                </div>
                <hr/>
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                    fontSize: '1.125rem'
                  }}>
                  <span className="fw-bold">Total Net:</span>
                  <span className="fw-bold">{this.state.currency}{this.state.total || 0}</span>
                </div>
              </Col>
            </Row>

            <hr className="my-4"/>

            {( this.props.isEdit || (!this.props.isEdit && this.state.notes)) && (
            <Form.Label className="fw-bold">Information additionnelle:</Form.Label>
            )}

            { this.props.isEdit ? (
            <Form.Control placeholder="ex : - Détails bancaires &#10;- Condition de paiement&#10;- Date de règlement&#10;- .." name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={3}/>
            ) : (
              <h6>{this.state.notes}</h6>
            )}
          </Card>
        </Col>

        {this.props.isEdit && (
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100 btn-secondary">Aperçu la facture</Button>

            <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total}/>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Devise:</Form.Label>
              <Form.Select onChange={event => this.onCurrencyChange({currency: event.target.value})} className="btn btn-light my-1" aria-label="Change Currency">
                <option value="€">EUR (European Union)</option>
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="₹">INR (Indian Rupee)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Signapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">TVA:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Remise:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
        )}
      </Row>
    </Form>)
  }
}

export default InvoiceForm;
