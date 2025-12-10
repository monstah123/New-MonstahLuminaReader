# imports
import openai
import requests
import json

# set open AI Keys (it is better to read from environment variables)
openai.api_key = "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"
openai.organization = "org-FKsP51nA9SdAFmTCwa1ltgn6"


# basic connection with ChatGPT API
def BasicGeneration(userPrompt):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": userPrompt}]
    )
    return completion.choices[0].message.content


# Get Bitcoin Price From the last 7 days from Crypto API (rapidAPI Example)
def GetBitCoinPrices():
    # Define the API endpoint and query parameters
    url = "https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history"
    querystring = {
        "referenceCurrencyUuid": "yhjMzLPhuIDl",
        "timePeriod": "7d"
    }
    # Define the request headers with API key and host
    headers = {
        "X-RapidAPI-Key": "a617d6467dmshac84323ce581a72p11caa9jsn1adf8bbcbd47",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
    }
    # Send a GET request to the API endpoint with query parameters and headers
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    # Parse the response data as a JSON object
    JSONResult = json.loads(response.text)
    # Extract the "history" field from the JSON response
    history = JSONResult["data"]["history"]
    # Extract the "price" field from each element in the "history" array and add to a list
    prices = []
    for change in history:
        prices.append(change["price"])
    # Join the list of prices into a comma-separated string
    pricesList = ','.join(prices)
    # Return the comma-separated string of prices
    return pricesList


def AnalyzeBitCoin(bitcoinPrices):
    chatGPTPrompt = f"""You are an expert crypto trader with more than 10 years of experience, 
    I will provide you with a list of bitcoin prices for the last 7 days
    can you provide me with a technical analysis
    of Bitcoin based on these prices. here is what I want: 
    Price Overview, 
    Moving Averages, 
    Relative Strength Index (RSI),
    Moving Average Convergence Divergence (MACD),
    Advice and Suggestion,
    Do I buy or sell?
    Please be as detailed as you can, and explain in a way any beginner can understand. and make sure to use headings
    Here is the price list: {bitcoinPrices}"""

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[

                {"role": "user", "content": chatGPTPrompt}
            ]
        )
        message = completion.choices[0].message.content.strip()
    except Exception as e:
        message = "Sorry, I was not able to process your request at this time. Please try again later."
    return message


# lets test our functions
# get prices
bitcoinPrices = GetBitCoinPrices()
# analyze with ChatGPT
analysis = AnalyzeBitCoin(bitcoinPrices)
# print result
print(analysis)
