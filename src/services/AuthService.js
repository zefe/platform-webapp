import decode from 'jwt-decode';
export default class AuthService{
    //Incializar variables importantes
    constructor(domain){
        this.domain = domain || "http://localhost:3000/api"; //dominio del API server
        this.requestFetch = this.requestFetch.bind(this);

        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(email,password){
        return this.requestFetch('/usuario/login',{
            method:'POST',
            body: JSON.stringify({email,password}),
        }).then(response=>{
            console.log(response)
            this.setToken(response.token);
            this.setUser(response.user);
            return Promise.resolve(response);
        })
    }

    /**
     * Verificar si existe un token de usuario y sigue siendo valido
     */
    loggedIn(){
        console.debug(this.getToken());
        return !!this.getToken();
    }

    setToken(token){
        console.log("token setting",token);
        localStorage.setItem('token_id',token);
    }

    getToken(){
        return localStorage.getItem('token_id');
    }

    logout(){
        console.log("logout");
        localStorage.removeItem('token_id');
        console.log(this.getToken());
    }

    requestFetch(url,options){
        const headers = {
            'Accept':'application/json',
            'Content-Type':'application/json'
        }

        if(this.loggedIn()){
            headers['token'] = this.getToken();
        }

        return fetch(this.domain + url,{
            headers,
            ...options
        }).then(response => response.json()).catch(error=>Promise.reject(error));
    }


    setUser(user){
        localStorage.setItem('user',JSON.stringify(user));
    }

    getUser(){
        let objStorage = JSON.parse(localStorage.getItem('user'));
        return objStorage;
    }

    getUserAccess(){
        let user = this.getUser();
        if(user){
            return user.rol;
        }else{
            return false;
        }
    }
    /*_checkStatus(resp){
        if(resp.status){

        }
    }*/

    getProfile(){
        return decode(this.getToken());
    }
}
