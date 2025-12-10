import os
from google.cloud import aiplatform

# Replace with your model name and service account key path
model_name = "text-generation-3-base"  # Adjust this to your desired model
service_account_key_path = "/Users/petersoncharles/Developer/download_youtube/august-upgrade-433617-f1-cc86ef34e4e1.json"  # Replace with the actual path

# Set the environment variable
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_key_path

# Create a Gemini client
client = aiplatform.Client()

# Create a model instance
model = client.get_model(model_name)

def generate_text(prompt):
  """Generates text using the Gemini API.

  Args:
    prompt: The prompt for the text generation.

  Returns:
    The generated text.
  """

  prediction_request = aiplatform.PredictionRequest(
      instance=[{"text": prompt}]
  )
  response = model.predict(prediction_request)
  generated_text = response.predictions[0]["text"]
  return generated_text

# Get a prompt from the user
prompt = input("Enter a prompt for text generation: ")

# Generate text using the Gemini API
generated_text = generate_text(prompt)

# Print the generated text
print(generated_text)

