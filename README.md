# Tesla Energy Sales App

This is the application that showcases the Battery sales for Tesla Sales Engineering. This app has been created for the assignment purpose as outlined by Tesla

## Project Description
The projects contains `frontend` and `backend` together under the two directories of `client` and `server` respectively. The frontend shows the UI of the batters information and selection charts. The backend is for the data retrieval for the battery data.

## User Interface
1. The UI displays the list of the batteries with details related to Land size, Energy, Cost and Release year. 
2. These items contains a users' interaction where a user can select one/more battery of a type and one or more quantity. 
3. If a checkbox is checked, then the battery is considered to be selected, else not.
4. Once selected, one needs to click on the 'Submit' button, to get details related to selected battries and their layout.

### Assumptions
1. If there are batteries in the multiple of 4, then a transformer would be added automatically (1 each for 4 batteries).
2. A transformer isn't available for selection.
3. If the subsequent changes performed in the batteries, the battery list display will get hidden then they would be displayed upon click of 'Submit' button.
4. The selections can be cleared using the 'Clear' button.
5. The images used are for refererence purpose and might not relate to that of the actual.

## Tech Stack
1.  Overall
    > Node (20.15.0)
    > Npm (10.7.0)
2.  Frontend
    > React
    > Typescript
    > Boostrap
3.  Backend
    > Node.js
    > Express.js
    > Typescript

## Installtion steps & Project Run
1. To install all the packages and dependencies across `client` and `server`, run 
### `npm run install-all`
2. Build server
### `npm run build:server`
3. Build client
### `npm run build:client`
4. Both client and server can be run simultaneously
### `npm run dev`
If you prefer to run them individually, client and server can be run using `npm run client` and `npm run server` respectively.

The client is hosted in [http://localhost:8000](http://localhost:8000/)
While the server is hosted in [http://localhost:8080](http://localhost:8080)

The server has lone service end point
`curl --location 'http://localhost:8080/v1/battery'`

### Note
While the UI works fine for most of the cases, it may contain some bugs.