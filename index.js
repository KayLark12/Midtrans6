const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');

const app = express();
const port = process.env.PORT || 3000;

// Menggunakan body-parser untuk parsing JSON
app.use(bodyParser.json());

// Buat instance Snap API
let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-aVSYun8nN8bkx0Dg3aacu-Sn' // Ganti dengan server key Anda
});

// Endpoint untuk membuat transaksi
app.post('/createTransaction', async (req, res) => {
    try {
        const { order_id, gross_amount, customer_details, item_details } = req.body;

        let parameter = {
            "transaction_details": {
                "order_id": order_id,
                "gross_amount": gross_amount
            },
            "enabled_payments": ["qris"], // Mengaktifkan hanya QRIS
            "customer_details": customer_details,
            "item_details": item_details
        };

        let transaction = await snap.createTransaction(parameter);
        let transactionToken = transaction.token;

        res.json({ snapToken: transactionToken });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).send("Error creating transaction");
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
