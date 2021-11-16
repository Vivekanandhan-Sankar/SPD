import { Component } from 'react';
import comps from '../Array/homeArray';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import './home.css'


class Home extends Component{

    constructor(){
        super();
        this.state={
            isLoggedIn: false,
            user:undefined
        }
    }

    gotoPage(item){
        const url = `/page?name=${item.routess}&approve=${item.approva}`;
        this.props.history.push(url);
    }

    componentDidMount(){
        
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
        }
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
        debugger
    }

    render(){
        const {isLoggedIn,user} = this.state;
        return(
            <>
            {isLoggedIn 
            ?
        
            <div className="container">
            <div className="row">
                {
                    comps.map((item)=>{
                        return(
                            <div className="operations col-lg-3 col-md-5 col-12" onClick={()=> this.gotoPage(item)}>
                                <img src={item.images} className="images"/>
                                <div className="operations-name">
                                   <div className="item-ope">{item.operation}</div>
                                    <span className="item-con">{item.content}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            </div>
            :
            <div style={{'height':'557px','overflow':'hidden'}}>
            <div className="imageDiv">
            <img className="bankImage" src={require('../../Images/home-banner.jpg').default}/>
            </div>
            <div className="c811">811 Digital Savings Account is for everyone</div>
            <img className="capture" src={require('../../Images/Capture.PNG').default}/>
            </div>
            }
            </>
        );
    }
}

export default withRouter(Home); 