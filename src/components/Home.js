import React,{Component} from 'react';
import { Card, Grid, CardHeader } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import ChartScaleBand from './commons/ChartScaleBand';
import Requests from '../services/Requests';


class Home extends Component{

    constructor(props){
        super(props);
        this.state = {chartData:[[{ x:0, y:0}],[{ x:0, y:0}]]}
        this.requests = new Requests()
    }

    render(){
        const {chartData} = this.state;
        return (
            <div style={{textAlign:'center'}}>
                <Grid container spacing={24}>
                    <Grid item sm={6}>
                        <Card>
                            <CardHeader title='Ingresos'/>
                            <ChartScaleBand chartData={chartData[0]}/>
                        </Card>
                            </Grid>
                    <Grid item sm={6}>
                        <Card>
                            <CardHeader title='Ventas'/>
                            <ChartScaleBand chartData={chartData[1]}/>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }

    componentDidMount(){
        this.getLists();
    }
    async getLists(){
        let datas = [[],[]];
        await this.requests.list('/ingreso/grafico12meses').then(l=>{
            console.log(l)
            let sorted = l.sort((elA,elB)=> elA._id.mes - elB._id.mes);
            sorted.forEach(item => {
                datas[0].push({x:item._id.mes, y:item.total})
            }); 
        })
        await this.requests.list('/venta/grafico12meses').then(l=>{
            let sorted = l.sort((elA,elB)=> elA._id.mes - elB._id.mes);
            sorted.forEach(item => {
                datas[1].push({x:item._id.mes, y:item.total})
            }); 
        })
        this.setState({chartData:datas})
    }
}


export default withRouter(Home);