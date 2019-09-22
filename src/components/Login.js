import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import {TextField,Button, CardHeader} from '@material-ui/core'
import AuthService from './../services/AuthService';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { indigo } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
const styles = theme =>({
    bgindigo:{
        backgroundColor:indigo[500]
    },
    whiteColor:{
        color:'white'
    }
})

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {email:'',password:''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    render(){
        const {classes} = this.props;
        return (
            <div style={{alignContent:'center'}}>
            <Card style={{width:'500px',height:'300px',marginLeft:'calc(50% - 250px)',marginTop:'15%'}}>
                <div style={{textAlign:'center'}}>
                <CardHeader classes={{root:classes.bgindigo,title:classes.whiteColor}} title={'Acceso al sistema'}/>
                </div>
                <CardContent>
                <form onSubmit={this.handleSubmit}>
                    <TextField style={{width:'100%'}} type="text" label="Email" name='email' onChange={this.handleChange}></TextField>
                    <br/>
                    <br/>
                    <TextField style={{width:'100%'}} type="password" label="Password" name='password' onChange={this.handleChange}></TextField>
                    <br/>
                    <br/>
                    <div style={{textAlign:'right'}}>
                    <Button type="submit" variant='contained' color='primary'>Ingresar</Button>
                    </div>
                    <br/>
                    <br/>
                </form>
                </CardContent>
            </Card>
            </div>
        )
    }

    handleChange(ev){
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    handleSubmit(ev){
        ev.preventDefault();
        console.log(this.state);
        this.Auth.login(this.state.email,this.state.password).then(resp=>{
            this.props.onAuthChange();
            this.props.history.replace('/');
        }).catch(err=>{
            alert(err);
        })
    }

}

export default withRouter(withStyles(styles)(Login));