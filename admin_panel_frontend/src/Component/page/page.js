import { Component } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { Tab , Tabs , TabList, TabPanel } from "react-tabs";
import './page.css'
import axios from "axios";
class Page extends Component{

    constructor(){
        super();
        this.state = {
            name:'',
            approve:'',
            pending:[],
            approved:[],
            rejected:[],
            random:0,
            balance:''
        }
    }
    componentDidMount(){
        const qs = queryString.parse(this.props.location.search);
        const {name,approve} = qs
        this.setState({
            name : name,
            approve : approve
        })
        axios.get(`http://localhost:2555/${this.state.name}/pending`)
        .then(result =>{
            this.setState({
                pending: result.data.accounts
            })
        })
        .catch(error =>{
            console.log(error)
        })
        debugger
    } 

    handlePending = () =>{
        axios.get(`http://localhost:2555/${this.state.name}/pending`)
        .then(result =>{
            this.setState({
                pending: result.data.accounts
            })
        })
        .catch(error =>{
            console.log(error)
        })
        debugger
    }
    
    handleApproved = () =>{
        axios.get(`http://localhost:2555/${this.state.name}/approved`)
        .then(result =>{
            this.setState({
                approved: result.data.accounts
            })
        })
        .catch(error =>{
            console.log(error)
        })
    }
    handleRejected = () =>{
        axios.get(`http://localhost:2555/${this.state.name}/rejected`)
        .then(result =>{
            this.setState({
                rejected: result.data.accounts
            })
        })
        .catch(error =>{
            console.log(error)
        })
        debugger
    }
    approve =(itemId) =>{
        var rand = Math.floor(Math.random() * (9999999999-1000000000+1)+100000000);
        if(this.state.name==="accounts"){
            var bal = window.prompt(
                "APPROVED!! Enter the opening account balance : ( in INR )"
            );
        }
        this.setState({
            balance:bal,
            random:rand
        })
        console.log(rand)
        console.log(bal)
        bal = parseInt(bal)
        const obj ={
            status:"approved",
            accountNo: rand,
            balance : bal
        }

        axios({
            method:'PUT',
            url:`http://localhost:2555/${this.state.approve}/${itemId}`,
            header:{ 'Content-Type': 'application/json' },
            data: obj
        })
        .then(result =>{
            this.setState({
                
            })
        })

        .catch(error=>{
            console.log(error)
        })
        
        if(this.state.name==="cards"){
            window.alert("APPROVED!! the requested ATM card will be delivered to your branch");
            }
        debugger
    }
    reject =(itemId) =>{
        if(this.state.name==="accounts"){
          window.alert(
                "Rejected!! "
            );
        }
        const obj ={
            status:"rejected",
        }

        axios({
            method:'PUT',
            url:`http://localhost:2555/${this.state.approve}/${itemId}`,
            header:{ 'Content-Type': 'application/json' },
            data: obj
        })
        .then(result =>{
            this.setState({
                
            })
        })

        .catch(error=>{
            console.log(error)
        })
        
        if(this.state.name==="cards"){
            window.alert("REJECTED");
            }
        debugger
    }
    deposit = (item)=>{
        var bal = item.balance;
        var upbal = window.prompt("Enter the amount in INR :");
        upbal = parseInt(upbal)
        bal = parseInt(bal)
        var newBal = upbal + bal;

        const obj = {
            balance:newBal
        }
        axios({
            method:'PUT',
            url:`http://localhost:2555/deposit/${item.firstName}`,
            header:{ 'Content-Type': 'application/json' },
            data: obj
        })
        .then(result =>{
            this.setState({
                
            })
        })

        .catch(error=>{
            console.log(error)
        })
        setTimeout(() => {
            window.location.reload(false);
        }, 1000);
        debugger
        
    }
    withdraw = (item)=>{
        var bal = item.balance;
        var upbal = window.prompt("Enter the amount in INR :");
        upbal = parseInt(upbal)
        bal = parseInt(bal)
        var newBal = bal-upbal;

        const obj = {
            balance:newBal
        }
        axios({
            method:'PUT',
            url:`http://localhost:2555/deposit/${item.firstName}`,
            header:{ 'Content-Type': 'application/json' },
            data: obj
        })
        .then(result =>{
            this.setState({
                
            })
        })

        .catch(error=>{
            console.log(error)
        })
        setTimeout(() => {
            window.location.reload(false);
        }, 1000);
        debugger
    }
    render(){
        const {name,pending,approved,rejected} = this.state;
        return(
            <>
            <div className="heading">{name} Section</div>
            <div>
                <Tabs>
                    <TabList>
                        <Tab className="reactTab" onClick={()=>this.handlePending()}>Pending</Tab>
                        <Tab className="reactTab" onClick={()=>this.handleApproved()}>Approved</Tab>
                        <Tab className="reactTab" onClick={()=>this.handleRejected()}>Rejected</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="row">
                            {
                                pending.map(item =>{
                                    return(
                                    <div className="col-md-5 col-12 col-lg-3 single">
                                    <div className="items">Account Holder :</div><span className="items2">{item.firstName} {item.lastName}</span>
                                    <div className="items">Address :</div><span className="items2">{item.address}</span>
                                    <div className="items">State :</div><span className="items2">{item.state} - {item.zip}</span>
                                    <div className="items">Country :</div><span className="items2">{item.country}</span>
                                    <div className="items">Mobile No :</div><span className="items2">{item.mobileno}</span>
                                    {
                                        name === "cards" 
                                        ?
                                        <><div className="items" style={{'fontWeight':'600'}}>Account No :</div><span className="items2" style={{'fontWeight':'800','color':'green'}}>{item.accountNo}</span></>
                                        :
                                        <></>
                                    }
                                    {
                                        name ==="loans"
                                        ?
                                        <><div className="items" style={{'fontWeight':'600'}}>Account No :</div><span className="items2" style={{'fontWeight':'800','color':'green'}}>{item.accountNo}</span>
                                        <div className="items" style={{'fontWeight':'600'}}>AMOUNT :</div><span className="items2" style={{'fontWeight':'800','color':'green'}}>{item.amount}</span>
                                        </>
                                        :
                                        <></>
                                    }

                                    <div className="top-line"><div className="status">STATUS :</div><span className={item.status === "approved" ? "approved" : "pending"}>{item.status}</span></div>
                                    <span className="rejectButton"  onClick={()=>this.reject(item.firstName)}>Reject</span><span className="approveButton" onClick={()=>this.approve(item.firstName)}>Approve</span>
                                    </div>
                                   )
                                })
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div className="row">
                            {
                                approved.map(item =>{
                                    return(
                                    <div className="col-md-5 col-12 col-lg-3 single">
                                    <div className="items">Account Holder :</div><span className="items2">{item.firstName}{item.lastName}</span>
                                    <div className="items">Address :</div><span className="items2">{item.address}</span>
                                    <div className="items">State :</div><span className="items2">{item.state} - {item.zip}</span>
                                    <div className="items">Mobile No :</div><span className="items2">{item.mobileno}</span>
                                    <div className="items" style={{'fontWeight':'600'}}>ACCOUNT NO :</div><span className="items2" style={{'fontWeight':'600','color':'green'}}>{item.accountNo}</span>
                                    

                                    <div className="top-line2"><div className="status">STATUS :</div><span className={item.status === "approved" ? "approved" : "pending"}>{item.status}</span></div>
                                    
                                    {
                                        name === "cards" 
                                        ?
                                        <><div className="items" style={{'fontWeight':'600','marginBottom':'20px'}}>Card Type:</div><span className="items2" style={{'fontWeight':'800','color':'green'}}>RUPAY DEBIT CARD</span>
                                        <div style={{'fontWeight':'600'}}>The Card will be delivered within 7 days</div>
                                        </>
                                        :
                                        <></>
                                    }
                                    {
                                        name === "accounts"
                                        ?
                                        <>
                                        <div className="items" style={{'fontWeight':'600'}}>Balance:</div><span className="items2" style={{'fontWeight':'600','color':'green'}}>{item.balance}</span>
                                        <span className="rejectButton"  onClick={()=>this.withdraw(item)}>Withdraw update</span><span className="approveButton" onClick={()=>this.deposit(item)}>Deposit update</span></>
                                        :
                                        <></>
                                    }
                                    </div>
                                   )
                                })
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div className="row">
                            {
                                rejected.map(item =>{
                                    return(
                                    <div className="col-md-5 col-12 col-lg-3 single">
                                         <div className="items">Account Holder :</div><span className="items2">{item.firstName}{item.lastName}</span>
                                    <div className="items">Address :</div><span className="items2">{item.address}</span>
                                    <div className="items">State :</div><span className="items2">{item.state} - {item.zip}</span>
                                    <div className="items">Mobile No :</div><span className="items2">{item.mobileno}</span>
                                    <div className="top-line"><div className="status">STATUS :</div><span className={item.status === "approved" ? "approved" : "pending"}>{item.status}</span></div>
                                    </div>
                                   )
                                })
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
            </>
        )
    }
}

export default withRouter(Page);