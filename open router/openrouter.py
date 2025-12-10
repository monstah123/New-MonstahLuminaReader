from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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"
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  model="openai/gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "give examples on how to pick up girls with pickup lines,Gentle and Subtle, Confidently Flirty, Riskily Forward, Travel, second date",
    }
  ]
)
print(completion.choices[0].message.content)