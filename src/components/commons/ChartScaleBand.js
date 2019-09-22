import React,{Component} from 'react';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    BarSeries,
  } from '@devexpress/dx-react-chart-material-ui';
import { scaleBand } from '@devexpress/dx-chart-core';
import { ArgumentScale, Stack } from '@devexpress/dx-react-chart';

export default class ChartScaleBand extends Component{

    render(){
        const {chartData} = this.props;
        return (
            <Chart data={chartData}>
                <ArgumentScale factory={scaleBand} />
                <ArgumentAxis />
                <ValueAxis />
                <BarSeries valueField="y" argumentField="x" name="Young"/>
                <Stack />
            </Chart>
        )
    }
}