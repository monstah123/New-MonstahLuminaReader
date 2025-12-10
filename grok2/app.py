import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

XAI_API_KEY = os.getenv("XAI_API_KEY")
client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

completion = client.chat.completions.create(
    model="grok-beta",
    messages=[
        {"role": "system", "content": "You are Grok, a helpful customer support assistant for a tech company that provides Wi-Fi routers."},
        {"role": "user", "content": "My Wi-Fi keeps disconnecting randomly. Can you help me troubleshoot it?"},
    ],
)

print(completion.choices[0].message.content)



