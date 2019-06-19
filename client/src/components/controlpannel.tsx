import React from "react";
import Manager from './manager';

//All this does is pass the name from the selection into the other components
const ControlPannel: React.SFC<{ name: string }> = (props) => {
    return (<Manager name={props.name}></Manager>)
}

export default ControlPannel;