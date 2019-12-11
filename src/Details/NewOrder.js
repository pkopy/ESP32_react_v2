import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SocketLib from '../Socket'
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Groups from '../ItemTree/Groups'
import Loader from '../helpers/Loader'
import { uuid } from 'uuidv4';

const useStyles = makeStyles(theme => ({
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    textField: {
        marginLeft: theme.spacing(2),

        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    hr: {
        borderTop: '1px solid rgb(0,0,0,0.25)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        marginTop: 30,
        marginBottom: 30
    }
}));




export default function TextFields(props) {
    const classes = useStyles();
    const scales = props.scales
    const operators = props.operators
    const order = props.order && Object.keys(props.order).length > 0 ? props.order : {
        name: '',
        base: '',
        min: '',
        max: '',
        operator: '',
        threshold: '',
        quantity: '',
        scale: '',
        interval: 'interval',
        type: 'quantity',
        intervalValue: null,
        // range: false,
        manualWeighing: true,
        item: ''
    }

    
    const [values, setValues] = React.useState(order);
    const [errors, setError] = React.useState({
        name: false,
        base: false,
        min: false,
        max: false,
        operator: false,
        threshold: false,
        quantity: false,
        scale: false,
        errors: false,
        intervalValue: false,
        manualWeighing: false
    })
    const [open, setOpen] = React.useState(false);
    const [openItem, setOpenItem] = React.useState(false);
    const [connection, setConnection] = React.useState()
    const [scale, setScale] = React.useState({})
    const [loader, setLoader] = React.useState(false)
    const [item, setItem] = React.useState({})
    // const [item, setItem] = React.useState({})

    const addItem = (item) => {
        // setItem(item)
        setValues({ ...values, 'item': item.name, 'base': item.base, 'max': item.max, 'min': item.min, 'threshold': item.threshold });
        setItem(item)
        console.log(item)
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
        if (name === 'scale') {
            setCurrentScale(event.target.value)
            // setValues({ ...values, 'scaleName': event.target.value });
        }

    };

    const changeCheckboxValue = name => event => {
        if (name === 'manualWeighing' && event.target.checked) {
            console.log(event.target.checked)
            setValues({ ...values, [name]: event.target.checked, interval: 'interval', intervalValue: 0});
        }
        else {
            setValues({ ...values, [name]: event.target.checked });
        }
    }


    const setCurrentScale = (addressScale) => {
        for (let scale of scales) {
            if (scale.address === addressScale) {
                setScale(scale)
                console.log('xxxx', scale)
            }
        }
    }



    const validate = () => {
        const valuesKeys = Object.keys(values)
        const err = {}
        setError(err)

        for (let value of valuesKeys) {
            // if (value === 'interval' && values.interval === 'interval' && (values.intervalValue === '' || values.intervalValue <= 0 || !values.intervalValue)) {

            //     err.intervalValue = true
            //     err.errors = true
            // } else 
            if (value === 'intervalValue' && values.intervalValue >= 0 && values.manualWeighing)  {
                err[value] = false
            } else if ((values[value] === '' || values[value] <= 0 || !values[value])) {
                err[value] = true
                err.errors = true
            } else {
                err[value] = false
            }
        }
        
        console.log('err:', err)



        if (err.errors) {
            setError(err)
            setOpen(true)
        } else {
            setOpen(true)
            // sendOrder()
            setLoader(true)
            // const connection = props.socket
            // connection.onopen = () => {
            //     setConnection(connection)
            //     setOpen(true)
            //     setLoader(false)
            // }

            // connection.onerror = () => {
            //     alert('soket niedostępnty')
            //     setLoader(false)
            // }

        }
    }
   
    const sendOrder = () => {
        // setLoader(true)
        console.log(props.host)
        const valueToSend = {
            guid: uuid(),
            name: values.name,
            operator: values.operator,
            scaleId: scale.id,
            scaleName: scale.name,
            item: item.id,
            tare: 0,
            unit: 'g',
            base: values.base,
            min: values.min,
            max: values.max,
            quantity: values.quantity,
            type: values.type,
            intervalValue: values.intervalValue,
            manualWeighing: false,
            threshold: values.threshold,
            status:'NotStarted'


        }

        fetch(`http://${props.host}:5000/order`, {
        // fetch(`http://localhost:5000/order`, {
            method: 'POST',
            body: JSON.stringify(valueToSend)
        })
            .then(data => data.json())
            .then(data => {setLoader(false); setOpen(false)})
            .catch((err) => {
                setLoader(false)
                setOpen(false)
                console.log(err)
            })
    }

    const closeDialog = () => {
        setOpen(false)
    }

    React.useEffect(() => {
        console.log(props.order)
        if (order.scaleName) {
            setCurrentScale(order.scale)
        }
    })
    return (
        <div>
            {loader && <Loader />}
            <Dialog
                open={openItem}
                maxWidth='lg'
                // width='80%'
                fullWidth={true}
                onClose={() => setOpenItem(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.lang.items}</DialogTitle>
                <DialogContent

                >

                    <Groups
                        width={'100%'}
                        addItem={addItem}
                        setOpenItem={setOpenItem}
                        openItem={openItem}
                        lang={props.lang}
                        buttonDisable={true}
                        user={props.user}
                    />

                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={()=>setOpenItem(false)} color="primary">
                        Wybierz
                    </Button> */}
                    <Button onClick={() => setOpenItem(false)} color="primary" autoFocus>
                        {props.lang.back}
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h4" style={{ marginBottom: 20 }}>{props.lang.orderDetails}</Typography>
            <div className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="name"
                    label={props.lang.orderName}
                    error={errors.name}
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange('name')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    id="operator"
                    select
                    error={errors.operator}
                    label={props.lang.operator}
                    className={classes.textField}
                    value={values.operator}
                    onChange={handleChange('operator')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // helperText="Wybierz operatora"
                    margin="normal"
                    variant="outlined"
                >
                    {operators.map((option, i) => (
                        <MenuItem key={i} value={option.userName}>
                            {option.firstName + ' ' + option.lastName}
                        </MenuItem>
                    ))}

                </TextField>

                <TextField
                    id="scale"
                    select
                    error={errors.scale}
                    label={props.lang.scaleName}
                    className={classes.textField}
                    value={values.scale}
                    onChange={handleChange('scale')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // helperText="Wybierz operatora"
                    margin="normal"
                    variant="outlined"
                >
                    {scales.map(scale => (
                        <MenuItem key={scale.address} value={scale.address} >
                            {scale.name}
                        </MenuItem>
                    ))}

                </TextField>
                <div className={classes.hr} style={{ width: '50%' }} />
            </div>
            <div className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="item"
                    label={props.lang.item}
                    // error={errors.name}
                    className={classes.textField}
                    value={values.item}
                    onChange={handleChange('item')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onClick={() => setOpenItem(true)}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="base"
                    label={props.lang.base}
                    value={values.base}
                    error={errors.base}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleChange('base')}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">g</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="max"
                    label={props.lang.max}
                    error={errors.max}
                    value={values.max}
                    onChange={handleChange('max')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">g</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="min"
                    label={props.lang.min}
                    value={values.min}
                    error={errors.min}
                    onChange={handleChange('min')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">g</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    id="threshold"
                    label={props.lang.threshold}
                    error={errors.threshold}
                    value={values.threshold}
                    onChange={handleChange('threshold')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        min: "1",
                        startAdornment: <InputAdornment position="start">g</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <div className={classes.hr} style={{ width: '50%' }} />
            </div>
            <div className={classes.container} noValidate autoComplete="off">
                <FormControlLabel
                    
                    control={
                        <Checkbox color="primary" id="test" checked={values.manualWeighing} value={values.manualWeighing} onChange={changeCheckboxValue('manualWeighing')} />
                    }
                    label={props.lang.manualWeighing}
                />
                <FormControlLabel
                    disabled={true}
                    control={
                        <Checkbox color="primary" value={values.range} onChange={changeCheckboxValue('range')} />
                    }
                    label="Pilnuj zakresów ważenia"
                />
            </div>
            <div className={classes.container} noValidate autoComplete="off">

                <FormControl component="fieldset">
                    {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
                    <RadioGroup aria-label="position" name="position" value={values.type} style={{ marginTop: '20px', width: '250px' }} onChange={handleChange('type')} row>
                        <FormControlLabel
                            value="quantity"
                            control={<Radio color="primary" />}
                            label={props.lang.quantity}
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="weight"
                            control={<Radio color="primary" />}
                            label={`${props.lang.weight} (g)`}
                            labelPlacement="start"
                            disabled={true}
                        />

                    </RadioGroup>
                </FormControl>
                <TextField
                    id="quantity"
                    label=""
                    error={errors.quantity}
                    value={values.quantity}
                    onChange={handleChange('quantity')}
                    type="number"
                    min="0"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        min: "1",
                        startAdornment: <InputAdornment position="start">{values.type === 'quantity' ? props.lang.qty : 'g'}</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />



            </div>
            { !values.manualWeighing &&<div className={classes.container} noValidate autoComplete="off">

               <FormControl component="fieldset">
                    {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
                     <RadioGroup aria-label="position" name="position" value={values.interval} style={{ marginTop: '20px', width: '250px' }} onChange={handleChange('interval')} row>
                        <FormControlLabel
                            value="stab"
                            control={<Radio color="primary" />}
                            label="Stabilny"
                            labelPlacement="start"
                            disabled={true}
                        />
                        <FormControlLabel
                            value="interval"
                            control={<Radio color="primary" />}
                            label="Interwał"
                            labelPlacement="start"
                        />

                    </RadioGroup>
                </FormControl>
                <TextField
                    id="intervalValue"
                    label="Interwał"
                    error={errors.intervalValue}
                    value={values.intervalValue || 0}
                    onChange={handleChange('intervalValue')}
                    type="number"
                    min="0"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{

                        min: "1"
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">s</InputAdornment>,
                    }}
                    margin="normal"
                    variant="outlined"
                />
            </div>}


            <div className={classes.hr} />
            <Button className={classes.button} variant="outlined" color="primary" onClick={validate}>{props.lang.sendOrder}</Button>
            {/* <Button className={classes.button} variant="outlined" color="primary">Zapisz zlecenie</Button> */}
            <Button className={classes.button} variant="outlined" color="primary" onClick={() => props.drawerView('ordersList')}>{props.lang.back}</Button>
            <Dialog
                open={open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {!errors.errors ? <DialogTitle id="alert-dialog-title">Wysyłanie zlecenia</DialogTitle> : <DialogTitle id="alert-dialog-title">UWAGA!</DialogTitle>}
                <DialogContent>
                    {!errors.errors && <DialogContentText id="alert-dialog-description">
                        Zamierzasz wysłać następujące zlecenie do wagi: <b>{scale.name}</b> <br /> <br />
                        <li>{props.lang.orderName}: {values.name}</li>
                        <li>{props.lang.operator}: {values.operator}</li>
                        <li>{props.lang.scaleName}: {scale.name}/{values.scale}</li>
                        {values.item && <li>{props.lang.item}: {values.item}</li>}
                        <li>{props.lang.base}: {values.base}</li>
                        <li>{props.lang.max}: {values.max}</li>
                        <li>{props.lang.min}: {values.min}</li>
                        <li>{props.lang.threshold}: {values.threshold}</li>
                        <li>{props.lang.quantity}: {values.quantity}</li>
                        {values.interval === 'interval' && <li>Interwał: {values.intervalValue}</li>}

                    </DialogContentText>}
                    {errors.errors && <DialogContentText id="alert-dialog-description">
                        Znaleziono błędy w formularzu: <br /> <br />
                        {errors.name && <li>{props.lang.orderName}</li>}
                        {errors.operator && <li>{props.lang.operator}</li>}
                        {errors.scale && <li>{props.lang.scaleName}</li>}
                        {errors.base && <li>{props.lang.base}</li>}
                        {errors.max && <li>{props.lang.max}</li>}
                        {errors.min && <li>{props.lang.min}</li>}
                        {errors.threshold && <li>{props.lang.threshold}</li>}
                        {errors.quantity && <li>{props.lang.quantity}</li>}
                        {errors.intervalValue && <li>Interwał</li>}
                    </DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        {errors.errors ? <span>Popraw</span> : <span>Zamknij</span>}
                    </Button>
                    <Button color="primary" autoFocus disabled={errors.errors} onClick={sendOrder}>
                        Wyślij
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
