import { Component } from "react";
import { Route,BrowserRouter } from "react-router-dom" ;

import Header from './Component/Header/Header';
import Home from './Component/Home/home'
import Page from './Component/page/page'

class Router extends Component{
    render(){
        return(
            <BrowserRouter>
               <Header/>
               <Route exact path="/" component={Home}/>
               <Route path="/home" component={Home}/>
               <Route path="/page" component={Page}/>
             </BrowserRouter>
        );
    }
}

export default Router;