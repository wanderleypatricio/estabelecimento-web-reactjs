import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import api from '../../services/api';
import './login.css';

interface Data{
    email: string;
    password:string;
}

const Login = () =>{
    const history = useHistory();
    //const [dados, setDados] = useState({} as Data);

    const [msg, setMsg] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',        
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {email,password} = formData;
        
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);
            
        const login =   await api.post('/login', data);
        console.log(login);
        if(login.data['access_token'] != null){
            localStorage.setItem("TokenAcesso", login.data['access_token']);
            history.push('/list-estabelecimentos');
        }else{
            setMsg(["Usuário e/ou senha inválidos"]);
            history.push('/');
        }      

        
    }
    return (
    <div id="page-login">
        <div className="content">
            <header>
                <h2>SGE - Sistema de gerenciamento de Estabelecimentos</h2>
                <div id="login">
                    Área apenas para usuários cadastrados
                </div>
            </header>
            
            <main>

                <div id="form-login">
                <span id="msg">{msg}</span>
                <form onSubmit={handleSubmit}>
                <fieldset>
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input className="form-control"
                            type="text" 
                            name="email" 
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Senha</label>
                            <input type="text" name="password" id="password" onChange={handleInputChange}/>
                        </div>
                        
                        
                </fieldset>
                <button className="btn btn-primary" type="submit">Entrar</button>
                
            </form>    
        </div>
            </main>
        </div>
    </div>)
}

export default Login;