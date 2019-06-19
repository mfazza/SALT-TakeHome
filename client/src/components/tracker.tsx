import * as React from 'react';

interface IProps { btc: number; ltc: number; doge: number; xmr: number; }

const Tracker: React.SFC<IProps> = (props) => {

    return (
        <div style={{ border: "1px solid red" }}>
            Current Prices {'     '}
            <div style={{ display: "inline-block" }}> BTC: {props.btc} USD {'  '} / </div>
            <div style={{ display: "inline-block" }}> LTC: {props.ltc} BTC {'  '} / </div>
            <div style={{ display: "inline-block" }}> DOGE: {props.doge} BTC {'  '}/ </div>
            <div style={{ display: "inline-block" }}> XMR: {props.xmr} BTC </div>
        </div>
    )
}

export default Tracker;