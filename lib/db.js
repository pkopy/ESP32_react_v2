/*
 *
 * Library for collecting and editing data from database
 * 
 */


// Dependencies
const mysql = require('mysql');
const { HOST, USER, PASSWORD, DATABASE } = require('./config');
const configDB = {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
}
const lib = {};

// Create new record
// data as json
lib.create = (table, data) => {
    return new Promise((res, rej) => {
        const con = mysql.createConnection(configDB);
        con.query(`INSERT INTO ${table} SET ?`, data, (err, result, fields) => {
            if (!err && result) {
                // console.log(result)
                res(result)
            } else {
                // console.log(err)
                rej(err);
            }
        });
        con.end();
    });
};

//Read from DB
lib.read = ({table, field, value, time1, time2, orderByField, sort, limit}) => {
    return new Promise((res, rej) => {
        const con = mysql.createConnection(configDB);
        // range of time
        // console.log( {table, field, value, time1, time2, orderByField, sort})
        if (field && value && time1) {
            const now = Date.now() 
            const date = new Date(now + 86400000)
            // console.log(`'${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}'`)
            let time = time2 ? `'${time2}'` : `'${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}'`;
            const coumn = 'time'
            // console.log(time)
            if (!value) {
                con.query(`Select *, s.name as scaleName from ${table} JOIN scales as s ON s.id = ${table}.scaleId WHERE createTime BETWEEN CAST('${time1}' AS DATE) AND CAST(${time} AS DATE)`, (err, result, fields) => {
                    if (!err && result && result.length > 0) {
                        // console.log(time)
                        res(result);
                    } else {
                        // console.log('cccc')
                        rej(JSON.stringify({ 'Error': 'Could not find the specified record' }));
                    }
                });
            } else {
                con.query(`Select * from ${table} WHERE ${field} = ? AND createTime BETWEEN CAST('${time1}' AS DATE) AND CAST(${time} AS DATE)`, [value], (err, result, fields) => {
                    if (!err && result && result.length > 0) {
                        // console.log(time2)
                        res(result);
                    } else {
                        // console.log('cccc')
                        rej(JSON.stringify({ 'Error': 'Could not find the specified record' }));
                    }
                });

            }
        } else if (field && value && orderByField) {
            con.query(`Select * from ${table} WHERE ${field} = ? order by ${orderByField} ${sort} limit ${limit}` , [value], (err, result, fields) => {
                if (!err && result && result.length > 0) {
                    // console.log('poszło')
                    res(result);
                } else {
                    // console.log('nieposzło')
                    rej(JSON.stringify({ 'Error': 'Could not find the specified record' }));
                }
            });
        } else if (field && value ) {
            
            con.query(`Select * from ${table} WHERE ${field} = ?` , [value], (err, result, fields) => {
                if (!err && result && result.length > 0) {
                    res(result);
                } else {
                    // console.log('nieposzło')
                    rej(JSON.stringify({ 'Error': 'Could not find the specified record' }));
                }
            });
        } else {
            // read all data from table
            // console.log('bez param')
            con.query(`Select * from ${table}`, (err, result, fields) => {
                if (!err && result && result.length > 0) {
                    res(result);
                } else {
                    rej(JSON.stringify({ 'Error': 'Could not find the specified records' }));
                }
            });
        }
        con.end();
    });
};

lib.update = (table, data, fieldName, row) => {
    return new Promise((res, rej) => {
        const con = mysql.createConnection(configDB);
        con.query(`UPDATE ${table} SET ? WHERE ${fieldName} = ${row}`, data, (err, result, fields) => {
            if (!err && result) {
                console.log(result)
                res(result)
            } else {
                console.log(err)
                rej(err);
            }
        });
        con.end();
    });
};

// lib.update = (table, fieldToChange, fieldToChangeValue, field, value) => {
//     return new Promise((res, rej) => {
//         const con = mysql.createConnection(configDB);
//         if (!field && !value) {
//             con.query(`Update ${table} SET ${fieldToChange}  = ?`, [fieldToChangeValue], (err, result, fields) => {
//                 if (!err && result) {
//                     res(result)
//                 } else {
//                     rej(JSON.stringify({ 'Error': 'Could not update the specified record' }));
//                 }
//             });
//         } else {
//             con.query(`Update ${table} SET ${fieldToChange} = ? WHERE ${field} = ?`, [fieldToChangeValue, value], (err, result, fields) => {
//                 if (!err && result) {
//                     res(result)
//                 } else {
//                     rej({ 'Error': 'Could not update the specified record' });
//                 }
//             });

//         }

//         con.end();
//     });
    
// };

//Delete from DB
lib.delete = (table, field, value) => {
    return new Promise((res, rej) => {
        const con = mysql.createConnection(configDB);
        con.query(`Delete from ${table} WHERE ${field} = ?`, [value], (err, result, fields) => {
            if (!err && result) {
                res(result);
            } else {
                rej({ 'Error': 'Could not delete the specified record' });
            }
        });

        con.end();
    });
};

lib.leftJoin = () => {
    return new Promise((res, rej) => {
        const con = mysql.createConnection(configDB);
        con.query(`SELECT  m.id, m.measureNumber, m.measure, o.name, o.operator, m.time 
                    FROM measurements m
                    LEFT JOIN table_references r ON m.id = r.measureid
                    LEFT JOIN orders o ON r.orderguid = o.guid`, (err, result, fields) => {
            if (!err && result) {
                res(result);
            } else {
                rej({ 'Error': 'Could not delete the specified record' });
            }
        });

        con.end();
    });
}

module.exports = lib;