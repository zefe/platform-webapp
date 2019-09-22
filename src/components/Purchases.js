import React,{Component} from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AuthService from './../services/AuthService';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';
import { stat } from 'fs';


class Purchases extends Component{

    
    constructor(props){
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);
        
        this.headers = [
            ['Usuario','Proveedor','Tipo Comprobante','Serie Comprobante','Numero Comprobante','Total','Estado','Impuesto'],
            ['Nombre','Tipo Documento','Numero','Direccion','Telefono','Email']];
        this.ids = [
            ['usuario','persona','tipo_comprobante','serie_comprobante','num_comprobante','total','estado','impuesto']
            ,['nombre','tipo_documento','num_documento','direccion','telefono','email'],
            ['nombre']
        ];//Nombre de un articulo para lista de ingresos
    }

    state = {
        activeTab: 0,
        data: []
    };

    handleChange = (event, activeTab) => {
        this.setState({ activeTab },this.loadData);//Al cambiar de pestaña se hace peticion del nuevo valor del data
    };

    render(){
        const activeTab = this.state.activeTab;
        const headers = this.headers[activeTab];
        const ids = this.ids[activeTab];
        return (
            <div>
                <Tabs value={this.state.activeTab} onChange={this.handleChange}>
                    <Tab label='Ingresos'/>
                    <Tab label='Proveedores'/>
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog 
                            register={this.handleRegister} 
                            title='Nuevo ingreso' 
                            fields={
                                {
                                    persona:{type:"Select",options:this.state.data[1]?this.state.data[1].map(el=>({id:el._id,value:el.nombre})):[]},
                                    tipo_comprobante:{type:"Select",options:[{id:"Factura",value:"Factura"},{id:"Ticket",value:"Ticket"}]},
                                    serie_comprobante:{type:'TextField'},
                                    num_comprobante:{type:'TextField'},
                                    impuesto:{type:'TextField'},
                                    detalles:{type:'ShopList',options:this.state.data[2]?this.state.data[2].map(el=>({id:el._id,value:el.nombre})):[]}
                                }
                            }
                            key="tab1"/>
                        <TableConsult 
                            headers={headers} 
                            ids={ids} 
                            data={this.state.data[activeTab]} 
                            handleOnEdit={null}
                            isDetailView={true}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Anular ingreso" 
                            confirmMessage="Estas seguro de anular este ingreso?"
                            propertiesToEdit={
                                {
                                    persona:{type:"Read",as:'Proveedor'},
                                    tipo_comprobante:{type:"Read",as:'Tipo de documento'},
                                    serie_comprobante:{type:"Read",as:'Serie comprobante'},
                                    num_comprobante:{type:"Read",as:'Numero comprobante'},
                                    impuesto:{type:"Read",as:'Impuesto'},
                                    detalles:{type:"Read",as:'Productos',isList:true}
                                }
                            } 
                            editTitle={'Detalle de venta'}/>
                    </div>)
                }
                {
                    this.state.activeTab === 1 &&
                    (<div>
                        <NewDialog 
                            register={this.handleRegister} 
                            title='Nuevo proveedor' 
                            key="tab2"
                            fields={
                                {
                                    nombre:{type:'TextField'},
                                    tipo_documento:{type:"Select",options:[{id:'DNI',value:'DNI'},{id:'RUC',value:'RUC'},{id:'CEDULA',value:'CEDULA'}]},
                                    num_documento:{type:"TextField"},
                                    direccion:{type:"TextField"},
                                    telefono:{type:"TextField"},
                                    email:{type:"TextField"}
                                }
                            }/>
                        <TableConsult 
                            headers={headers} 
                            ids={ids} 
                            data={this.state.data[activeTab]} 
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={null}
                            confirmTitle="Desactivar/activar artículo" 
                            confirmMessage="Estás seguro de desactivar/activar este artículo?"
                            propertiesToEdit={
                                {
                                    nombre:{type:'TextField'},
                                    tipo_documento:{type:"Select",options:[{id:'DNI',value:'DNI'},{id:'RUC',value:'RUC'},{id:'CEDULA',value:'CEDULA'}]},
                                    num_documento:{type:"TextField"},
                                    direccion:{type:"TextField"},
                                    telefono:{type:"TextField"},
                                    email:{type:"TextField"}
                                }
                            } 
                            editTitle={'Editar Proveedor'}/>
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id){
        const pathQuery = '/ingreso/query?_id=';
        this.Requests.query(pathQuery+id).then(response=>{
            //Actualizar tabla activa
            const pathActDeactivate = ('/ingreso/')+((response.estado && response.estado==1)?"deactivate":"activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate,id).then(response=>{
                this.loadData();
            })
        });
    }

    handleOnEdit(data){
        const path = this.state.activeTab===0?'/ingreso/update':'/persona/update';
        if(this.state.activeTab===1){
            data['tipo_persona'] = "Proveedor";
        }
        this.Requests.update(path,data).then(response=>{
            this.loadData();
        });
    }

    handleRegister(data){
        const path = this.state.activeTab===0?'/ingreso/add':'/persona/add'
        if(this.state.activeTab===1){
            data["tipo_persona"]= 'Proveedor';
        }else{
            //Necesario agregar id del usuario que registra el ingreso
            data['usuario'] = this.Requests.AuthSrv.getProfile()._id;
        }
        this.Requests.add(path,data).then(response=>{
            this.loadData();
        });
    }

    componentDidMount(){
        console.log("Component loaded");
        this.loadData();
        this.loadInitialData('/persona/listProveedores',1);
        this.loadInitialData('/articulo/list',2);
    }

    loadInitialData(path,index){
        let ids = this.ids[index];
        return this.Requests.list(path).then(response=>{
            if(response && response.length !== 0){
                let dt = response;
                dt.map((el,i)=>{
                    let filterProperties = [];
                    filterProperties[i] = {};
                    ids.forEach(key=>{
                        if(el[key]._id){
                            el[key] = "";
                        }
                        filterProperties[i][key] = el[key];
                    })
                    return filterProperties;
                })
                let stateData = this.state.data.slice();
                stateData[index] = dt.slice();
                this.setState({data:stateData});
            }else{
                let stateData = this.state.data.slice();
                stateData[index] = [];
                this.setState({data:stateData});
            }
        })
    }

    loadData(){
        console.log('Getting list');
        const activeTab = this.state.activeTab;
        const ids = this.ids;
        const path = activeTab===0?'/ingreso/list':'/persona/listProveedores';
        console.log('from',path);
        return this.Requests.list(path).then(response=>{
            console.log(response);
            if(response && response.length !== 0){// El request no ha devuelto un arreglo vacio
                let dt = response;
                dt.map((el,i)=>{
                    let filterProperties = [];//Propiedades de interes
                    filterProperties[i] = {};//Inicializar el objeto para cada elemento del arreglo
                    ids[activeTab].forEach(key=>{
                        if(el[key]._id){
                            el[key] = el[key].nombre;
                        }
                        filterProperties[i][key] = el[key];
                    })
                    return filterProperties;
                });
                console.log(dt);
                let stateData = this.state.data.slice();
                stateData[activeTab] = dt.slice();
                this.setState({data:stateData});
            }else{
                let stateData = this.state.data.slice();
                stateData[activeTab] = [];
                this.setState({data:stateData})
            }
        });
    }
}

export default Purchases;