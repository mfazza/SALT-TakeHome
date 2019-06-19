import React from 'react';
import Trader from './trader';

//Props received: name (from ControlPannel) and price of cryptocurrencies(from Manager)
export interface IProps { name: string; usd: number; btc: number; ltc: number; doge: number; xmr: number; }

//States: the amount of each cryptocurrency in the database(wallet)
export interface IState { name: string; usdCount: number; btcCount: number; ltcCount: number; dogeCount: number; xmrCount: number; totalValue: number }

class Dashboard extends React.Component<IProps, IState> {
    interval: NodeJS.Timeout | undefined;

    constructor(props: any) {
        super(props)

        this.state = {
            name: "",
            usdCount: -1,
            btcCount: -1,
            ltcCount: -1,
            dogeCount: -1,
            xmrCount: -1,
            totalValue: -1
        }

    }

    //important: this function is passed as a prop to trader so when a trade is made, that child component can update the parent
    refreshWallet() {
        fetch("https://salt-trader.herokuapp.com/child/" + this.props.name)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    name: this.props.name,
                    usdCount: responseJson.usd,
                    btcCount: responseJson.btc,
                    ltcCount: responseJson.ltc,
                    dogeCount: responseJson.doge,
                    xmrCount: responseJson.xmr
                })
            })
            .then(() => this.totalValue())
            .catch((err) => {
                console.log("This call relies on props being updated first.  The props haven't updated yet.")
                console.log(err);
            })
    }


    totalValue() {
        let total = ((this.state.btcCount + (this.state.ltcCount * this.props.ltc) + (this.state.dogeCount * this.props.doge) + (this.state.xmrCount * this.props.xmr)) * this.props.btc) + this.state.usdCount

        this.setState({ totalValue: total })
    }

    /* componentWillReceiveProps 
    *   if the state of the parent changes, it will also update this component. 
    *   This method is invoked before a mounted component receives new props.
    */
    componentWillReceiveProps() {
        this.setState({
            name: this.props.name
        })
        this.refreshWallet()
    }


    render() {
        return (
            <div>
                <div className="dashboard">
                    <h2>{this.state.name}'s Assets:</h2> {'   '}
                    <div > USD: {Number(this.state.usdCount)}  {'  '}  </div>
                    <div > BTC: {Number(this.state.btcCount)}  {'  '}  </div>
                    <div > LTC: {Number(this.state.ltcCount)}  {'  '} </div>
                    <div > DOGE: {Number(this.state.dogeCount)}  {'  '} </div>
                    <div > XMR: {Number(this.state.xmrCount)}  </div>
                    <div > Total Value: {this.state.totalValue.toFixed(2)} {'  '} USD </div>
                </div>
                <div className="trader">
                    <Trader
                        name={this.state.name}
                        usdCount={this.state.usdCount}
                        btcCount={this.state.btcCount}
                        ltcCount={this.state.ltcCount}
                        dogeCount={this.state.dogeCount}
                        xmrCount={this.state.xmrCount}
                        btcPrice={this.props.btc}
                        ltcPrice={this.props.ltc}
                        dogePrice={this.props.doge}
                        xmrPrice={this.props.xmr}
                        refreshFunction={this.refreshWallet()}>
                    </Trader>
                </div>
            </div>
        )
    }

}

export default Dashboard;