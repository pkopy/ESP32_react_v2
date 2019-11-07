import React, { useState } from 'react';
import TreeList, { Column, RemoteOperations, Selection, SearchPanel } from 'devextreme-react/tree-list';
import Paper from '@material-ui/core/Paper';
import Tabs from 'devextreme-react/tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TestElement from './TestElement';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';




let data = {
    load: function (loadOptions) {
        if (loadOptions.parentIds) {
            let parentIdsParam = loadOptions.parentIds.join(',');
            return fetch(`http://localhost:5000/item?parentId=${parentIdsParam}`)
                .then(response => response.json())
                .catch((err) => console.log(err));

        } else {
            return fetch(`http://localhost:5000/item?parentId=`)
                .then(response => response.json())
                .catch((err) => console.log(err));
        }
    }
}


const useStyles = makeStyles(theme => ({
    itemDetails: {
        padding: theme.spacing(3, 2),
        marginLeft: '5px',
        minWidth: '82%',
        marginRight: '10px',
        boxShadow: '0 0 0 0',
        border: '1px solid rgb(109,109,109,0.25)',
        minHeight: '600px'

    },
    root1: {
        padding: theme.spacing(3, 2),
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        // maxHeight:600
    },
    tree: {
        maxHeight: '600px'
    },
    dense: {
        marginTop:100
    }

}));


