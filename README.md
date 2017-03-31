# lab_lambda
lab_lambda on AWS, Query Postgresql Database from RDS or EC.

#Run Client

1. install nodejs
2. npm install
3. export Envirament 
export DB_USER= Database User Name
export DB_NAME= Database Instance Name
export DB_PWD= Database Password
export DB_HOST= Database Host or IP
export DB_PORT= Database Listen Port

4: node app.js
Run it on terminal , then you could see : Example app listening at http://localhost:55090/orders

5. curl http://localhost:55090/orders
You could see the result:  {"code":"000","result":{"number":1}}

app.js for run on client
lambda.js for run on AWS's lamdba