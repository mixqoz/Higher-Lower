import requests
import json
import random

def callapi():
    url = "https://market.csgo.com/api/v2/prices/USD.json"

    # Make the request
    response = requests.get(url)
    response.raise_for_status()

    # Parse JSON
    data = response.json()

    # Save to a file
    with open("csgo_prices.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def getrandomitem():
    with open("csgo_prices.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # Pick a random item
    return random.choice(data["items"])



if __name__ == "__main__":
    print(getrandomitem())