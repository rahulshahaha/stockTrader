import React from 'react';

class Card extends React.Component {
    static defaultProps = {
        holding:{

        }
    }


    formatDecimal(x) {
        return parseFloat(x).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

 
    render(){

        var price = this.props.holding.price;
        var quantity = this.props.holding.quantity;
        var priceBought = this.props.holding.priceBought;
        var purchaseValue = quantity * priceBought;
        var percentUp = 100*((this.props.holding.price - this.props.holding.priceBought) / this.props.holding.priceBought);
        var value = this.props.holding.quantity * this.props.holding.price;
        var valueChange = (this.props.holding.quantity * this.props.holding.price) - (this.props.holding.quantity * this.props.holding.previousClose);
        var valueChangeClass = valueChange >= 0 ? "valueChangeUp" : "valueChangeDown"
        var dollarsUp = (this.props.holding.price * this.props.holding.quantity) - (this.props.holding.priceBought * this.props.holding.quantity);
        var performanceClass = dollarsUp >= 0 ? "overallPerformanceUp noSelect" : "overallPerformanceDown noSelect";
   

        //Formatting
        valueChange = this.formatDecimal(valueChange.toFixed(2));
        value = this.formatDecimal(value.toFixed(2));
        percentUp = percentUp.toFixed(2);
        dollarsUp = this.formatDecimal(dollarsUp.toFixed(2));
        price = this.formatDecimal(price.toFixed(2));
        priceBought = this.formatDecimal(priceBought.toFixed(2));
        purchaseValue = this.formatDecimal(purchaseValue.toFixed(2));
        quantity = this.formatDecimal(quantity.toFixed(2));

        return(
           <div className={this.props.cardClass}>
               <h1 className="companyName noSelect">{this.props.holding.name} ({this.props.holding.key})</h1>
               <h1 className="currentPrice noSelect">${price} <span className={this.props.holding.changeType}>({this.props.holding.percentChange}%)</span></h1>
               <h6 className="overall noSelect">Purchase: {quantity} @ ${priceBought} (${purchaseValue})</h6>
               <h6 className="overall noSelect">Value:<span className={valueChangeClass}> ${value} (${valueChange})</span></h6>
               <h6 className="overall noSelect">Gain:<span className={performanceClass}> ${dollarsUp} ({percentUp}%)</span></h6>
           </div>
        )
    }
   }


   export default Card;
