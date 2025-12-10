from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(api_key="sk-d623b82a5a3348d19c445dab0fe39515", base_url="https://api.deepseek.com")

# Initialize conversation history
conversation_history = [
    {"role": "system", "content": "You are a helpful assistant"}
]

def chat_with_bot(user_input):
    # Append the user's message to the conversation history
    conversation_history.append({"role": "user", "content": user_input})

    # Get the chatbot's response
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation_history,
        stream=False
    )

    # Extract the chatbot's reply
    bot_reply = response.choices[0].message.content

    # Append the chatbot's reply to the conversation history
    conversation_history.append({"role": "assistant", "content": bot_reply})

    return bot_reply

# Main loop to interact with the chatbot
print("Chatbot: Hello! How can I assist you today?")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Chatbot: Goodbye!")
        break
    response = chat_with_bot(user_input)
    print(f"Chatbot: {response}")