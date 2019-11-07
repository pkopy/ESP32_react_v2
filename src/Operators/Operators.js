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
import MenuItem from '@material-ui/core/MenuItem';

import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Paging,
    SearchPanel,
    Pager,
    HeaderFilter
} from 'devextreme-react/data-grid';



class Operators extends Component {
    state = {
        columns: [
            { name: 'firstName', title: this.props.lang.firstName },
            { name: 'lastName', title: this.props.lang.lastName },
            { name: 'userName', title: this.props.lang.user },
            { name: 'right', title: this.props.lang.rights }
        ],
        rows: [],
        values: {
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
            rePassword: '',
            right:''
        },
        errors: {
            firstName: false,
            lastName: false,
            userName: false,
            password: false,
            rePassword: false,
            right:false
        },
        openAddOperator: false,
        rights: [
            {value:'0', name:this.props.lang.guest},
            {value:'2', name:this.props.lang.operator},
            {value:'4', name:this.props.lang.admin}
        ]
    }

    getRowId = row => row.id;

    componentDidMount = () => {
        this.operators()
    }

    // componentWillUpdate = () => {
    //     // this.generateRows(this.state.rows)
    // }

    operators = () => {
        fetch('http://localhost:5000/operators', {
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
                row.password = ''
                switch (row.right) {
                    case 2:
                        row.right = this.props.lang.operator
                        break
                    case 4:
                        row.right = this.props.lang.admin
                        break
                    case 0:
                        row.right = this.props.lang.guest
                }
            })
            this.setState({ rows })
        } else {
            this.setState({ rows: [] })
        }
    }

    addOperator = (values) => {
        if (values.firstName && values.lastName && values.userName && values.password && values.rePassword && (values.password === values.rePassword)) {

            fetch('http://localhost:5000/operators', {
                method: 'POST',
                body: JSON.stringify(values)
            })
                .then(data => data.json())
                .then(data => {
                    if (!data.err) {
                        this.setState({ openAddOperator: false })
                        this.operators()
                        this.props.updateOperators()
                        this.setState({
                            values: {
                                firstName: '',
                                lastName: '',
                                userName: '',
                                password: '',
                                rePassword:'',
                                right:''
                            }
                        })
                        this.setState({ errors: {} })
                    } else {
                        const inputs = {...values}
                        inputs.rePassword = ''
                        inputs.password = ''
                        this.setState({values:inputs, errors: {userName:true}})
                        alert(data.err)
                    }
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
            if (this.state.values.password !== this.state.values.rePassword) {
                err['password'] = true;
                err['rePassword'] = true
            }
            this.setState({ errors: err })
        }
    }
    handleChange = name => event => {
        const values = { ...this.state.values, [name]: event.target.value.trim() }
        this.setState({ values })
    };

    handleClose = () => {
        this.setState({
            openAddOperator: false, errors: {}, values: {
                firstName: '',
                lastName: '',
                userName: '',
                password: '',
                rePassword: '',
                right:''
            }
        })
    }



    render() {

        return (
            <div>
                <Dialog
                    open={this.state.openAddOperator}
                    maxWidth='lg'
                    // width='80%'
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.lang.addOperator}</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="firstName"
                            label={this.props.lang.firstName}
                            style={{
                                margin: 10
                            }}
                            error={this.state.errors.firstName}
                            value={this.state.values.firstName}
                            onChange={this.handleChange('firstName')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"

                        />
                        <TextField
                            id="lastName"
                            label={this.props.lang.lastName}
                            style={{
                                margin: 10
                            }}
                            error={this.state.errors.lastName}
                            value={this.state.values.lastName}
                            onChange={this.handleChange('lastName')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"

                        />
                        <div style={{
                            // borderTop: '1px solid rgb(0,0,0,0.25)',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            // width: '70%',
                            marginTop: 30,
                            marginBottom: 30
                        }} />
                        <TextField
                            id="userName"
                            label={this.props.lang.user}
                            style={{
                                margin: 10
                            }}
                            autoComplete="off"
                            error={this.state.errors.userName}
                            value={this.state.values.userName}
                            onChange={this.handleChange('userName')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"

                        />
                        <TextField
                            id="rights"
                            select

                            label={this.props.lang.rights}
                            SelectProps={{
                                MenuProps: {
                                    width: 200
                                },
                            }}
                            style={{
                                margin: 10,
                                width: 200
                            }}
                            autoComplete="off"
                            error={this.state.errors.right}
                            value={this.state.values.right}
                            onChange={this.handleChange('right')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            

                        >
                            {this.state.rights.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div style={{
                            // borderTop: '1px solid rgb(0,0,0,0.25)',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            // width: '70%',
                            marginTop: 30,
                            marginBottom: 30
                        }} />
                        <TextField
                            id="password"
                            label={this.props.lang.password}
                            style={{
                                margin: 10
                            }}
                            type="password"
                            autoComplete="off"
                            error={this.state.errors.password}
                            value={this.state.values.password}
                            onChange={this.handleChange('password')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"

                        />
                        <TextField
                            id="rePassword"
                            label={this.props.lang.rePassword}
                            style={{
                                margin: 10
                            }}
                            type="password"
                            error={this.state.errors.rePassword}
                            value={this.state.values.rePassword}
                            onChange={this.handleChange('rePassword')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"

                        />

                    </DialogContent>
                    <DialogActions style={{ margin: 20 }}>
                        <Button variant="outlined" color="primary" onClick={() => this.addOperator(this.state.values)}>
                            {this.props.lang.add}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={this.handleClose} autoFocus>
                            {this.props.lang.cancel}
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className="imgContainer" style={{ width: "70%", marginRight: "auto", marginLeft: "auto" }}>
                    <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { this.props.drawerView('scales') }}>
                        {this.props.lang.back}
                    </Button>
                    <Button style={{ margin: '15px', marginRight: 0 }} variant="outlined" color="primary" onClick={() => { this.setState({ openAddOperator: true }) }}>
                        {this.props.lang.addOperator}
                    </Button>

                </div>
                <Paper style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
                    {/* <Grid
                        rows={this.state.rows}
                        columns={this.state.columns}
                        getRowId={this.getRowId}
                        onRowDblClick={(e) => this.props.orderDetails(e.data)}
                        // onDoubleClick={() => console.log('click')}
                    >

                        <Table />
                        
                        <TableHeaderRow />

                    </Grid> */}
                    <DataGrid
                        dataSource={this.state.rows}
                        selection={{ mode: 'single' }}
                        showBorders={false}
                        hoverStateEnabled={true}
                        keyExpr={'userName'}
                        style={{
                            padding: 20
                        }}
                        onRowDblClick={(e) => console.log(e.data)}
                    >
                        <Column dataField={'firstName'} caption={this.props.lang.firstName} />
                        <Column dataField={'lastName'} caption={this.props.lang.lastName} />
                        <Column dataField={'userName'} caption={this.props.lang.user} />
                        <Column dataField={'right'} caption={this.props.lang.rights} />


                    </DataGrid>
                </Paper>
            </div>
        )
    }
}
export default Operators;
