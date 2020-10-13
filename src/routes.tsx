import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreateEstabelecimento from './pages/CreateEstabelecimento';
import Painel from './components/Point/';
import Login from './pages/Login/';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreateEstabelecimento} path="/create-estabelecimento/:id?"/>
            <Route component={Painel} path="/list-estabelecimentos"/>
            <Route component={Login} path="/login"/>
        </BrowserRouter>
    );
}

export default Routes;