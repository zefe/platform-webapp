import AuthService from "./AuthService";

export default class Requests{
  constructor(){
    this.AuthSrv = new AuthService();
  }

  add(from,data){
    console.debug(data);
    return this.AuthSrv.requestFetch(from,{
      method:'POST',
      body:JSON.stringify(data)
    }).catch(this.handleError);
  }

  query(from){
    return this.AuthSrv.requestFetch(from,{
      method:'GET'
    }).catch(this.handleError);
  }

  delete(from,id){
    console.debug(id);
    return this.AuthSrv.requestFetch(from,{
      method:'DELETE',
      body: JSON.stringify({_id:id})
    }).catch(this.handleError);
  }

  ActivateOrDeactivate(from,id){
    return this.AuthSrv.requestFetch(from,{
      method:'PUT',
      body: JSON.stringify({_id:id})
    }).catch(this.handleError);
  }

  update(from,data){
    console.debug(data);
    return this.AuthSrv.requestFetch(from,{
      method:'PUT',
      body: JSON.stringify(data)
    }).catch(this.handleError);;
  }

  list(from){
    return this.AuthSrv.requestFetch(from,{
      method:'GET'
    }).catch(this.handleError);
  }
  
  handleError(error){
    console.error("Error en request ",error);
    return Promise.resolve(false);
  }

}
