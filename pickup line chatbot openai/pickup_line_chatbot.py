import openai
import json

# Set your OpenAI API key
openai.api_key = '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'

# Initialize memory to store the last question
memory = {"last_question": None}

def generate_pickup_lines(prompt, num_responses=5):
    responses = []
    for _ in range(num_responses):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates positive and non-corny pickup lines."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,  # Adjust this value to control the length of the responses
            stop=None,
            temperature=0.7,
        )
        responses.append(response.choices[0].message['content'].strip())
    return responses

def chatbot():
    print("Welcome to the Pickup Line Generator! Type 'exit' to quit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break

        # Remember the last question
        memory["last_question"] = user_input

        # Generate positive pickup lines
        prompt = f"Generate a positive and non-corny pickup line based on the following context: {user_input}"
        pickup_lines = generate_pickup_lines(prompt)

        print("Chatbot: Here are 5 pickup lines for you:")
        for i, line in enumerate(pickup_lines, start=1):
            print(f"{i}. {line}")

if __name__ == "__main__":
    chatbot()