export default (props) => {
    const [newGroup, setNewGroup] = useState(false)
    const [currentGroup, setCurrentGroup] = useState()
    const [index, setIndex] = useState(0)
    const [groupName, setGroupName] = useState('')
    const [groupNameError, setGroupNameError] = useState(false)
    const classes = useStyles();
    const [tree, setTree] = useState(false)
    const [openAddItem, setOpenAddItem] = useState(false)
    React.useEffect(() => {
        data = {
            load: function (loadOptions) {
                if (loadOptions.parentIds) {
                    let parentIdsParam = loadOptions.parentIds.join(',');
                    return fetch(`http://localhost:5000/item?parentId=${parentIdsParam}`)
                        .then(response => response.json())
                        .catch((err) => console.log(err));

                } else {
                    return fetch(`http://localhost:5000/item?parentId=`)
                        .then(response => response.json())
                        .catch((err) => console.log(err));
                }
            }
        }
    })
    const addGroup = (groupName) => {
        console.log()
        if (groupName === '') {
            setGroupNameError(true)
        } else {
            fetch(`http://localhost:5000/item?parentId=`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            for (let elem of data) {
                                console.log(elem)
                                if (elem.id === groupName.toUpperCase()) {
                                    
                                    setGroupNameError(true)
                                    break
                                }
                            }
                        })
                        .catch((err) => console.log(err));
            setGroupNameError(false)
        }
    }

    const handleChange = (e) => {
        
        setGroupName(e.target.value.trim())
    }
    const addItemToOrder = (item) => {
        props.addItem(item)
        props.setOpenItem(false)
        // console.log(item)
    }
    const openAddItemForm = () => {
        setTree(true)
        setOpenAddItem(true)
    }
    const openAddGroupForm = () => {
        setCurrentGroup()
        setNewGroup(true)
        setTree(true)
    }
    
    return (
        <div className={classes.container}>
            <div className="imgContainer" style={{ width: "70%", marginRight: "auto", marginLeft: "auto" }}>
                {!props.buttonDisable && <Button onClick={() => props.drawerView('scales')} variant="outlined" color="primary" style={{margin:5}}>
                    {props.lang.back}
                </Button>}


                {!props.buttonDisable && props.user.right > 2 && <Button onClick={openAddGroupForm} variant="outlined" color="primary" autoFocus style={{margin:5}}>
                    {props.lang.addGroup}
                </Button>}

            </div>
            <Paper className={classes.root1}
                style={{ width: props.width }}
            >
                <div>
                    <TreeList
                        className={classes.tree}
                        disabled={tree}
                        id={'groups'}
                        dataSource={data}
                        defaultExpandedRowKeys={[]}
                        showRowLines={true}
                        showBorders={true}
                        // columnAutoWidth={true}
                        keyExpr={'id'}
                        parentIdExpr={'parentId'}
                        hasItemsExpr={'hasItems'}
                        rootValue={''}
                        // width={'25%'}
                        onRowClick={(row) => { setCurrentGroup(row.data) }}

                    >
                        <SearchPanel visible={true} searchVisibleColumnsOnly={true} placeholder={props.lang.search} />
                        {/* <HeaderFilter visible={true} /> */}
                        <Selection mode={'single'} />
                        {/* <FilterRow visible={true} /> */}
                        {/* <ColumnChooser enabled={true} />  */}
                        <Column dataField={'name'}
                            caption={props.lang.chooseGroupAndItem}
                        // onClick={() => console.log('xxxx')}
                        />
                        <RemoteOperations />
                    </TreeList>

                </div>



                <Paper className={classes.itemDetails}
                    square={true}
                >
                    {newGroup && <div>
                        <TextField
                            id="name"
                            // select
                            label={props.lang.groupName}
                            error={groupNameError}
                            className={classes.dense}
                            value={groupName}
                            // disabled={disabled}
                            onChange={handleChange}
                            margin='dense'
                            InputLabelProps={{
                                shrink: true,
                            }}

                            variant="outlined"
                        />
                        <div className="imgContainer" style={{justifyContent:'center', margin:20}}>
                            {!props.buttonDisable && <Button onClick={() => props.drawerView('scales')} variant="outlined" color="primary" autoFocus style={{margin:5}}>
                                {props.lang.cancel}
                            </Button>}


                            {!props.buttonDisable && props.user.right > 2 && <Button onClick={() => addGroup(groupName)} variant="outlined" color="primary" style={{margin:5}}>
                                {props.lang.addGroup}
                            </Button>}

                        </div>
                    </div>}
                    {currentGroup && currentGroup.parentId &&
                        <div>

                            <Typography variant="h5" align='left'>
                                {props.lang.group}: {currentGroup.parentId}

                            </Typography>
                            <Typography paragraph={true} align='left'>
                                {props.lang.item}: {currentGroup.name}

                            </Typography>
                        </div>}
                    {currentGroup && !currentGroup.parentId &&
                        <div>
                            <Typography variant="h5" align='left'>
                                {props.lang.group}: {currentGroup.name}
                            </Typography>
                            {!openAddItem && props.user.right > 2 && <Button color="primary" variant="outlined" onClick={openAddItemForm}>
                                {props.lang.addItem}
                            </Button>}
                            {openAddItem &&
                                <div>
                                    <TestElement
                                        setOpenAddItem={setOpenAddItem}
                                        new={true}
                                        lang={props.lang}
                                        setCurrentGroup={setCurrentGroup}
                                        groupId={currentGroup.id}
                                        setTree={setTree}
                                        openItem={props.openItem}
                                        user={props.user}
                                    ></TestElement>

                                </div>
                            }
                        </div>
                    }
                    {currentGroup && currentGroup.parentId && <Tabs dataSource={[
                        { text: 'Element testowy' },
                        { text: 'Tab1', disabled: true },
                        { text: 'Tab2', disabled: true },
                        { text: 'Tab3', disabled: true },
                        // { text: 'favorites' },
                        // { text: 'additional' },
                        // { text: 'clients' },
                        // { text: 'orders' },
                        // { text: 'shipment' }

                    ]} selectedIndex={index} repaintChangesOnly={true} onItemClick={(ev) => setIndex(ev.itemIndex)} />}
                    {currentGroup && currentGroup.parentId && index === 0 &&
                        <TestElement
                            group={currentGroup}
                            setCurrentGroup={setCurrentGroup}
                            openItem={props.openItem}
                            lang={props.lang}
                            user={props.user}
                            setTree={setTree}
                        />}
                    {currentGroup && currentGroup.parentId && index === 0 && props.addItem &&
                        <Button color="primary" variant="outlined" onClick={() => addItemToOrder(currentGroup)}>{props.lang.addToOrder}</Button>}
                </Paper>
            </Paper>

        </div >
    )

}

