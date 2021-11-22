TOPIC : BANK MANAGEMENT SYSTEM
OUTLINE:
    A Online Banking Management System is a project that manages and  
Collects data according to customers’ needs. This system helps customer to create their account , enquire balance in a easy manner.
It also helps the bank manager/admin  to keep their data updated 
and constant track of them.

DESCRIPTION OF EACH FILE:\
ADMIN PANEL
    In admin panel frontend, the index.js file will load first, then it will redirected to the router.js file. In router.js, the header reference for all the pages have been given,
if we want to go to home page , then the header reference from the router.js will load that particular route and reach the destination page.
The destination pages are 
                        1. header.js - It will load in every page
                        2. home.js - It will have alll the functionalities
                        3. page.js - In pages we have separate route for different functionalities
                        
    In admin panel backend, first the index.js file will load , it will connect to the maongoDB database, and connect the server.
I have used MVC architecture in the backend. They are Models,Contructors and Views(Routes)
                       1. Models - It will contain the Schema of the database view.
                       2. Contructors - It will contain the functionalities. 
                       3. Routers - It will have the routes for the server and it will connected with the constructor.
                        
CUSTOMER PANEL
1. register.html - allows the new user to register
2. login.html - it will check the  credentials and make the user logged in
3. mainfront.ejs - it will show all the functionalities that the customer can requests from the bank
                          the functionalities are 
                               1. create account - cus_cr_acc.ejs
                               2. balance enquiry - balance.ejs
                               3. atm request - atm.ejs
                               4. atm approvals - atmfin.ejs
                               5. apply loan - applyloan.ejs
                               6. loan approvals - loan.ejs





SOFTWARE REQUIREMENTS:
          1. Visual Studio Code - for coding
          2. Node               - for using node package manager and node.js functionaities
          3. MongoDB or Robo3T  - for storing and view the data
          4. Postman            - for testing the server 
          5. Atom               - also code editor
 
