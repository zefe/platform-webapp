import decode from 'jwt-decode';

export default class AuthService{

    constructor(domain){
        this.domain = domain || "http://localhost:3000/api";
        this.requestFetch = this.requestFetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(email,password){
        return this.requestFetch('/usuario/login',{
            method: 'POST',
            body: JSON.stringify({email,password})
        }).then(response=>{
            this.setToken(response.tokenReturn);
            this.setUser(response.user);
            return Promise.resolve(response);
        });
    }

    isLoggedIn(){
        return !!this.getToken();
    }

    setToken(token){
        localStorage.setItem('token_id',token);
    }

    getToken(){
        return localStorage.getItem('token_id');
    }

    setUser(userJSON){
        localStorage.setItem('user',JSON.stringify(userJSON));
    }

    getUser(){
        return JSON.parse(localStorage.getItem('user'));
    }

    getUserAccess(){
        let user = this.getUser();
        if(user){
            return user.rol;
        }else{
            return false;
        }
    }

    getProfile(){
        return decode(this.getToken());
    }

    logout(){
        localStorage.removeItem('token_id');
        localStorage.removeItem('user');
    }

    requestFetch(urlRelative,options){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(this.isLoggedIn()){
            headers['token'] = this.getToken();
        }

        return fetch(this.domain+ urlRelative,{
            headers,
            ...options
        }).then(response=>response.json()).catch(
            error=> Promise.reject(error)
        )
    }

}