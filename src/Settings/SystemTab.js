import React, { Component, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { makeStyles } from '@material-ui/core/styles';
import plLang from '../Lang/pl'
import engLang from '../Lang/eng';

import plFlag from '../img/pl_flag1.png'
import enFlag from '../img/en_flag1.png'
import select from '../img/select.svg'
import { useTheme } from '@material-ui/styles';

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo';


const operators = [
    {
        id: 'PL',
        label: 'POLSKI',
        src: plFlag
    },
    {
        id: 'EN',
        label: 'ENGLISH',
        src: enFlag
    },

];

const useStyles = makeStyles(theme => ({
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    textField: {
        marginLeft: theme.spacing(2),

        width: 200,
        padding: 0
    },
    flag: {
        paddingRight: 10,
        paddingLeft: 20,
        position: "relative",
        top: -5

    },
    menu: {
        width: 200
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
    },
    chooseLangText: {
        top: 10,
        position: "relative",
        width: 200
    },
    cr: {
        width: 40, 
        height: 40,
        transition: '0.2s',
        borderRadius: 3,
        position: 'relative',
        top: 2,
        left: 2,
        '&:hover': {
            cursor:'pointer',
            width:44,
            height:44,
            top:0,
            left:0
        }
    },
    select: {
        position:"relative",
        width: 30,
        left: 5
    }
}));

export default (props) => {

    const classes = useStyles();
    const [index, setIndex] = useState(0)
    const [lang, setLang] = useState(props.lang.language)
    const [color, setColor] = useState("INDIGO")

    useEffect(() => {
        props.drawerView('settings')
    }, [lang])


    const handleOnChange = (e) => {
        setLang(e.target.value)
        switch (e.target.value) {
            case 'POLSKI':
                props.changeLang(plLang);
                break;
            case 'ENGLISH':
                props.changeLang(engLang);
                break;
            default:
                props.changeLang(plLang);
        }

    }

    const handleOnChangeColor = (color) => {

        // setColor(e.target.value);
        switch (color) {
            case 'GREEN':
                props.setColor(green);
                
                break;
            case 'PURPLE':
                props.setColor(purple);
                break;
            case 'INDIGO':
                props.setColor(indigo);
                break;
            case 'BLUE':
                props.setColor(blue);
                break;
            default:
                props.setColor(indigo);
        }
        setColor(color)
    }
    return (
        <div style={{ height: 600 }}>
            {/* <div className="imgContainer">
                <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { props.changeLang(plLang); setTimeout(() => { props.drawerView('settings') }, 100) }}>
                    PL
                    </Button>
                <Button style={{ margin: '15px' }} variant="outlined" color="primary" onClick={() => { props.changeLang(engLang); setTimeout(() => { props.drawerView('settings') }, 100) }}>
                    ENG
                    </Button>
            </div> */}
            <div style={{ textAlign: "left", width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 20, display: "flex" }}>
                <Typography variant="h6" className={classes.chooseLangText}>
                    {props.lang.chooseLanguage}
                </Typography>

                <TextField
                    select
                    className={classes.textField}
                    value={lang}
                    onChange={handleOnChange}
                    SelectProps={{
                        className: classes.menu,

                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // helperText="Wybierz operatora"
                    margin="none"

                >
                    {operators.map(option => (
                        <MenuItem key={option.id} value={option.label} >
                            <div style={{ paddingLeft: 10 }}>
                                <img src={option.src} width="40px" ></img>
                                <span className={classes.flag}>
                                    {option.label}
                                </span>

                            </div>
                        </MenuItem>
                    ))}

                </TextField>

            </div>

            <Box style={{ textAlign: "left", width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 20, display: "flex" }}>
                <Typography variant="h6" className={classes.chooseLangText}>
                    {props.lang.theme}
                </Typography>

                {/* <TextField
                    // select
                    className={classes.textField}
                    value={color}
                    // onChange={handleOnChangeColor}
                    SelectProps={{
                        className: classes.menu,

                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // helperText="Wybierz operatora"
                    margin="none"

                >
                    
                    <MenuItem value={'ZIELONY'} >
                        <div style={{ backgroundColor: '#3f51b5', width: 40, height: 40, borderRadius: "50%" }}></div>
                    </MenuItem>
                    <MenuItem value={'JAKIŚ'} >
                        <div style={{ backgroundColor: '#1d9e21', width: 40, height: 40, borderRadius: "50%" }}></div>
                    </MenuItem> 


                </TextField> */}
                <Box style={{ textAlign: "left", width: "90%", marginLeft: "auto", marginLeft: 44,  display: "flex" }}>
            <Box onClick={() => handleOnChangeColor('GREEN')} style={{backgroundColor: '#fff', width:44, height:44}}><Box className={classes.cr} style={{backgroundColor: '#4caf50', }}>{color==="GREEN"&&<img className={classes.select} src={select} alt="select_icon"/>}</Box></Box>
                    <Box onClick={() => handleOnChangeColor('PURPLE')} style={{backgroundColor: '#fff', width:44, height:44}}><Box className={classes.cr} style={{backgroundColor: '#9c27b0', }}>{color==="PURPLE"&&<img className={classes.select} src={select} alt="select_icon"/>}</Box></Box>
                    <Box onClick={() => handleOnChangeColor('INDIGO')} style={{backgroundColor: '#fff', width:44, height:44}}><Box className={classes.cr} style={{backgroundColor: '#3f51b5'}}>{color==="INDIGO"&&<img className={classes.select} src={select} alt="select_icon"/>}</Box></Box>
                    <Box onClick={() => handleOnChangeColor('BLUE')} style={{backgroundColor: '#fff', width:44, height:44}}><Box  className={classes.cr} style={{backgroundColor: '#2196f3'}}>{color==="BLUE"&&<img className={classes.select} src={select} alt="select_icon"/>}</Box></Box>

                </Box>
            </Box>

        </div>
    )

}
