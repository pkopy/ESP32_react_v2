import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import radwag from '../img/radwag_bl.svg'

const data = []
for (let i= 0; i < 1000; i++) {
    data.push(i)
}

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    {data.map(elem => 
                        <li>{elem}</li>    
                    )}
                </ul>
                <img src={radwag}></img>

            </div>
        );
    }
}

export default function Example() {
    const componentRef = useRef();
    return (
        <div>
            <ReactToPrint
                trigger={() => <button>Print this out!</button>}
                content={() => componentRef.current}
                copyStyles={true}
            />
            <ComponentToPrint ref={componentRef} />
        </div>
    );
};