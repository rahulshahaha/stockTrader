import React from 'react';
import Card from './Card';


class Deck extends React.Component {

    generateCards = () =>{

        if(currentHoldings == null){
            return null;
        }

        currentHoldings.sort(function(a,b){
            //return a.attributes.OBJECTID - b.attributes.OBJECTID;
            var returnValue = 0;
            if(a.value === b.value)
                returnValue = 0;
            if(a.value < b.value)
                returnValue = 1;
            if(a.value > b.value)
                returnValue = -1;

           return returnValue
        });
        var cardsList = this.props.currentHoldings.map(function(s){
            return <Card key={s.key} doubleClickFunction={func} holding={s} />;
        });
         return cardsList;
    }

    render(){
        return (
            <div className="deck">
                {this.generateCards()}
            </div>
        )
    }
}


export default Deck;