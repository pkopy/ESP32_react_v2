import React, { Component } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid1 from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';



class CalendarPicker extends Component {
    dateRange = [
        { key: 0, name: this.props.lang.day },
        { key: 1, name: this.props.lang.week },
        { key: 2, name: this.props.lang.month },
        { key: 3, name: this.props.lang.any }
    
    ]
    state = {
        selectedDateEnd: new Date(Date.now()),
        selectedDateStart: new Date(Date.now() - (86400000 * 30)),
        rangeValue: 2,
    }

    handleDateChange = (date, name, cb, rangeValue) => {
        let start = new Date(this.setDate() - (86400000 * 30))
        let end = new Date((this.setDate() + (86400000 * 1)))
        let newEnd, newStart
        // let onlyDate = 
        if (name === 'from' && date) {
            this.setState({ selectedDateStart: date })
            newStart = (Date.parse(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`) )
            newEnd = Date.parse(`${this.state.selectedDateEnd.getFullYear()}-${this.state.selectedDateEnd.getMonth() + 1}-${this.state.selectedDateEnd.getDate()}`)
        } else if (name === 'to' && date){
            this.setState({ selectedDateEnd: date })
            newStart = Date.parse(`${this.state.selectedDateStart.getFullYear()}-${this.state.selectedDateStart.getMonth() + 1}-${this.state.selectedDateStart.getDate()}`);
            newEnd  = (Date.parse(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`) )
        } else if ( date === '_') {
            newEnd = Date.parse(`${this.state.selectedDateEnd.getFullYear()}-${this.state.selectedDateEnd.getMonth() + 1}-${this.state.selectedDateEnd.getDate()}`)
            newStart = Date.parse(`${this.state.selectedDateStart.getFullYear()}-${this.state.selectedDateStart.getMonth() + 1}-${this.state.selectedDateStart.getDate()}`);
        }

        switch (rangeValue) {

            case 0:
                this.setState({ selectedDateStart: new Date(this.setDate()) })
                this.setState({ selectedDateEnd: new Date((this.setDate())) })
                start = new Date(this.setDate())
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 1:
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 7)) })
                this.setState({ selectedDateEnd: new Date(this.setDate()) })
                start = new Date(this.setDate() - (86400000 * 7))
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 2:
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 30)) })
                this.setState({ selectedDateEnd: new Date(this.setDate()) })
                start = new Date(this.setDate() - (86400000 * 30))
                end = new Date((this.setDate() + (86400000 * 1)))
                break
            case 3:
                start = new Date(newStart + (86400000 * 0))
                end = new Date(newEnd + (86400000 * 1))

                break
            default:
                this.setState({ selectedDateStart: new Date(this.setDate() - (86400000 * 30)) })
                this.setState({ selectedDateEnd: new Date(this.setDate()) })
                start = new Date(this.setDate() - (86400000 * 30))
                end = new Date((this.setDate() + (86400000 * 1)))
        }

        // this.setDate()
        // this.setDate()
        setTimeout(() => {
            cb(start, end)
            // this.orders('Dowolny')

        }, 300)
    }

    setDate = (array) => {

        if (array) {
            return new Date(`${array[2]}-${array[1]}-${array[0]}`)

        } else {
            const today = new Date()
            return Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        }
    }

    render() {
        return (

            <div className="rangeContainer">
                <TextField
                    id="date_range"
                    select
                    label={this.props.lang.orderRange}
                    style={{
                        width: 200,
                        marginTop: 19,
                        textAlign: 'left'

                    }}
                    value={this.state.rangeValue}
                    onChange={(e) => {
                        this.setState({ rangeValue: e.target.value });
                        this.handleDateChange('_', '_', this.props.cb, e.target.value)
                    }}
                    // SelectProps={{
                    //     MenuProps: {
                    //         className: classes.menu,
                    //     },
                    // }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // helperText="Wybierz operatora"
                    margin="dense"
                // variant="outlined"
                >
                    {this.dateRange.map(range => (
                        <MenuItem key={range.key} value={range.key} >
                            {range.name}
                        </MenuItem>
                    ))}

                </TextField>
                {this.state.rangeValue === 3 && <div className="datePickerContainer">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid1 container justify="space-around">
                            <KeyboardDatePicker
                                disableToolbar
                                // variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="from-date"
                                label={this.props.lang.from}
                                style={{
                                    marginLeft: 10
                                }}
                                value={this.state.selectedDateStart}
                                onChange={(e) => this.handleDateChange(e, 'from', this.props.cb, this.state.rangeValue)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid1>
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid1 container justify="space-around">
                            <KeyboardDatePicker
                                disableToolbar
                                // variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="to-date"
                                label={this.props.lang.to}
                                style={{
                                    marginLeft: 10
                                }}
                                value={this.state.selectedDateEnd}
                                onChange={(e) => this.handleDateChange(e,  'to', this.props.cb, this.state.rangeValue)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid1>
                    </MuiPickersUtilsProvider>

                </div>}
            </div>
        )
    }
}

export default CalendarPicker