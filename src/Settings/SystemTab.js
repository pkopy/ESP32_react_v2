import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import plLang from '../Lang/pl'
import engLang from '../Lang/eng'

class SystemTab extends Component {
    state = {
        index: 0
    }
    render() {
        return (
            <div className="root" style={{height:600}}>
                <div className="imgContainer">
                    <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.changeLang(plLang); setTimeout(()=>{this.props.drawerView('settings')},100 ) }}>
                        PL
                    </Button>
                    <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.changeLang(engLang); setTimeout(()=>{this.props.drawerView('settings')},100 ) }}>
                        ENG
                    </Button>
                </div>
                
            </div>
        )
    }
}

export default SystemTab