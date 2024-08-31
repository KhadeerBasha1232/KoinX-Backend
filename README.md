# **KoinX Backend Assignment**

Backend API to fetch Ethereum transactions, calculate user expenses, and retrieve Ethereum prices every 10 minutes.

## **Deployed Link**

API is live at: [KoinX Backend on Render](https://koinx-backend-kb.onrender.com/)

## **Features**

- **Fetch User Transactions:** Retrieves Ethereum transactions for a given address.
- **Calculate Total Expenses:** Computes total gas expenses from transactions.
- **Fetch ETH Price:** Fetches Ethereum price every 10 minutes.

## **Setup Instructions**

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/koinx-backend.git
    cd koinx-backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file:**
    ```bash
    PORT=3001
    MONGO_URI=your_mongo_uri
    API_KEY=your_etherscan_api_key
    ```

4. **Run the server:**
    ```bash
    npm start
    ```

## **API Endpoints**

- **GET** `/api/transactions/:address` - Fetches transactions for an address.
- **GET** `/api/expenses/:address` - Calculates total expenses and returns the current ETH price.

## **Logic Overview**

- **Transactions:** Fetch from Etherscan API, store new ones in MongoDB.
- **Price Fetching:** Scheduled every 10 minutes via CoinGecko API.
- **Expenses Calculation:** Compute total gas costs from transactions and get the latest ETH price.

## **Tech Stack**

- Node.js, Express, MongoDB, Axios, node-cron
