import React, {useState, useEffect} from 'react';
import './styles.css';
import {FiLogIn} from 'react-icons/fi';
import {Link, useHistory, withRouter} from 'react-router-dom';
import api from '../../services/api';
import {FiArrowLeft} from 'react-icons/fi';

interface Estabelecimento{
    id: number;
    nome: string;
    telefone:string;
    email: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    longitude: number;
    latitude: number;
    imagem: string;
}
const Painel = () =>{

    const [estabelecimentos, setEstabelecimentos] =  useState<Estabelecimento[]>([]);
    const history = useHistory();

    useEffect(() => {
        if(!localStorage.getItem('TokenAcesso')){
            history.push("/");
        }
    });

    
    //executa quando a página é carregada listando os items
    useEffect(() => {
        api.get('/estabelecimentos').then(response =>{
            setEstabelecimentos(response.data);            
        })
    }, []);

    function editEstabelecimento(id: number){
        localStorage.setItem("estabelecimento_id",`${id}`);
        history.push(`/create-estabelecimento/${id}`);
    }

    function deleteEstabelecimento(id: number){
        if(window.confirm("Tem certeza que deseja excluir esse registro?")){
            api.delete(`/estabelecimento/${id}`).then(response => {
                api.get('/estabelecimentos').then(res =>{
                    setEstabelecimentos(res.data);            
                });
            });
        }
    }

    return (
    <div id="page-create-estabelecimento">
        <div className="content">
            <header>
            <h2>Sistema de gerenciamento de estabelecimentos</h2>
            <Link to="/">
                <FiArrowLeft/>
                Voltar para Home
            </Link>
            <Link to="/logout">
                <FiArrowLeft/>
                Sair
            </Link>
            </header>
            <main>
                <div>
                    <h1>Seja bem vindo ao painel administativo do SGE.</h1>
                </div>
                <div className="btn-create-point">
                <Link to="/create-estabelecimento">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastre um Estabelecimento</strong>    
                    </Link>
                </div>
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Telefone</th>
                                <th>Cidade</th>
                                <th>UF</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                    {estabelecimentos.map(estabelecimento => (
                        <tr key={estabelecimento.id}>
                            <td>{estabelecimento.id}</td>
                            <td>{estabelecimento.nome}</td>
                            <td>{estabelecimento.email}</td>
                            <td>{estabelecimento.telefone}</td>
                            <td>{estabelecimento.cidade}</td>
                            <td>{estabelecimento.uf}</td>
                            <td>
                                <button onClick={() => editEstabelecimento(estabelecimento.id)} 
                                className="btn btn-green" >Editar</button>
                                <button onClick={() => deleteEstabelecimento(estabelecimento.id)}
                                className="btn btn-danger">Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>)
}

export default withRouter(Painel);