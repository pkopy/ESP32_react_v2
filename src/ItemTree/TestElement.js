import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
    const [openDialog, setOpenDialog] = useState(false)
    const [info, setInfo] = useState({ context: props.lang.deleteItemText, title: props.lang.deleteItem })
    const classes = useStyles();
    React.useEffect(() => {
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
    }, [props.new, props.group])


    const group = props.group ? props.group : {
        name: '',
        base: 0,
        min: 0,
        max: 0,
        treshold: 0
    }



    const [disabled, setDisabled] = React.useState(true)

    React.useEffect(() => {
        if (props.new) {
            setDisabled(false)
        }
    })
    const [values, setValues] = React.useState(group);
    const handleChange = name => event => {
        // console.log(values)
        setValues({ ...values, [name]: event.target.value });


    }
    const updateItem = () => {
        props.setTree(true)
        fetch('http://localhost:5000/item', {
            method: 'PUT',
            body: JSON.stringify(values)
        })
            .then(data => data.json())
            .then(data => {


                props.setTree(false)
                props.setCurrentGroup()

            })
            .catch(err => console.log(err))
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
            .then(data => {

                props.setOpenAddItem(false);
                props.setTree(false)

            })
            .catch(err => console.log(err))
    }

    const confirmDelete = () => {
        deleteItem()
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    const deleteItem = () => {
        props.setTree(true)
        fetch('http://localhost:5000/item', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'item': group.idItem

            }
        })
            .then(data => data.json())
            .then(data => {props.setTree(false); props.setCurrentGroup()})
            .catch(err => console.log(err))
    }

    return (
        <div className={classes.container}>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{info.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {info.context} {group.name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete} color="secondary">
                        {props.lang.delete}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        {props.lang.cancel}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.hr} />
            <TextField
                id="name"
                // select
                label="Nazwa"
                // error={errors.name}
                className={classes.dense}
                value={values.name}
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
                // value={values.name}
                onChange={handleChange('treshold')}
                margin='dense'
                InputLabelProps={{
                    shrink: true,
                }}

                variant="outlined"
            />
            <div className={classes.hr} />
            {props.new && <div>
                <Button className={classes.button} color="primary" variant="outlined" onClick={sendItem}>
                    {props.lang.add}
                </Button>
                <Button className={classes.button} color="primary" variant="outlined" onClick={() => { props.setOpenAddItem(false); props.setTree(false) }}>
                    {props.lang.cancel}
                </Button>

            </div>}
            {!props.new && !props.openItem && props.user.right > 2 && <div>
                {disabled && <Button className={classes.button} onClick={() => { props.setTree(true); setDisabled(false) }} color="primary" variant="outlined" >
                    {props.lang.edit}
                </Button>}
                {disabled && <Button className={classes.button} onClick={() => setOpenDialog(true)} color="secondary" variant="outlined" >
                    {props.lang.delete}
                </Button>}
                {!disabled && <Button className={classes.button} onClick={() => { updateItem(); setDisabled(true) }} color="primary" variant="outlined" >
                    {props.lang.send}
                </Button>}
                {!disabled && <Button className={classes.button} onClick={() => { props.setTree(false); setDisabled(true) }} color="primary" variant="outlined" >
                    {props.lang.cancel}
                </Button>}

            </div>}
        </div>


    )
}