import * as React from 'react';

interface IProps { btc: number; ltc: number; doge: number; xmr: number; }

const Tracker: React.SFC<IProps> = (props) => {

    return (
        <div style={{ border: "1px solid red" }}>
            Current Prices: {'     '}
            <div style={{ display: "inline-block" }}> BTC: {props.btc} USD {'  '} - </div>
            <div style={{ display: "inline-block" }}> LTC: {Number(props.ltc).toFixed(6)} BTC {'  '}- </div>
            <div style={{ display: "inline-block" }}> DOGE: {Number(props.doge).toFixed(6)} BTC {'  '}- </div>
            <div style={{ display: "inline-block" }}> XMR: {Number(props.xmr).toFixed(6)} BTC </div>
        </div>
    )
}

export default Tracker;