import React from 'react';



class LoginModal extends React.Component {


    render(){
        return (
            <div className="LoginModal">
                <div id="modal-login" className="modal grey darken-3">
                    <div className="modal-content">
                    <h4 className="white-text">Login</h4><br />
                    <form id="login-form" onSubmit={this.props.loginSubmit}>
                        <div className="input-field">
                        <input className="white-text" type="email" id="login-email" required />
                        <label htmlFor="login-email">Email address</label>
                        </div>
                        <div className="input-field">
                        <input className="white-text" type="password" id="login-password" required />
                        <label htmlFor="login-password">Your password</label>
                        </div>
                        <button className="btn black darken-2 z-depth-0">Login</button>
                        <p className="error pink-text center-align"></p>
                    </form>
                    </div>
                </div>
            </div>
        )
    }
}


export default LoginModal;