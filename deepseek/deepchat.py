from openai import OpenAI

# Initialize the client with your API key and base URL
client = OpenAI(api_key="sk-d623b82a5a3348d19c445dab0fe39515", base_url="https://api.deepseek.com")

def get_chatbot_response(user_input):
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": user_input},
        ],
        stream=False
    )
    return response.choices[0].message.content

def main():
    print("Chatbot: Hello! How can I assist you today?")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Chatbot: Goodbye!")
            break
        response = get_chatbot_response(user_input)
        print(f"Chatbot: {response}")

if __name__ == "__main__":
    main()
