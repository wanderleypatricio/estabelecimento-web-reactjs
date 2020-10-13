import React, { memo, useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';
import './styles.css';

interface Data{
    
    id: number;
    imagem:string;
    nome: string;
    email: string;
    telefone: string;
    rua:string;
    bairro:string;
    cep:string;
    latitude: number;
    longitude: number;
    cidade: string;
    uf: string;
    
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreateEstabelecimento = () => {

    //lilsta de points
    const [dados, setDados] = useState({} as Data);
    //lista de ufs
    const [ufs, setUfs] = useState<string[]>([]);
    //lista de citys
    const [citys, setCitys] = useState<string[]>([]);
    //pega a posição inicial do usuário para exibir sua localização no mapa
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    //pega a posição selecionada pelo usuário
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    //pega o estado que foi selecionado pelo usuário
    const [selectedUf, setSelectedUf] = useState('0');
    //pega o cidade selecionada pelo usuario
    const [selectedCity, setSelectedCity] = useState('0');
    //pega os dados do formulário dos campos name, email e whatsapp
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        email: '',
        telefone: '',
        rua:'',
        bairro:'',
        cep:'',
    });

    const [selectedFile, setSelectedFile] = useState<File>();
    
    const history = useHistory();
    //pega a localização do usuário quando a página é carregada
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        if(!localStorage.getItem('TokenAcesso')){
            history.push("/");
        }
    });
    
    useEffect(() => {
        const estabelecimento_id = localStorage.getItem("estabelecimento_id");
        if(estabelecimento_id){   
            api.get(`/estabelecimento/${estabelecimento_id}`).then(response =>{
                setDados(response.data);  
                              
            });
            localStorage.removeItem("estabelecimento_id");  
             
        }        
    }, []);

    //lista todos os estados quando a página for carregada
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    //lista todas as cidades de um estado assim que o estado for selecionado
    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response =>{
            const cityNames = response.data.map(city => city.nome);
            setCitys(cityNames);
        })
    }, [selectedUf]);

    

    //pega o valor selecionado no campo select do estado
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    //pega o valor selecionado no campo select do cidade
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    //pega a latitude e longitude do ponto selecionado pelo usuário no mapa
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    } 

    //pega as informações do formulário e armazena no formData
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    //pega os dados do formulário e grava no banco de dados
    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {id, nome, email,telefone, rua, bairro, cep} = formData;
        const uf = selectedUf;
        const cidade = selectedCity;
        const [latitude, longitude] = selectedPosition;
        
        const data = new FormData();
            data.append('id', id);
            data.append('nome', nome);
            data.append('telefone', telefone);
            data.append('email', email);
            data.append('rua', rua);
            data.append('bairro', bairro);
            data.append('cidade', cidade);
            data.append('uf', uf);
            data.append('cep', cep);
            data.append('longitude', String(longitude));
            data.append('latitude', String(latitude));
                        
            if(selectedFile){
                data.append('imagem', selectedFile);
            }
            
            const response = await api.post('/cadastrar-estabelecimento', data);
            if(response.status){
                alert('Estabelecimento cadastrado com sucesso!');
            }else{
                alert('Erro ao fazer o cadastro!');
            }
            

        history.push('/list-estabelecimentos');
    }

    return (
    <div id="page-create-estabelecimento">
        <header>
        <h2>SGE - Sistema de gerenciamento de estabelecimentos</h2>
            <Link to="/">
                <FiArrowLeft/>
                Voltar para Home
            </Link>
            <Link to="/list-estabelecimentos">
                <FiArrowLeft/>
                Ver a lista estabelecimento
            </Link>
            <Link to="/logout">
                <FiArrowLeft/>
                Sair
            </Link>
        </header>
        <main>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro de <br/>Estabelecimento</h1>
                
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                        <div className="field">
                            <label htmlFor="id">CNPJ</label>
                            <input 
                            type="text" 
                            name="id" 
                            id="id"
                            defaultValue={dados.id}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nome do estabelecimento</label>
                            <input type="text" name="nome" id="nome" 
                            defaultValue={dados.nome} 
                            onChange={handleInputChange}/>
                        </div>
                        
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" defaultValue={ dados.email} onChange={handleInputChange}/>
                        </div>
                        <div className="field-group">
                        <div className="field">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="text" name="telefone" id="telefone" defaultValue={dados.telefone } onChange={handleInputChange}/>
                        </div>
                        
                        <div className="field">
                            <label htmlFor="whatsapp">Rua</label>
                            <input type="text" name="rua" id="rua" defaultValue={dados.rua} onChange={handleInputChange}/>
                        </div>
                        </div>
                        <div className="field-group">
                        <div className="field">
                            <label htmlFor="whatsapp">Bairro</label>
                            <input type="text" name="bairro" id="bairro" defaultValue={dados.bairro} onChange={handleInputChange}/>
                        </div>                        
                        <div className="field">
                            <label htmlFor="whatsapp">Cep</label>
                            <input type="text" name="cep" id="cep" defaultValue={dados.cep} onChange={handleInputChange}/>
                        </div>
                        </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}
                        >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker coordinate={[dados.latitude, dados.longitude]} position={selectedPosition}/>
                        </Map>
                        <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">
                                {dados!= null ? dados.uf : 'Selecione um estado'}
                                    
                                </option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                            </div>
                            <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">
                                {dados!= null ? dados.cidade : 'Selecione uma cidade'}
                                </option>
                                {citys.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            </div>
                        </div>
                </fieldset>
                <button type="submit">Cadastrar Estabelecimento</button>
                
            </form>
        </main>
    </div>
    );
};



export default memo(CreateEstabelecimento);