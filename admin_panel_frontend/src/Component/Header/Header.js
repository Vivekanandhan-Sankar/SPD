import { Component } from "react";
import './Header.css';
import Modal from "react-modal";
import axios from "axios"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid tomato',
        width: '350px'
    }
};

class Header extends Component{
    constructor(){
        super();
        this.state={
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined,
        }
    }
    componentDidMount() {
    

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
        }
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
    }    
    handleLoginButtonClick = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }
    handleSignUpButtonClick = () => {
        this.setState({
            isSignUpModalOpen: true
        });
    }
    resetLoginForm = () => {
        this.setState({
            isLoginModalOpen: false,
            username: '',
            password: '',
            loginError: undefined
        });
    }
    resetSignUpForm = () => {
        this.setState({
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            signUpError: undefined
        });
    }
    handleLogin = () => {
        // call the API to login the user
        const  { username, password } = this.state;
        const obj = {
            email: username,
            password: password
        }
        axios({
            method: 'POST',
            url: `http://localhost:2555/userLogin`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user[0]));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user[0],
                isLoggedIn: true,
                loginError: undefined
            });
            this.resetLoginForm();
        }).catch(error => {
            this.setState({
                loginError: 'Username or password is wrong !!'
            });
            console.log(error);
        });
        setTimeout(() => {
            window.location.reload(false);
        }, 500);
    }

    handleSignUp = () => {
        const  { username, password, firstName, lastName } = this.state;
        const obj = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        axios({
            method: 'POST',
            url: `http://localhost:2555/userSignUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            debugger
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                signUpError: undefined
            });
            this.resetSignUpForm();
        }).catch(error => {
            this.setState({
                signUpError: 'Error in SignUp'
            });
            console.log(error);
        });
    }
    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
        window.location.reload(false);
    }
    handleChange = (event, field) => {
        this.setState({
            [field]: event.target.value,
            loginError: undefined
        });
      }
    render(){
        const {background, isLoginModalOpen, username, password, isLoggedIn, user, loginError, isSignUpModalOpen, firstName, lastName, signUpError,isOrderModalOpen,orders} =this.state;
        return(
            <>
            <div className="navigationbar">
                {
                    isLoggedIn
                    ?
                    <>
                    <img className="imageBank" src={require('../../Images/bank-building.jpg').default} alt="bank image"/>
                    <span className="nameBank">KOD ADMIN PANEL</span>
                    <div className="float-end">
                        <span className="nameLogo">{user.firstName[0]}</span>
                        <span className="register px-2 mx-2" onClick={this.logout}>Log out</span>
                        <span className="login mx-2" style={{fontSize:"19px"}}>{user.firstName}</span>
                    </div>
                    </>
                    :
                    <>
                    <img className="imageBank" src={require('../../Images/bank-building.jpg').default} alt="bank image"/>
                    <span className="nameBank">KOD ADMIN PANEL</span>
                    <span className="register px-2 mx-2" style={{'display':'none'}} onClick={this.handleSignUpButtonClick}>Create an account</span>
                    <span className="register mx-4 my-2" onClick={this.handleLoginButtonClick}>Login</span>  
                    </>
                }  
            </div>
            <Modal isOpen={isLoginModalOpen} style={customStyles}>
            <h3>User Login</h3>
                    <form>
                    {
                        loginError ? <div className="alert alert-danger">{loginError}</div> : null
                    }
                    <label className="form-label">Username:</label>
                    <input type="text" value={username} placeholder="E-mail id is your username" className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                    <br />
                    <label className="form-label">Password:</label>
                    <input type="password" value={password} placeholder="Password" className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                    <br/>
                    <br/>
                    
                    <input type="button" className="btn btn-primary" onClick={this.handleLogin} value="Login"/>
                    <input type="button" className="btn" onClick={this.resetLoginForm} value="Cancel"/>
                    </form>

            </Modal>
            <Modal isOpen={isSignUpModalOpen} style={customStyles}>
                    <h3>User Signup</h3>
                    <form>
                        {
                            signUpError ? <div className="alert alert-danger">{signUpError}</div> : null
                        }
                        <label className="form-label">First Name:</label>
                        <input type="text" value={firstName} className="form-control" onChange={(event) => this.handleChange(event, 'firstName')} />
                        <br />
                        <label className="form-label">Last Name:</label>
                        <input type="text" value={lastName} className="form-control" onChange={(event) => this.handleChange(event, 'lastName')} />
                        <br />
                        <label className="form-label">Email:</label>
                        <input type="text" value={username} placeholder="username" className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                        <br />
                        <label className="form-label">Password:</label>
                        <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                        
                        <input type="button" className="btn btn-primary mt-2" onClick={this.handleSignUp} value="Sign Up"/>
                        <input type="button" className="btn" onClick={this.resetSignUpForm} value="Cancel"/>
                    </form>
                </Modal>
        </>
        );
    }
}

export default Header;