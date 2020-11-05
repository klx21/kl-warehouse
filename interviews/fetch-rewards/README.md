# Hiring List

## Introduction

Before the list is ready to be displayed a spinner will be shown in the page. Once the list is ready the spinner will disappear.

The groups in the list are marked with different background color.

The page is responsive to the width of the browser.

If there is anything wrong when getting the data an error page will be displayed.

## Start the server

If you are going to run the app for the first time be sure to run the command below in the project root folder `fetch-rewards`.
```shell script
npm install
```
Once it's done you can run the command below to start the server.
```shell script
npm start
```
The server is listening on the port 3333 so please make sure there's no port conflict before starting it.

## Open the landing page
When the server is running you can open the landing page with the URL `http://localhost:3333`.

#### [Notes]
* The data is not requested directly from the front-end because there's no CORS support on that server. Instead, the data is retrieved on the back-end and exposed as an API `/api/v1/hiring-list`. Then the front-end can call this API to get the data.
