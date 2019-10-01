import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const PORT = process.env.REACT_APP_PORT || 5000;
const URL = process.env.REACT_APP_URL || 'localhost'

class Operators extends Component {
    state = {
        columns: [
            { name: 'firstName', title: this.props.lang.firstName },
            { name: 'lastName', title: this.props.lang.lastName },
        ],
        rows: [],
        values: {
            firstName:'',
            lastName:''
        },
        errors: {
            firstName:false,
            lastName:false
        },
        openAddOperator: false
    }

    getRowId = row => row.id;

    componentDidMount = () => {
        this.operators()
    }

    componentWillUpdate = () => {
        // this.generateRows(this.state.rows)
    }

    operators = () => {fetch(`http://${URL}:${PORT}/operators`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(data => data.json())
        .then(measurments => {
            this.generateRows(measurments)
        })
        .catch(err => console.log(err))
    }

    generateRows = (rows) => {
        let count = 0
        if (rows && rows.length > 0) {
            rows.map(row => {
                row.id = count++;
            })
            this.setState({rows})   
        } else {
            this.setState({rows:[]})
        }
    }

    addOperator = (values) => {
        this.setState({errors:{}})
        if (values.firstName && values.lastName) {
            fetch('http://localhost:5000/operators', {
                method: 'POST',
                body: JSON.stringify(values)
            })
                .then(data => data.json())
                .then(data => {
                    // console.log(data)
                    this.setState({openAddOperator:false})
                    this.operators()
                    this.props.updateOperators()
                })
                .catch((err) => {
                    console.log(err)
                })

        } else {
            const valuesKeys = Object.keys(this.state.values)
            const err = {}

            for (let value of valuesKeys) {
                if (!this.state.values[value]) {
                    err[value] = true
                } else {
                    err[value] = false
                }
            }
            this.setState({errors:err})
        }
    }
    handleChange = name => event => {
        const values = {...this.state.values, [name]: event.target.value}
        this.setState({values})
    };



    render() {
        
        return (
            <div>
            <Dialog
                open={this.state.openAddOperator}
                maxWidth='lg'
                // width='80%'
                onClose={()=>this.setState({openAddOperator:false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.lang.addOperator}</DialogTitle>
                <DialogContent>
                <TextField
                    id="firstName"
                    label={this.props.lang.firstName}
                    style={{
                        margin:10
                    }}
                    error={this.state.errors.firstName}
                    value={this.state.values.firstName}
                    onChange={this.handleChange('firstName')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="lastName"
                    label={this.props.lang.lastName}
                    style={{
                        margin:10
                    }}
                    error={this.state.errors.lastName}
                    value={this.state.values.lastName}
                    onChange={this.handleChange('lastName')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                    
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={()=>this.addOperator(this.state.values)}>
                        {this.props.lang.add}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={()=>this.setState({openAddOperator:false})}  autoFocus>
                        {this.props.lang.cancel}
                    </Button>
                </DialogActions>
            </Dialog>
            <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.drawerView('scales') }}>
                    {this.props.lang.back}
                </Button>
                <Button style={{ marginLeft: '15px' }} variant="outlined" color="primary" onClick={() => { this.setState({openAddOperator:true}) }}>
                {this.props.lang.addOperator}
            </Button>
            <Paper style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Grid
                    rows={this.state.rows}
                    columns={this.state.columns}
                    getRowId={this.getRowId}
                >
                   
                    <Table />
                    {/* <VirtualTable/> */}
                    <TableHeaderRow />
                    
                </Grid>
            </Paper>
            </div>
        )
    }
}
export default Operators;
