## Developer version
In the project directory run:
### `npm install`

and next
### `npm start`


In lib directory must be configured .env file eg:
```
// database config
HOST=yourDBaddress
USER=yourUser
PASSWORD=yourPassword
DATABASE=yourDBname
```
To run API server in the lib directory you run the command:

### `node server`

------------------------------------------

## Modules description

/src/Details:

### Detail.js
This component displays and visualizes a mass
### DetailChart.js
This component displays the order graph
### DevExpressTable.js 
This component displays the orders list in grid
### OrdersList.js
The Component displays the list of orders
### NewOrder.js
Creates a new order, validates the order and sends order to the scale
### OrderDetails.js
Displays details about order (grid or chart)

---------------------------------------------

/src/img

The folder with all images used in the project

----------------------------------------------

/src/ItemTree

### Groups.js

The component displays the groups and the products in the tree. It also contains form with tabs.
For now only one tab is active

### TestElement.js

The tab 'Element testowy' displays details about an item

--------------------------------------------

/src/MyComponents

The folder contains my test components

---------------------------------------------
/src/helpers

### Loader.js
This is that small, rotating circle in the middle of the screen

### ProgressBar.js
It visualizes a mass

------------------------------------------
/src

### App.js 
The start of app

### Drawer.js
Managements all views

### Socket.js
This library supports socket connection

----------------------------------------





