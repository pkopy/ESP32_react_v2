const wifi = require("node-wifi");
const dotenv = require('dotenv');
dotenv.config();
const IFACE = process.env.IFACE || null 

// wifi.init({
//     iface: IFACE // network interface, choose a random wifi interface if set to null
// });

// wifi.scan(function(err, networks) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(networks);
//       return networks
//     }
// })