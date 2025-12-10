import streamlit as st
from ollama import chat
import socket
import logging
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Define the available models
models = {
    'llama3.2:latest': 'a80c4f17acd5',
    'qwen2.5-coder-extra-ctx:7b': 'c002283697a0',
    'qwen2.5-coder:latest': '2b0496514337',
    'qwen2.5-coder:7b': 'c002283697a0',
    'stable-code:3b-code-q4_0': 'e6b8d206c668',
    'qwen2.5-large:7b': 'c002283697a0'
}

# Function to send a message to Ollama and display the response
def send_message(user_message, model_id):
    if user_message:
        try:
            logging.debug(f"Sending message to model {model_id}: {user_message}")
            response = chat(model=model_id, messages=[{'role': 'user', 'content': user_message}])
            st.write('Response from Ollama:', response['message']['content'])
        except socket.gaierror as e:
            st.error(f"Network error occurred: {e}")
            logging.error(f"Network error occurred: {e}")
        except Exception as e:
            st.error(f"An error occurred: {e}")
            logging.error(f"An error occurred: {e}")

def main():
    # Streamlit app layout
    st.title("Chat with Ollama")

    # Dropdown to select the model
    selected_model = st.selectbox('Select a model:', options=list(models.keys()))
    model_id = models[selected_model]

    col1, col2 = st.columns(2)
    with col1:
        user_message_input = st.text_area('Enter a question or message:')
        if st.button('Send'):
            send_message(user_message_input, model_id)
    with col2:
        st.write('')

if __name__ == '__main__':
    main()
