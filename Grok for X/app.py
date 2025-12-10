import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
XAI_API_KEY = os.getenv("XAI_API_KEY")

# Check if API key exists
if not XAI_API_KEY:
    raise ValueError("XAI_API_KEY not found in environment variables")

try:
    # Initialize OpenAI client
    client = OpenAI(
        api_key=XAI_API_KEY,
        base_url="https://api.x.ai/v1",
    )

    # Create chat completion
    completion = client.chat.completions.create(
        model="grok-beta",
        messages=[
            {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."},
            {"role": "user", "content": "who won the usa election in  2024?"},
        ],
    )

    # Print the response
    print(completion.choices[0].message)

except Exception as e:
    print(f"An error occurred: {str(e)}")

