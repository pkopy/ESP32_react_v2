import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from 'devextreme-react/tabs';
import Button from '@material-ui/core/Button';
import SystemTab from './SystemTab'

class Settings extends Component {
    state = {
        index: 0
    }
    render() {
        return (
            <div className="root">
                <div className="imgContainer">
                    <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.drawerView('scales') }}>
                        {this.props.lang.back}
                    </Button>

                </div>
                <Paper >
                    <Tabs dataSource={[
                        { text: 'System' },
                        { text: 'Użytkownik', disabled: true },
                        { text: 'TAB1', disabled: true },
                        { text: 'TAB2', disabled: true },

                    ]} selectedIndex={this.state.index} repaintChangesOnly={true} onItemClick={(ev) => this.setState({index:ev.itemIndex})}/>
                    {this.state.index === 0 &&<SystemTab
                        lang={this.props.lang}
                        setColor={this.props.setColor}
                        changeLang={this.props.changeLang}
                        drawerView={this.props.drawerView}
                    />}
                </Paper>
            </div>
        )
    }
}

export default Settings