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
st.title("Book Summarizer")
st.write("Get a concise summary of any book!")

# Input fields for the book's title and author
book_title = st.text_input("Enter the book title:")
book_author = st.text_input("Enter the author's name:")

# Button to submit the request for a summary
if st.button("Summarize Book"):
    if book_title and book_author:
        # Call the API with a prompt to summarize the book
        prompt = f"Summarize the book '{book_title}' by {book_author}."

        response = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "You are a book summarizer bot."},
                {"role": "user", "content": prompt},
            ],
        )

        # Retrieve the summary from the response
        summary = response.choices[0].message.content if response.choices else 'No summary available.'
        st.write("**Book Summary:**")
        st.write(summary)
    else:
        st.warning("Please enter both the book title and author's name.")




