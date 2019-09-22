import React,{Component} from 'react';
import TableConsult from './commons/TableConsult';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AuthService from './../services/AuthService';
import Requests from '../services/Requests';
import NewDialog from './dialogs/NewDialog';


class Groups extends Component{

    
    constructor(props){
        super(props);
        console.log("Begin");
        this.Requests = new Requests();
        this.handleRegister = this.handleRegister.bind(this);
        this.handleOnEdit = this.handleOnEdit.bind(this);
        this.handleSwitchActivate = this.handleSwitchActivate.bind(this);
        
        this.headers = [['Nombre','Tipo Documento','Numero','Direccion','Telefono','Email','Rol','Estado']];
        this.ids = [['nombre','tipo_documento','num_documento','direccion','telefono','email','rol','estado']];

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
                    <Tab label='Usuarios'/>
                </Tabs>
                {
                    this.state.activeTab === 0 &&
                    (<div>
                        <NewDialog 
                            register={this.handleRegister} 
                            title='Nuevo usuario' 
                            fields={
                                {
                                    nombre:{type:'TextField'},
                                    rol:{type:'Select',options:[{id:"Administrador",value:"Administrador"},{id:"Almacenero",value:"Almacenero"},{id:"Vendedor",value:"Vendedor"}]},
                                    tipo_documento:{type:'Select',options:[{id:"DNI",value:"DNI"},{id:"RUC",value:"RUC"},{id:"CEDULA",value:"CEDULA"}]},
                                    num_documento:{type:'TextField'},
                                    direccion:{type:'TextField'},
                                    telefono:{type:'TextField'},
                                    email:{type:'TextField'},
                                    password:{type:'Password'}
                                }
                            }
                            key="tab1"/>
                        <TableConsult 
                            headers={headers} 
                            ids={ids} 
                            data={this.state.data[activeTab]} 
                            handleOnEdit={this.handleOnEdit}
                            handleRemove={this.handleSwitchActivate}
                            confirmTitle="Desactivar/activar usuario" 
                            confirmMessage="Estas seguro de desactivar/activar este usuario?"
                            propertiesToEdit={
                                {
                                    nombre:{type:'TextField'},
                                    rol:{type:'Select',options:[{id:"Administrador",value:"Administrador"},{id:"Almacenero",value:"Almacenero"},{id:"Vendedor",value:"Vendedor"}]},
                                    tipo_documento:{type:'Select',options:[{id:"DNI",value:"DNI"},{id:"RUC",value:"RUC"},{id:"CEDULA",value:"CEDULA"}]},
                                    num_documento:{type:'TextField'},
                                    direccion:{type:'TextField'},
                                    telefono:{type:'TextField'},
                                    email:{type:'TextField'},
                                    password:{type:'Password'}
                                }    
                            } 
                            editTitle={'Editar Usuario'}/>
                    </div>)
                }
                
            </div>
        )
    }

    handleSwitchActivate(id){
        const pathQuery = '/usuario/query?_id=';
        this.Requests.query(pathQuery+id).then(response=>{
            //Actualizar tabla activa
            const pathActDeactivate = '/usuario/'+((response.estado && response.estado==1)?"deactivate":"activate");
            this.Requests.ActivateOrDeactivate(pathActDeactivate,id).then(response=>{
                this.loadData();
            })
        });
    }

    handleOnEdit(data){
        const path = '/usuario/update';
        this.Requests.update(path,data).then(response=>{
            this.loadData();
        });
    }

    handleRegister(data){
        const path = '/usuario/add'
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
        const path = '/usuario/list';
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

export default Groups;