import React,{Component} from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AuthService from './../services/AuthService';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';


class Stock extends Component{

    
    constructor(props){
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);
        
        this.headers = [['Nombre','Descripcion','Estado'],['Codigo','Nombre','Categoria','Precio Venta','Stock','Descripcion','Estado']];
        this.ids = [['nombre','descripcion','estado'],['codigo','nombre','categoria','precio_venta','stock','descripcion','estado']];

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
                    <Tab label='Categorias'/>
                    <Tab label='Articulos'/>
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog 
                            register={this.handleRegister} 
                            title='Nueva categoria' 
                            fields={{nombre:{type:'TextField'},descripcion:{type:'TextField'}}}
                            key="tab1"/>
                        <TableConsult 
                            headers={headers} 
                            ids={ids} 
                            data={this.state.data[activeTab]} 
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar categoria" 
                            confirmMessage="Estas seguro de desactivar/activar esta categoría?"
                            propertiesToEdit={{nombre:{type:'TextField'},descripcion:{type:'TextField'}}} 
                            editTitle={'Editar Categoria'}/>
                    </div>)
                }
                {
                    this.state.activeTab === 1 &&
                    (<div>
                        <NewDialog 
                            register={this.handleRegister} 
                            title='Nuevo articulo' 
                            key="tab2"
                            fields={
                                {
                                    nombre:{type:'TextField'},
                                    categoria:{type:'Select',
                                        options:this.state.data[0].slice().map(el=>{
                                            console.log(el);
                                            return {id:el._id,value:el.nombre}
                                        })
                                    },
                                    codigo:{type:'TextField'},
                                    precio_venta:{type:'TextField'},
                                    stock:{type:'TextField'},
                                    descripcion:{type:'TextField'}
                                }
                            }/>
                        <TableConsult 
                            headers={headers} 
                            ids={ids} 
                            data={this.state.data[activeTab]} 
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar artículo" 
                            confirmMessage="Estás seguro de desactivar/activar este artículo?"
                            propertiesToEdit={
                                {
                                    nombre:{type:'TextField'},
                                    categoria:{type:'Select',
                                        options:this.state.data[0].slice().map(el=>{
                                            return {id:el._id,value:el.nombre}
                                        })
                                    },
                                    codigo:{type:'TextField'},
                                    precio_venta:{type:'TextField'},
                                    stock:{type:'TextField'},
                                    descripcion:{type:'TextField'}
                                }
                                
                            } 
                            editTitle={'Editar Articulo'}/>
                    </div>)
                }
            </div>
        )
    }

    handleSwitchActivate(id){
        const pathQuery = this.state.activeTab===0?'/categoria/query?_id=':'/articulo/query?_id=';
        this.Requests.query(pathQuery+id).then(response=>{
            //Actualizar tabla activa
            const pathActDeactivate = (this.state.activeTab===0?'/categoria/':'/articulo/')+((response.estado && response.estado==1)?"deactivate":"activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate,id).then(response=>{
                this.loadData();
            })
        });
    }

    handleOnEdit(data){
        const path = this.state.activeTab===0?'/categoria/update':'/articulo/update';
        this.Requests.update(path,data).then(response=>{
            this.loadData();
        });
    }

    handleRegister(data){
        const path = this.state.activeTab===0?'/categoria/add':'/articulo/add'
        this.Requests.add(path,data).then(response=>{
            this.loadData();
        });
    }

    componentDidMount(){
        console.log("Component loaded");
        this.loadData();
    }

    loadData(){
        console.log('Getting list');
        const activeTab = this.state.activeTab;
        const ids = this.ids;
        const path = activeTab===0?'/categoria/list':'/articulo/list';
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

export default Stock;