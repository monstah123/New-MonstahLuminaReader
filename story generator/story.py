import openai

# Set your OpenAI API key
openai.api_key = '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'

def generate_story(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Use the appropriate model
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=150,  # Adjust the length of the story
        temperature=0.7,  # Controls the randomness of the output
    )

    return response.choices[0].message['content'].strip()

if __name__ == "__main__":
    # Define a prompt for the story
    prompt = "Once upon a time in a faraway land, there was a magical forest."

    # Generate the story
    story = generate_story(prompt)

    # Print the generated story
    print(story)
