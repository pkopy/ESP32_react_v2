import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    container: {
        marginLeft: '20px',
        textAlign: 'left',
        marginTop: '20px'
    },
    textField: {
        width: 350,
        padding: theme.spacing(3, 2),
        marginLeft: theme.spacing(2),
        marginRight: '10px',
        boxShadow: '0 0 0 0',
        border: '1px solid rgb(109,109,109,0.25)',
        height: 100,
        // display:'flex'

    },
    dense: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: 19,
        width: 200
    },
    menu: {
        width: 200,
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    text1: {
        width: 50,
        left: 250,
        top: -60
    },
    hr: {
        borderTop: '1px solid rgb(0,0,0,0.25)',
        width: '95%',
        marginTop: 30,
        marginBottom: 30
    },

}));


export default (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState('free');
    console.log('TEST: ',props.openItem)
    React.useEffect(()=>{
        if (!props.new) {

            const group = props.group ? props.group : {
                name: '',
                base: 0,
                min: 0,
                max: 0,
                treshold: 0
            }
            setValues(group)
        }
    })
    const group = props.group ? props.group : {
        name: '',
        base: 0,
        min: 0,
        max: 0,
        treshold: 0
    }
    const [values, setValues] = React.useState(group);
    const handleChange = name => event => {
        // console.log(values)
        setValues({ ...values, [name]: event.target.value });
       

    }
    const sendItem = () => {
        
        values.parentId = props.groupId.toUpperCase()
        values.name = values.name.toUpperCase()
        values.id = `${values.parentId}--${values.name}`
        values.base = parseInt(values.base)
        values.min = parseInt(values.min)
        values.max = parseInt(values.max)
        values.treshold = parseInt(values.treshold)
        values.isDirectory = false
        values.hasItems = false
        // console.log(values)
        fetch('http://localhost:5000/item', {
            method: 'POST',
            body: JSON.stringify(values)
        })
            .then(data => data.json())
            .then(data=>console.log(data))
            .catch(err => console.log(err))
    }
 
    return (
        <div className={classes.container}>
            <div className={classes.hr} />
            <TextField
                id="name"
                // select
                label="Nazwa"
                // error={errors.name}
                className={classes.dense}
                value={values.name}
                onChange={handleChange('name')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <TextField
                id="base"
                label="Podstwa"
                // error={errors.name}
                type="number"
                className={classes.dense}
                value={values.base}
                onChange={handleChange('base')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <TextField
                id="min"
                label="Min"
                // error={errors.name}
                type="number"
                className={classes.dense}
                value={values.min}
                // value={values.name}
                onChange={handleChange('min')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <TextField
                id="max"
                label="Max"
                // error={errors.name}
                type="number"
                className={classes.dense}
                value={values.max}
                // value={values.name}
                onChange={handleChange('max')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <TextField
                id="treshold"
                label="Próg LO"
                // error={errors.name}
                type="number"
                className={classes.dense}
                value={values.treshold}
                // value={values.name}
                onChange={handleChange('treshold')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <div className={classes.hr} />
            {props.new&&<div>
                <Button className={classes.button} color="primary" variant="outlined" onClick={sendItem}>
                    DODAJ
                </Button>
                <Button className={classes.button} color="primary" variant="outlined" onClick={() => {props.setOpenAddItem(false); props.setTree(false)}}>
                    ANULUJ
                </Button>

            </div>}
            {!props.new&&!props.openItem&&<div>
                <Button className={classes.button} color="primary" variant="outlined" >
                    EDYTUJ
                </Button>
                <Button className={classes.button} color="secondary" variant="outlined" >
                    USUŃ
                </Button>

            </div>}
        </div>


    )
}