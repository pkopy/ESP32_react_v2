

export default (props) => {
    const searchScales = () => {
        props.socket.send(JSON.stringify({ command: 'SEARCH_SCALES' }))
        setLoader(true)
        setChecked([])
        props.socket.onmessage = (e) => {
            let data = e.data;
            const response = JSON.parse(data);
            console.log(response)
            if (response.scales && response.scales.length > 0) {

                handleClickOpen(true)
                setFoundScales(response.scales)
                setLoader(false)
                getScales()
                
            } else if (response.respond === "SCALE_NOT_FOUND"){
                setLoader(false)
            }
        }
    }

    const addScales = () => {
        props.socket.send(JSON.stringify({ command: 'ADD_SCALES', scales: checked }))
        getScales()
        // props.drawerView('scales')
        setOpen(false)
    }

    return (
        <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Znaleziono:"}</DialogTitle>
                <DialogContent>


                    <List dense className={classes.listOfscales}>
                        <ListSubheader>{`Nowe wagi`}</ListSubheader>
                        {foundScales.map((value, i) => {

                            // const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem key={i} button>
                                    {/* <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${value + 1}.jpg`}
                                />
                                </ListItemAvatar> */}
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(value)}
                                            // checked={checked.indexOf(value) !== -1}
                                            inputProps={{ 'aria-labelledby': i }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                        <ListSubheader>{`Zaktualizowane wagi`}</ListSubheader>
                        {updatedScales.map((value, i) => {

                            // const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem key={i} button>
                                    {/* <ListItemAvatar>
                            <Avatar
                                alt={`Avatar n°${value + 1}`}
                                src={`/static/images/avatar/${value + 1}.jpg`}
                            />
                            </ListItemAvatar> */}
                                    <ListItemText id={i} primary={`${props.lang.scale}: ${value.address}`} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            // onChange={handleToggle(value)}
                                            // checked={checked.indexOf(value) !== -1}
                                            inputProps={{ 'aria-labelledby': i }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={addScales} color="primary" autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
    )
}