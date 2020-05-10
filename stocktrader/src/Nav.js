import React from 'react';
import SignupModal from './SignupModal.js';
import LoginModal from './LoginModal';



class Nav extends React.Component {


    render(){
        let navBar;
        if(this.props.userLoggedIn){
            navBar = (
            <div className="navbar-fixed">
                <nav className="z-depth-0 grey darken-3 col l10">
                    <div className="row">
                        <div className="nav-wrapper col l10">
                            <a href="." className="brand-logo center">Welcome, {this.props.user.data().name}</a>
                            <ul id="nav-mobile" className="left">
                                <li className="logged-in">
                                    <button className="btn black darken-2 z-depth-0" id="logout" onClick={this.props.logOut}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            );
        }else{
            navBar = (
            <div className="navbar-fixed">
                <nav className="z-depth-0 grey darken-3">
                    <div className="nav-wrapper">
                        <a href="." className="brand-logo center">Please Login</a>
                        <ul id="nav-mobile" className="left">
                            <li className="logged-out">
                                <button className="btn black darken-2 z-depth-0 modal-trigger" data-target="modal-login">Login</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            );
        }



        return(
            <div className="nav">
                {navBar}
                <SignupModal signUpSubmit={this.props.signUpSubmit}></SignupModal>
                <LoginModal loginSubmit={this.props.loginSubmit}></LoginModal>
            </div>
        )
    }
   }


   export default Nav;
