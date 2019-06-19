import React from 'react';

/* Props *
*   name: the name selected on the homepage
*
*   counts: amount of particular coin retrieved from the database(wallet)
*
*   price: prices come from the api calls that fill the tracker
*/

export interface IProps {
    name: string;

    usdCount: number;
    btcCount: number;
    ltcCount: number;
    dogeCount: number;
    xmrCount: number;

    btcPrice: number;
    ltcPrice: number;
    dogePrice: number;
    xmrPrice: number;
    refreshFunction: void;
}

/* States *
*   
*   coinOrigin/coinTarget/amountOrigin: assigned by capturing values from the form
*
*   priceOrigin/priceTarget: assigned my matching the coin in the form dropdown to the corresponding price from props
*   
*   walletOrigin/walletTarget: amount of coin of type coinOrigin/coinTarget that exists in the wallet
*   
*/

export interface IState {
    coinOrigin: string;
    coinTarget: string;
    amountOrigin: number;
    priceOrigin: number;
    priceTarget: number;
    walletOrigin: number;
    walletTarget: number;
}

class Trader extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)

        this.handleTarget = this.handleTarget.bind(this)
        this.handleOrigin = this.handleOrigin.bind(this)
        this.handleAmount = this.handleAmount.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {
        coinOrigin: "usd",
        coinTarget: "usd",
        amountOrigin: 0,
        priceOrigin: 0,
        priceTarget: 0,
        walletOrigin: 0,
        walletTarget: 0
    }

    /* Form Handlers
    *
    *   I'm not able to overload these because typescript doesn't support dynamic selection of states.
    *   ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635
    *
    *   That being said, there's one for each element of the form: textbox, dropdown(left), dropdown(right), and submit
    *
    *   handleSubmit: checks if transaction is valid, then decides the kind of transaction, then makes fetch call.
    */

    handleTarget(event: React.FormEvent<HTMLSelectElement>) {
        this.setState({ coinTarget: event.currentTarget.value })
    }

    handleOrigin(event: React.FormEvent<HTMLSelectElement>) {
        this.setState({ coinOrigin: event.currentTarget.value })
    }

    handleAmount(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ amountOrigin: Number(event.target.value) })
    }


    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        var transactionIsValid = await this.checkAndSetUpTransaction();

        if (transactionIsValid) {

            var newAmount1: number;
            var newAmount2: number;

            //kinds of transactions: usd to btc, btc to usd, btc to anotherCrypto, anotherCrypto to btc
            if (this.state.coinOrigin === "usd" && this.state.coinTarget === "btc") {
                newAmount1 = this.props.usdCount - this.state.amountOrigin;
                newAmount2 = (this.state.amountOrigin / this.state.priceTarget) + this.state.walletTarget
            } else if (this.state.coinOrigin === "btc" && this.state.coinTarget === "usd") {
                newAmount1 = this.props.btcCount - this.state.amountOrigin;
                newAmount2 = (this.state.amountOrigin * this.props.btcPrice) + this.state.walletTarget
            } else if (this.state.coinOrigin === "btc") {
                newAmount1 = this.state.walletOrigin - this.state.amountOrigin;
                newAmount2 = (this.state.amountOrigin / this.state.priceTarget) + + this.state.walletTarget
            } else {
                newAmount1 = this.state.walletOrigin - this.state.amountOrigin;
                newAmount2 = (this.state.amountOrigin * this.state.priceOrigin) + this.state.walletTarget
            }


            fetch("https://salt-trader.herokuapp.com/child/" + this.props.name, {
                method: 'put',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ coin1: this.state.coinOrigin, coin2: this.state.coinTarget, amount1: newAmount1, amount2: newAmount2 }),
            })
                .then(() => this.props.refreshFunction)
                .catch((err) => console.log(err))
        } else {
            console.log("Transaction not valid");
        }
    }


    /* Auxiliary Functions
    *
    *   findCurrentPrice/findCurrentAmount: match the selection of the dropdown with the correct prop
    * 
    *   checkAndSetUpTransaction: verifies if the transaction is valid based on the constraints given. 
    *   It's important to make this function async in case a transaction happens faster than the component can 
    *   receive the values that get assigned to its state
    * 
    *   constraints:    can't make trade between same coins (usd->usd) or involving 0
    *                   can't make trades from usd to currencies other than bitcoin
    *                   can't make trades if there isn't enough of the origin coin to make the exchange
    * 
    */

    findCurrentPrice(coin: string) {
        if (coin === "usd") {
            return 1;
        } else if (coin === "btc") {
            return this.props.btcPrice
        } else if (coin === "ltc") {
            return this.props.ltcPrice
        } else if (coin === "doge") {
            return this.props.dogePrice
        } else if (coin === "xmr") {
            return this.props.xmrPrice
        } else {
            return -1
        }
    }

    findCurrentAmount(coin: string) {
        if (coin === "usd") {
            return this.props.usdCount;
        } else if (coin === "btc") {
            return this.props.btcCount
        } else if (coin === "ltc") {
            return this.props.ltcCount
        } else if (coin === "doge") {
            return this.props.dogeCount
        } else if (coin === "xmr") {
            return this.props.xmrCount
        } else {
            return -1
        }
    }

    async checkAndSetUpTransaction() {

        if (this.state.coinOrigin === this.state.coinTarget || this.state.amountOrigin === 0) {
            return false
        } else if (this.state.coinOrigin === "usd" && this.state.coinTarget !== "btc") {
            return false
        } else if (this.state.coinOrigin !== "btc" && this.state.coinTarget !== "btc") {
            return false
        } else {
            await this.setState({ priceOrigin: Number(this.findCurrentPrice(this.state.coinOrigin)) })
            await this.setState({ priceTarget: Number(this.findCurrentPrice(this.state.coinTarget)) })
            await this.setState({ walletOrigin: Number(this.findCurrentAmount(this.state.coinOrigin)) })
            await this.setState({ walletTarget: Number(this.findCurrentAmount(this.state.coinTarget)) })
        }


        if (this.state.amountOrigin <= this.state.walletOrigin) {
            return true;
        } else {
            return false;
        }
    }


    render() {
        return (
            <div>
                <h2>Make Trade</h2>
                <form onSubmit={e => this.handleSubmit(e)}>
                    <input type="text" onChange={e => this.handleAmount(e)}></input>
                    <select onChange={e => this.handleOrigin(e)}>
                        <option value="usd">USD</option>
                        <option value="btc">BTC</option>
                        <option value="ltc">LTC</option>
                        <option value="doge">DOGE</option>
                        <option value="xmr">XMR</option>
                    </select>
                    {' '}to{' '}
                    <select onChange={e => this.handleTarget(e)}>
                        <option value="usd">USD</option>
                        <option value="btc">BTC</option>
                        <option value="ltc">LTC</option>
                        <option value="doge">DOGE</option>
                        <option value="xmr">XMR</option>
                    </select>
                    {' '}
                    <input type="submit" value="submit"></input>
                </form>

            </div >
        )
    }






}

export default Trader;

