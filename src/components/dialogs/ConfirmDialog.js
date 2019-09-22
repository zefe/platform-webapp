import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, IconButton, Typography, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import NewIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';

export default class ConfirmDialog extends Component{
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render(){
    return(
      <span>
         <IconButton onClick={this.handleClickOpen}>
            <DeleteIcon/>
        </IconButton>
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.props.confirmTitle}</DialogTitle>
        <DialogContent>
        {this.props.confirmMessage}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={()=>{this.handleClose();this.props.onConfirm()}} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </span>
    )
  }
}