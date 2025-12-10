# app.py

from openai_module import generate_text_basic  # Ensure this import is correct
import streamlit as st

# Title for the Streamlit app
st.title("Monstah AI Text Generator")

# User input for the prompt
prompt = st.text_input("Enter your prompt:", "Hello, what can I help you with today")

# Button to generate response
if st.button("Generate Response"):
    # Call the generate_text_basic function with the user prompt
    response = generate_text_basic(prompt, model="gpt-4o")
    
    # Display the response on the Streamlit app
    st.write(response)
