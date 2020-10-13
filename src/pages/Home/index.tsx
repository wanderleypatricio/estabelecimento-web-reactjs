import React, {Component, ChangeEvent} from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import api from '../../services/api';

class Home extends Component{
    
    state = {
        estabelecimentos:[],
        busca:"",
    }

 
      async componentDidMount() {
        const response = await api.get('/estabelecimentos');
    
        this.setState({ estabelecimentos: response.data });

      }

      handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
          this.setState({busca: event.target.value});
          const data = new FormData();
          data.append('busca', this.state.busca);
        const response = api.post('/busca-estabelecimento/',data).then(response => response.data);    
        this.setState({ estabelecimentos: response });
        console.log(this.state.estabelecimentos);
      }

      render(){

        const { estabelecimentos } = this.state;
        
        return (
        <div id="page-home">
            <div className="content">
                <header>
                    <h2>SGE - Sistema de gerenciamento de Estabelecimentos</h2>
                    <div id="login">
                    <Link to="/login">
                        <strong>Login</strong>    
                    </Link>
                    </div>
                </header>
                
                <main>
                    <h1>SGE - Seu marketplace de Estabelecimentos.</h1>
                    <p>Ajudamos pessoas a encontrarem estabelecimentos onde mora ou em qualquer outro lugar do país.</p>
                    <div id="">
                        <form>
                            <fieldset>
                                <div className="field">
                                    <label htmlFor="name">Buscar</label>
                                    <input type="text" name="busca" id="busca"
                                    value={this.state.busca}
                                    onChange={this.handleInputChange} 
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div id="lista-de-estabelecimentos">
                    { estabelecimentos.length > 0 ? estabelecimentos.map( dado => (
                        <div id="box" key={dado['id']}>
                            
                            <div id="imagem"><img src={dado['imagem']}/></div>
                            <div id="titulo">{dado['nome']}</div>
                            <div id="descrição">
                            {dado['rua']+" " }
                            {dado['bairro']+" " }
                            {dado['cidade']+" " }
                            {dado['uf']+" " } 
                            {dado['cep']+" " }   
                            </div>
                            <div id="detalhes">
                                <Link to="/detalhes">
                                    <strong>Ver mais...</strong>    
                                </Link>
                                
                            </div>
                                                        
                    </div>
                    )): <h3>Não foram encontrados resgitros</h3>}
                    </div>
                </main>
            </div>
        </div>
        )
    }
}
export default Home;