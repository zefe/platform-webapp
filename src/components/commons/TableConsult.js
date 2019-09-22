import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import {Card, CardContent, Paper, IconButton} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import ReadIcon from '@material-ui/icons/Visibility';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import EditDialog from '../dialogs/EditDialog';
import ConfirmDialog from '../dialogs/ConfirmDialog';

export default class TableConsult extends Component{
    state={
        page:0,
        rowsPerPage:5,
        edit:false,
        itemSelected:null
    }

    handleEdit = (row)=>{
        this.setState({edit:true,itemSelected:row});
    }
    handleCloseEdit = ()=>{
        console.log("Close edit");
        this.setState({edit:false});
    }
    handleChangePage = (event, page) => {
        this.setState({ page });
      };
    
    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: parseInt(event.target.value) });
    };

    render(){
        const {page,rowsPerPage}=this.state;
        const fields = this.props.propertiesToEdit;
        if(this.props.data && this.props.data.length !==0){
            return(
                <div>
                <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                        {this.props.headers.map(
                            headerTitle=>(
                                <TableCell key={'h_'+headerTitle}>
                                {headerTitle}
                                </TableCell>
                            )
                        )}
                            <TableCell align="center">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.data.slice(page*rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                        (row,i)=>(
                            <TableRow key={'r_'+i}>
                            {this.props.ids.map((keyName,indR)=>(
                                <TableCell key={'rc_'+keyName+indR}>
                                    {row[keyName]}
                                </TableCell>
                            ))}
                            <TableCell align='center'>
                                <div>
                                <IconButton onClick={()=>{this.handleEdit(row)}}>
                                {this.props.isDetailView?(<ReadIcon/>):(<EditIcon/>)}
                                </IconButton>
                                {this.props.handleRemove!=null &&
                                    (<ConfirmDialog confirmTitle={this.props.confirmTitle} confirmMessage={this.props.confirmMessage} onConfirm={()=>this.props.handleRemove(row._id)}/>)
                                }                                
                                </div>
                            </TableCell>
                            </TableRow>
                        )
                    )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={this.props.data.length}
                            rowsPerPage={rowsPerPage}
                            labelRowsPerPage='Filas por pagina'
                            page={page}
                            SelectProps={{
                                native: true,
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                    
                </Table>
                </Paper>
                <EditDialog 
                    title={this.props.editTitle} 
                    open={this.state.edit} 
                    fields={fields} 
                    item={this.state.itemSelected} 
                    edit={this.props.handleOnEdit} 
                    handleClose={this.handleCloseEdit}/>
                </div>
                
            )
        }
        return (
            <Card>
                <CardContent style={{textAlign:"center"}}>
                    Sin registros
                </CardContent>
            </Card>
        )
    }
}

class TablePaginationActions extends Component {
    handleFirstPageButtonClick = event => {
      this.props.onChangePage(event, 0);
    };
  
    handleBackButtonClick = event => {
      this.props.onChangePage(event, this.props.page - 1);
    };
  
    handleNextButtonClick = event => {
      this.props.onChangePage(event, this.props.page + 1);
    };
  
    handleLastPageButtonClick = event => {
      this.props.onChangePage(
        event,
        Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
      );
    };
  
    render() {
      const { count, page, rowsPerPage } = this.props;
  
      return (
        <div style={{flexShrink:0}}>
          <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
          >
          <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
          >
          <KeyboardArrowLeft />
          </IconButton>
          <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
          >
          <KeyboardArrowRight />
          </IconButton>
          <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
          >
           
          <LastPageIcon />
          </IconButton>
        </div>
      );
    }
  }