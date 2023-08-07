const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios"); // Import the axios package
const app = express();
const soap = require("strong-soap").soap;
app.use(bodyParser.raw({ type: () => true })); // Enable raw body parsing

// Load the WSDL
const url = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService.wsdl";
app.get("/", async (req, res) => {
	try {
		// Assuming you are receiving JSON data in the request body
		const body = req.body;
		const args = JSON.parse(body);
		console.log(args);
		// Create SOAP client
		// const client = await soap.createClient(url);
		soap.createClient(url, (err, client) => {
			if (err) {
				console.error("Error calling checkVat:", err);
				res.status(500).json({ success: false, error: "SOAP request failed" });
				return;
			}
			console.log({ client: client });
			client.checkVat(args, (err, response) => {
				if (err) {
					console.error("Error calling checkVat:", err.response.statusMessage);
					res.status(500).json({ success: false, error: "SOAP request failed" });
					return;
				}

				console.log("checkVat Response:", response);
				res.status(200).json({ success: true, data: response });
			});
		});
		// Call checkVat method
	} catch (error) {
		console.error("Error creating SOAP client:", error);
		res.status(500).json({ success: false, error: "SOAP client creation failed" });
	}
});
// Start the Express server
const server = app.listen(3000, () => {
	console.log("Express server is running on port 3000");
});
