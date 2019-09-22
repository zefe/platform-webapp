import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl, Menu } from '@material-ui/core';
import NewIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

export default class NewDialog extends Component{
  state = {
    open: false,
    form:{}
  };

  valueChanges = (property,value)=>{
    let form = this.state.form;
    form[property] = value;
    this.setState({form});
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  pushItem = (property,id)=>{
    if(id == "default")//Opcion por defecto de un select
      return
    let indx = this.props.fields[property].options.findIndex(el=>el.id == id);
    let form = this.state.form;
    if(!Array.isArray(form[property]))
      form[property] = [];
    if(form[property].findIndex(el=>el._id == id)==-1){
      //Solo agregamos un articulo que no este en la lista
      form[property].push({_id:id,articulo:this.props.fields[property].options[indx].value,precio:1,cantidad:1});
    }
    this.setState({form});
  }

  changeItemContent(property,index,subproperty,value){
    let form = this.state.form;
    form[property][index][subproperty] = value;
    this.setState({form});
  }

  render(){
    return(
      <div>
      <IconButton onClick={this.handleClickOpen}>
                    <NewIcon/>
                    <Typography>
                    Nuevo
                    </Typography>
      </IconButton>
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          {Object.keys(this.props.fields).map(key=>{
            if(!this.props.fields[key].type || this.props.fields[key].type ==="TextField"){
              return (
                <TextField autoFocus margin="dense" 
                id={key} 
                key={key} 
                label={key.toLocaleUpperCase()} 
                type="text"
                onChange={(ev)=>{this.valueChanges(key,ev.target.value)}}
                fullWidth/>
              )
            }else if(this.props.fields[key].type === "Password"){
              return (
                <TextField autoFocus margin="dense" 
                id={key} 
                key={key} 
                label={key.toLocaleUpperCase()} 
                type="password"
                onChange={(ev)=>{this.valueChanges(key,ev.target.value)}}
                fullWidth/>
              )
            }
            else if(this.props.fields[key].type === "Select"){
              return(
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor={'select'+key}>
                    {key.toUpperCase()}
                  </InputLabel>
                  <Select
                  value={this.state.form[key] || "default"}
                  id={'select'+key}
                  onChange={(ev)=>{this.valueChanges(key,ev.target.value)}}
                  fullWidth>
                  <MenuItem value="default">
                  <em>Seleccionar</em>
                  </MenuItem>
                  {this.props.fields[key].options.map(item=>{
                    return(
                      <MenuItem value={item.id}>{item.value}</MenuItem>
                      )
                    })
                  }
                  </Select>
                </FormControl>
              )
            }else if(this.props.fields[key].type === "ShopList"){
              return (
                <div>
                <hr/>
                {this.props.fields[key].discount?"Agregar Productos a Venta":"Agregar Productos a Ingreso"}
                <FormControl fullWidth>
                  <Select
                    value={"default"}
                    id={'select'+key}
                    onChange={(ev)=>this.pushItem(key,ev.target.value)}
                    fullWidth
                  >
                    <MenuItem value="default"><em>Seleccionar articulo</em></MenuItem>
                    {this.props.fields[key].options.map(item=>{
                      return(
                        <MenuItem value={item.id}>{item.value}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <br/>
                  <div style={{maxHeight:"250px",overflow:"auto"}}>
                    {Array.isArray(this.state.form[key]) && this.state.form[key].map((el,i)=>(
                      <div>
                        <IconButton onClick={()=>{this.state.form[key].splice(i,1);this.setState(this.state.form[key])}}>
                          <DeleteIcon color="error"></DeleteIcon>
                        </IconButton>
                        <TextField readOnly margin="dense"
                          id={el.id}
                          key={el.id}
                          label={"Articulo"}
                          value={el.articulo}
                          type="text"
                          style = {{width:"35%"}}
                          onChange = {(ev)=>{/**Nothing*/}}
                        />
                        <TextField autoFocus margin="dense"
                          id={el.id + "precio"}
                          key={el.id + "precio"}
                          label={"Precio"}
                          defaultValue={el.precio}
                          type="number"
                          style = {{width:"15%"}}
                          onChange = {(ev)=>{this.changeItemContent(key,i,'precio',ev.target.value)}}
                        />
                        <TextField autoFocus margin="dense"
                          id={el.id + "cantidad"}
                          key={el.id + "cantidad"}
                          label={"Cantidad"}
                          defaultValue={el.cantidad}
                          type="number"
                          style = {{width:"15%"}}
                          onChange = {(ev)=>{this.changeItemContent(key,i,'cantidad',ev.target.value)}}
                        />
                        {this.props.fields[key].discount
                        &&
                        <TextField autoFocus margin="dense"
                          id={el.id + "descuento"}
                          key={el.id + "descuento"}
                          label={"descuento"}
                          defaultValue={0}
                          type="number"
                          style = {{width:"10%"}}
                          onChange = {(ev)=>{this.changeItemContent(key,i,'descuento',ev.target.value)}}
                        />
                        }
                        <TextField readOnly margin="dense"
                          id={el.id + "subtotal"}
                          key={el.id + "subtotal"}
                          label={"Subtotal"}
                          value={el.precio * el.cantidad - (el.descuento?el.descuento:0)}
                          type="number"
                          style = {{width:"10%",marginLeft:"5%"}}
                          onChange = {(ev)=>{/**Nothing*/}}
                        />
                        
                      </div>
                    ))}
                    {Array.isArray(this.state.form[key]) && this.state.form[key].length>0
                      && (
                        <div style={{textAlign:"right"}}>
                          <div>Total Parcial: <strong>$ {calcularPacial(this.state.form[key],(this.state.form['impuesto'] || 0))}</strong></div>
                          <div>Total Impuesto: <strong></strong> {(this.state.form['impuesto'] || "0")}</div>
                          <div>Total Neto: <strong>$ {this.state.form['total']=sumarPrecios(this.state.form[key])} </strong></div>
                        </div>
                      )
                    }                    
                  </div>
                </div>
              )
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={()=>{this.handleClose();this.props.register(this.state.form)}} color="primary">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    )
  }
}

function calcularPacial(arrItems,impuesto){
  return truncar(sumarPrecios(arrItems) * (1-impuesto),2);
}

function sumarPrecios(arrItems){
  return arrItems.reduce((p,c)=>{return p+(c.cantidad*c.precio-(c.descuento?c.descuento:0))},0);
}

function truncar(valor,decimales){
  return parseFloat((valor+='').substring(0,valor.lastIndexOf('.')+decimales+1)) || 0;
}