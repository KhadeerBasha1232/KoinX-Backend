const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');
const Price = require('../models/Price');
const cron = require('node-cron');

const ETHERSCAN_API_KEY = process.env.API_KEY;
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';

// Fetch transactions for a given address
router.get('/transactions/:address', async (req, res) => {
  const { address } = req.params;

  try {
    const response = await axios.get(`${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
    const { status, message, result } = response.data;
    if (status === '1' && Array.isArray(result)) {
      const transactionHashes = result.map(tx => tx.hash);
      const existingTransactions = await Transaction.find({ hash: { $in: transactionHashes } }, { hash: 1 });
      const existingHashes = new Set(existingTransactions.map(tx => tx.hash));
      const newTransactions = result.filter(tx => !existingHashes.has(tx.hash));
      if (newTransactions.length > 0) {
        await Transaction.insertMany(newTransactions.map(tx => ({ ...tx, address })));
      }
      res.json({ transactions: result });
    } else {
      console.error('API Error:', message);
      res.status(500).json({ error: message || 'Unknown API error' });
    }
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const fetchPriceEveryTenMinutes = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
    const price = response.data.ethereum.inr;

    // Store price in the database
    await Price.create({ currency: 'ETH', price });

    console.log(`Fetched ETH price: ₹${price}`);
  } catch (error) {
    console.error(`Error fetching price: ${error.message}`);
  }
};

router.get('/expenses/:address', async (req, res) => {
  const { address } = req.params;

  try {
    const transactions = await Transaction.find({ address });
    const ethPrice = await Price.findOne({ currency: 'ETH' }).sort({ fetchedAt: -1 });

    const totalExpenses = transactions.reduce((acc, tx) => {
      const gasUsed = parseFloat(tx.gasUsed);
      const gasPrice = parseFloat(tx.gasPrice);
      return acc + (gasUsed * gasPrice) / 1e18;
    }, 0);

    res.json({ totalExpenses, currentPrice: ethPrice.price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule ETH price fetching every 10 minutes
cron.schedule('*/10 * * * *', fetchPriceEveryTenMinutes);

module.exports = router;
