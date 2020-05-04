import React from 'react';
import Nav from './Nav';
import M from 'materialize-css';
import "firebase/auth";
import "firebase/firestore";
import * as firebase from "firebase/app";
import Card from './Card';

const firebaseConfig = {
  apiKey: "AIzaSyDzqyPJQMMgg0TW6A8Zjgq01EkkcUF_x7E",
  authDomain: "stock-trader-bf9f7.firebaseapp.com",
  databaseURL: "https://stock-trader-bf9f7.firebaseio.com",
  projectId: "stock-trader-bf9f7",
  storageBucket: "stock-trader-bf9f7.appspot.com",
  messagingSenderId: "864889241366",
  appId: "1:864889241366:web:b71ffb8b362b9510ae1a37",
  measurementId: "G-CTMQHHK354"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();





// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  var modalOptions = {
    opacity: 0,
    preventScrolling: false
}
  M.Modal.init(modals,modalOptions);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});





class App extends React.Component {
  
  state = {
    user: {
      id: 'placeholder'
    },
    userLoggedIn: false
  }

  

  signUp = (e) => {
    e.preventDefault();
    const signupForm = document.querySelector('#signup-form');
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-name'].value;
    document.getElementById("signup-form").reset();

    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();

    auth.createUserWithEmailAndPassword(email,password).then(cred => {
      db.collection('users').doc(cred.user.uid).set({
          email: email,
          name: name
      });
    });
  }

  logIn = (e) => {
    e.preventDefault();
    const loginForm = document.querySelector('#login-form');
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    // var form = new FormData(document.getElementById("logInForm"));
    // var email = form.get("email");
    // var password = form.get("password");

    auth.signInWithEmailAndPassword(email,password).then(cred => {
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });
  }

  logOut(){
    auth.signOut();
  }



 
  componentDidMount() {



    db.collection('games').doc('VkKYxxa3IFsqpo30lXal').onSnapshot(game => {
        this.setState({
          game: game.data(),
          gameID: game.id
        });
    });


    //auth changes
    auth.onAuthStateChanged(user => {
      if(user){
        db.collection('users').doc(user.uid).get().then(doc => {
          this.setState({
            user: doc,
            userLoggedIn: true
          });
        });
      }else{
        this.setState({
          user: {
            id: 'placeholder'
          },
          userLoggedIn: false
        })
      }
    });

 
  }

  passTurn = () => {
    var turnID = this.state.game.whoseTurn;
    if(turnID === 6){
      db.collection('games').doc(this.state.gameID).update({
        whoseTurn: 1
      })
    }else{
      db.collection('games').doc(this.state.gameID).update({
        whoseTurn: turnID + 1
      })
    }
  }

  currentUsersTurn(){
    if(this.state.userLoggedIn === true){
      if(this.state.game.whoseTurn === this.state.user.data().type){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  whoseTurn(){
    if(this.state.userLoggedIn === true){
      if(this.state.game.whoseTurn === this.state.user.data().type){
        return (
          <div>
            <h1>Your turn</h1>
            <h1>Whose turn: {this.state.game.whoseTurn}</h1>
            <button onClick={this.passTurn}>Pass turn</button>
          </div>
        )
      }else{
        return (
          <div>
            <h1>Its is NOT your turn</h1>
            <h1>Whose turn: {this.state.game.whoseTurn}</h1>
            <button onClick={this.passTurn}>Pass turn</button>
          </div>
        )
      }
    }else{
      return (
        <div>
          <p>You are not logged in</p>
        </div>
      )
    }
  }



  render(){
    var holding = {
      price: 100,
      priceBought: 90,
      quantity: 10,
      key: 'W',
      name: 'Wayfair',
      previousClose: 99,
      percentChange: 1,
      changeType: 'percentChangeUp'
    }

    var whoseTurn = this.whoseTurn();
    var cardClass = this.currentUsersTurn() ? 'card active' : 'card inactive'
    return (
      <div className="App">
        <Nav user={this.state.user} userLoggedIn={this.state.userLoggedIn} loginSubmit={this.logIn} signUpSubmit={this.signUp} logOut={this.logOut} ></Nav>
        {whoseTurn}
        <Card holding={holding} cardClass={cardClass}></Card>
      </div>
    );

  }
}

export default App;
