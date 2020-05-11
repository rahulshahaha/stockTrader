import React from 'react';
import M from 'materialize-css';
import "firebase/auth";
import "firebase/firestore";
import * as firebase from "firebase/app";
import Deck from './Deck';

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

//Reset game
//  var gameID = 'VkKYxxa3IFsqpo30lXal'
//  var game = db.collection('games').doc(gameID);

// db.collection('securities').get().then(securities => {
//   securities.docs.forEach(security => {
//     db.collection("securities").doc(security.id).delete()
//   })
//   db.collection('securities').add({
//     TypeName: 'Tech',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 1
//   })
//   db.collection('securities').add({
//     TypeName: 'Healthcare',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 2
//   })
//   db.collection('securities').add({
//     TypeName: 'Real Estate',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 3
//   })
//   db.collection('securities').add({
//     TypeName: 'Oil',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 4
//   })
//   db.collection('securities').add({
//     TypeName: 'Financial',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 5
//   })
//   db.collection('securities').add({
//     TypeName: 'Consumer Goods',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 6
//   })
//   db.collection('securities').add({
//     TypeName: 'Bond',
//     game: game,
//     price: 100,
//     previousClose: 100,
//     type: 7
//   })
// })

// db.collection('holdings').where('game','==',game).get().then(holdings => {
//   holdings.forEach(holding => {
//     db.collection('holdings').doc(holding.id).delete()
//   })
// })

// db.collection('users').get().then(users => {
//   db.collection('securities').where('game','==',game).get().then(securities => {
//       users.docs.forEach(user => {
//         var owner = db.collection('users').doc(user.id);
//         securities.docs.forEach(security => {
//           var thing = db.collection('securities').doc(security.id)
//           db.collection('holdings').add({
//             owner: owner,
//             game: game,
//             price: 100,
//             quantity: 0,
//             security: thing
//           })
//         })
//       })
//   })
// })


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  var modalOptions = {

}
  M.Modal.init(modals,modalOptions);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});





class App extends React.Component {
  
  state = {
    user: null,
    userLoggedIn: false,
    DBholdings: null,
    holdings: null,
    DBsecurities: null,
    securities: null
  }

  

  logIn = (e) => {
    e.preventDefault();
    const loginForm = document.querySelector('#login-form');
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

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


parseHoldings = () => {
  var DBholdings = this.state.DBholdings.docs;
  var holdings = [];
  DBholdings.forEach(holdingDoc => {
    //console.log(holdingDoc.data());
    var owner = db.collection('users').doc(holdingDoc.data().owner.id);
    holdings.push({
      ownerID: owner.id,
      price: holdingDoc.data().price,
      quantity: holdingDoc.data().quantity,
      securityID: holdingDoc.data().security.id
    });
  })
  this.setState({
    holdings: holdings
  })
}

parseSecurities = () => {
  var DBsecurities = this.state.DBsecurities.docs;
  var securities = [];
  DBsecurities.forEach(securityDoc => {
    securities.push({
      TypeName: securityDoc.data().TypeName,
      price: securityDoc.data().price,
      type: securityDoc.data().type,
      securityID: securityDoc.id,
      previousClose: securityDoc.data().previousClose
    })
  })
  this.setState({
    securities: securities
  })
}

 
  componentDidMount() {
    db.collection('games').doc('VkKYxxa3IFsqpo30lXal').onSnapshot(game => {
        this.setState({
          game: game
        });
    });


    //auth changes
    auth.onAuthStateChanged(user => {
      if(user){
        db.collection('users').get().then(users => {
          this.setState({
            allUsers: users.docs
          })
        })
        db.collection('users').doc(user.uid).get().then(doc => {
          this.setState({
            user: doc,
            userLoggedIn: true,
            whoseDataToShow: doc.id
          })
        });
        db.collection('holdings').onSnapshot(holdings => {
          this.setState({
            DBholdings: holdings
          }, () => {
            this.parseHoldings();
          });
        })
        var game = db.collection('games').doc('VkKYxxa3IFsqpo30lXal');
        db.collection('securities').where('game','==',game).onSnapshot(securities => {
          this.setState({
            DBsecurities: securities
          }, () => {
            this.parseSecurities();
          });
        })
      }else{
        this.setState({
          user: null,
          userLoggedIn: false,
          whoseDataToShow: null,
          allUsers: null,
          securities: null,
          holdings: null,
          DBholdings: null,
          DBsecurities: null
        })

      }
    });
  }





  render(){
    var loginButton = this.state.user != null ? (
      <button>Logout</button>
    ) : (
      <button>Login</button>
    )


    return (
      <div className="App">
        <div className="LeftMain">
          <div className="OtherPlayers">
              {/* <button>User</button>
              <button>User</button>
              <button>User</button>
              <button>User</button>
              <button>User</button>
              <button>User</button> */}
              <div>user</div>
              <div>user</div>
              <div>user</div>
              <div>user</div>
              <div>user</div>
              <div>user</div>
          </div>
          <div className="mainView">
            {loginButton}
            <Deck user={this.state.user} whoseDataToShow={this.state.whoseDataToShow} holdings={this.state.holdings} securities={this.state.securities}></Deck>
          </div>
          <div className="news">
            NEWS 
          </div>
        </div>
        <div className="feed">
          FEED
        </div>
        {/* <Nav user={this.state.user} userLoggedIn={this.state.userLoggedIn} loginSubmit={this.logIn} signUpSubmit={this.signUp} logOut={this.logOut} ></Nav> */}
        {/* <OtherUsers currentUser={this.state.user} allUsers={this.state.allUsers}></OtherUsers> */}
      </div>
    );

  }
}

export default App;
