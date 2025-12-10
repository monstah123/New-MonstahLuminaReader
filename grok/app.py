import os
from openai import OpenAI
from dotenv import load_dotenv
import streamlit as st

# Load environment variables from .env file
load_dotenv()
XAI_API_KEY = os.getenv("XAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

# Streamlit UI
st.title("Grok Chatbot Interface")
st.write("Ask Grok anything, inspired by the Hitchhiker's Guide to the Galaxy!")

# User input box for the question
user_input = st.text_input("Enter your question here:")

# Button to submit the question
if st.button("Ask Grok"):
    if user_input:
        # Call the API with the user's question
        response = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."},
                {"role": "user", "content": user_input},
            ],
        )

        # Display the response
        # Retrieve the answer directly from the content attribute
        answer = response.choices[0].message['content'] if response.choices else 'No response received.'

        st.write("**Grok's answer:**")
        st.write(answer)
    else:
        st.warning("Please enter a question.")


