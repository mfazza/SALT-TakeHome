import React, { Component } from 'react';
import Tracker from './tracker';
import Dashboard from './dashboard';

/* Manager Component 
*   makes API calls to retrieve price of cryptocurrencies and passes them as props to the descending components
*   
*   Refreshes itself every 15 seconds
*/
class Manager extends Component<{ name: string }> {
    interval: NodeJS.Timeout | undefined;

    state = {
        name: "",
        usd: 1,
        btc: 0,
        ltc: 0,
        doge: 0,
        xmr: 0
    }

    updateCryptos() {
        var promiseBtc = fetch('https://api.cryptonator.com/api/ticker/btc-usd')
            .then(response => response.json())
            .catch(error => this.setState({ btc: 999 }));

        var promiseLtc = fetch('https://api.cryptonator.com/api/ticker/ltc-btc')
            .then(response => response.json())
            .catch(error => this.setState({ ltc: 999 }));

        var promiseXrp = fetch('https://api.cryptonator.com/api/ticker/doge-btc')
            .then(response => response.json())
            .catch(error => this.setState({ doge: 999 }));

        var promiseDoge = fetch('https://api.cryptonator.com/api/ticker/xmr-btc')
            .then(response => response.json())
            .catch(error => this.setState({ xmr: 999 }));

        Promise.all([promiseBtc, promiseLtc, promiseXrp, promiseDoge]).then((values) => {
            this.setState({
                btc: values[0].ticker.price,
                ltc: values[1].ticker.price,
                doge: values[2].ticker.price,
                xmr: values[3].ticker.price
            })
        });
    }


    componentDidMount() {
        this.setState({ name: this.props.name })
        this.updateCryptos();
        this.updateCryptos();
        this.interval = setInterval(() => this.updateCryptos(), 15000);
    }


    render() {
        return (
            <div>
                <Tracker btc={this.state.btc} ltc={this.state.ltc} doge={this.state.doge} xmr={this.state.xmr}></Tracker>
                <Dashboard name={this.state.name} usd={this.state.usd} btc={this.state.btc} ltc={this.state.ltc} doge={this.state.doge} xmr={this.state.xmr}></Dashboard>
            </div>
        )
    }


}


export default Manager;
