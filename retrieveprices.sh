#!/bin/bash

curl -L "https://market.csgo.com/api/v2/prices/USD.json" -o csgo_prices.json
echo "Saved to csgo_prices.json"