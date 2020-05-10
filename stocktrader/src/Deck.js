import React from 'react';
import Card from './Card';


class Deck extends React.Component {

    createPortfoloio = () => {
        if(this.props.securities === null || this.props.holdings === null){
          return null;
        }else{
          var securities = this.props.securities;
          var holdings = this.props.holdings;
          var portfolio = [];

          holdings = holdings.filter(h => h.ownerID === this.props.whoseDataToShow);
      
          holdings.forEach(holding => {
            var price,priceBought,quantity,key,name,previousClose,percentChange,changeType,type;
            var security = securities.filter(sec => sec.securityID === holding.securityID)
            security = security[0];
            priceBought = holding.price;
            quantity = holding.quantity;
            price = security.price;
            key = security.TypeName;
            name = security.TypeName;
            previousClose = security.previousClose;
            percentChange = 100*((price - previousClose) / previousClose);
            changeType = percentChange >= 0 ? 'percentChangeUp' : 'percentChangeDown'
            type = security.type


            portfolio.push({
                price,
                priceBought,
                quantity,
                key,
                name,
                previousClose,
                percentChange,
                changeType,
                type
            })

      
          })
          var cardClass;
          if(this.props.user != null){
              cardClass = this.props.user.id === this.props.whoseDataToShow ? 'card active' : 'card inactive'
          }else{
              cardClass = 'card inactive'
          }
          return this.generateCards(portfolio,cardClass);
        }
      }

    generateCards = (currentHoldings,cardClass) =>{

        if(currentHoldings == null){
            return null;
        }

        currentHoldings.sort(function(a,b){
            //return a.attributes.OBJECTID - b.attributes.OBJECTID;
            var returnValue = 0;
            if(a.type === b.type)
                returnValue = 0;
            if(a.type < b.type)
                returnValue = -1;
            if(a.type > b.type)
                returnValue = 1;

           return returnValue
        });
        var cardsList = currentHoldings.map(function(s){
            return <Card cardClass={cardClass} key={s.key} holding={s} />;
        });
         return cardsList;
    }

    render(){
        return (
            <div className="deck">
                {this.createPortfoloio()}
            </div>
        )
    }
}


export default Deck;