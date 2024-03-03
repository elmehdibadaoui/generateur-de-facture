import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BiTrash } from "react-icons/bi";
import EditableField from './EditableField';

class InvoiceItem extends React.Component {
  render() {
    var onItemizedItemEdit = this.props.onItemizedItemEdit;
    var currency = this.props.currency;
    var rowDel = this.props.onRowDel;
    var isEdit = this.props.isEdit;
    var itemTable = this.props.items.map(function(item) {
      return (
        <ItemRow isEdit={isEdit} onItemizedItemEdit={onItemizedItemEdit} item={item} onDelEvent={rowDel.bind(this)} key={item.id} currency={currency}/>
      )
    });
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix Unitaire</th>
              <th>Total</th>
              {this.props.isEdit && (
              <th className="text-center">ACTION</th>
              )}
            </tr>
          </thead>
          <tbody>
            {itemTable}
          </tbody>
        </Table>
        {this.props.isEdit && (
        <Button className="fw-bold btn-secondary" onClick={this.props.onRowAdd}>Ajouter</Button>
        )}
      </div>
    );
  }
}

class ItemRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.item);
  }
  render() {
    return (
      <tr>
        <td style={{width: '100%'}}>
          {this.props.isEdit ? (
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
            type: "text",
            name: "description",
            placeholder: "Description produit / service / prestation",
            value: this.props.item.description,
            id: this.props.item.id
          }}/>
          ) : (
            this.props.item.description
          )}
        </td>
        <td style={{minWidth: '70px'}}>
          {this.props.isEdit ? (
          <EditableField
          onItemizedItemEdit={this.props.onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: this.props.item.quantity,
            id: this.props.item.id,
          }}/>
          ) : (
            this.props.item.quantity
          )}
        </td>
        <td style={{minWidth: '130px'}}>
          {this.props.isEdit ? (
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            presicion: 2,
            value: this.props.item.price,
            id: this.props.item.id,
          }}/>
          ) : (
            this.props.item.price
          )}
        </td>
        <td style={{minWidth: '130px'}}>
          {this.props.isEdit ? (
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
            leading: this.props.currency,
            type: "number",
            name: "total",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: parseFloat(this.props.item.price * this.props.item.quantity).toFixed(2),
            id: this.props.item.id,
          }}/>
          ) : (
            parseFloat(this.props.item.price * this.props.item.quantity).toFixed(2)
          )}
        </td>
        {this.props.isEdit && (
        <td className="text-center" style={{minWidth: '50px'}}>
          <BiTrash onClick={this.onDelEvent.bind(this)} style={{height: '33px', width: '33px', padding: '7.5px'}} className="text-white mt-1 btn btn-danger"/>
        </td>
        )}
      </tr>
    );
  }
}

export default InvoiceItem;
