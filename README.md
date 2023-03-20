# React-Paytm-Integration :+1:

In this repository I've created an demo of ReactJs and Paytm Payment Gateway integration.

Steps you need to folllow:

<h3>Server:</h3>
<ul>
  <li><strong>Step 1:</strong> In terminal (in MacOS) or CMD (in Windows) run this command <code>npm install</code>. This will install all the depencesies in the project folder. (Remember that you're in the server folder)
  <li><strong>Step 2:</strong> In the line 13 and line 14 of paymentRoute.js edit your Merchant Id and Merchant Key respectively provided by Paytm Business in Developer Settings > API Keys
  <li><strong>Step 3:</strong> Run the command <code>node app.js</code>
</ul>

<h3>Client:</h3>
<ul>
  <li><strong>Step 1:</strong> In terminal (in MacOS) or CMD (in Windows) run this command <code>npm install</code>. This will install all the depencesies in the project folder. (Remember that you're in the client folder)
  <li><strong>Step 2:</strong> Enter the buyer's email in line 5.
  <li><strong>Step 3:</strong> run the command <code>npm start</code>
</ul>
Also there is a function in the code which sends an email to the buyer after a successful transaction. If you do not wish to have this feature delete the code from line 18 to line 43 and also line 96 where this function is called.
 
For any help contact me at mohitkuhad8@gmail.com
