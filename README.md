# SALT Crypto Trader

A simple full-stack web application to simulate cryptocurrency trading.  Note: this application has no styling because of the requirements.

## Table of Contents
- [How to run it](#How-to-run-it)
- [How to use it](#How-to-use-it)
- [Tech Stack](#Tech-Stack)
- [Architecture](#Architecture)
- [Requirements](#Requirements)

## How to run it
```
1. *git clone* the repo.
2. go into the client folder *cd client*
3. *npm install*
4. go back to the root folder *cd ..*
5. *npm install*
6. *npm run both* to run both the backend and the front-end
```

## How to use it

Despite the lack of styling in this application, using it is simple.  Select the person who's going to make trades and make trades respecting the constrants (described in the requirements).

Base URL:
```
http://localhost:3000
```

*if there's the need to reset the application to a initial state (all grandchildren with 10000 dollars): 
```
send a DELETE request to http://localhost:5000/setup
then send a POST request (empty body) to http://localhost:5000/setup
```

## Tech Stack

The application was written with JavaScript in the backend and TypeScript in the frontend.  

- MongoDB
- Express
- Node.js
- React (with TypeScript)

## Architecture

The server runs on port 5000 and the client runs on port 3000.

The ControlPannel Component passes the name selected on the homepage to the Manager Component.  The Manager makes API calls to retrieve crypto prices and passes those down to Dashboard and Tracker.  Tracker displays crypto prices while Dashboard makes API calls to the database and displays the person's assets.  Dashboard passes assets and prices to the trader.  Whenever a trade is made, the Trade component sends a function call to update the dashboard.

In order: ControlPannel -> Manager -> Tracker.  Dashboard -> Trader.

## Requirements

"Write a web app (preferably in TypeScript, React and Node, but not required) that tracks the price of Bitcoin (in USD), as well as the prices of Litecoin, Dogecoin, and Monero (in BTC). Each kid should start with 10,000 USD and 0 balance for each crypto asset. The app should allow the kids to view the current prices of assets, place orders, view their portfolio distribution, and view the total value. To keep things simple, ALL TRADES MUST INVOLVE BTC. The kids must use USD to buy BTC, then they can use BTC to buy and sell alts. Obviously, we need to know which kid is making the trade, but don't prioritize authentication. Use a DB of your choice."