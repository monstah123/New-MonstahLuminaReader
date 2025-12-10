import os
import subprocess
import json
import shlex
import time

def run_ollama(prompt, model="llama3.2:latest"):
    """Runs Ollama with the given prompt and returns the output."""
    try:
        command_str = f"ollama run {model}"
        command = shlex.split(command_str)

        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)

        process.stdin.write(prompt + "\n")
        process.stdin.flush()
        process.stdin.close()

        output = ""
        start_time = time.time()
        while True:
            line = process.stdout.readline()
            if line:
                try:
                    json_output = json.loads(line)
                    if "response" in json_output:
                        output += json_output["response"]
                    elif "error" in json_output:
                        print(f"Ollama Error: {json_output['error']}")
                        return None
                except json.JSONDecodeError:
                    output += line
            elif process.poll() is not None:
                break
            elif time.time() - start_time > 60:
                print("Timeout waiting for Ollama response.")
                process.kill()
                return None
            else:
                time.sleep(0.1)

        process.wait()
        if process.returncode != 0:
            error_output = process.stderr.read()
            print(f"Ollama exited with error code {process.returncode}:\n{error_output}")
            return None

        # Clean potential Assistant: prefix in response
        return output.strip().removeprefix("Assistant: ")

    except FileNotFoundError:
        print("Error: Ollama not found. Please ensure it's installed and in your PATH.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    while True:
        model_name = input("Enter the Ollama model you want to use (e.g., llama3.2:latest, qwen2.5-coder:latest, or press Enter for default 'llama3.2:latest'): ")
        if not model_name:
            model_name = "llama3.2:latest"
            break
        elif " " in model_name:
            print("Model name cannot contain white spaces")
        elif ":" not in model_name:
            print("Model name must have a tag, for example: llama2:latest")
        else:
            break

    print(f"Starting chat with Ollama model: {model_name}. Type 'exit' to quit.")
    conversation_history = []
    max_history_length = 20  # Keeps last 10 exchanges (20 messages)

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        # Add user message to history
        conversation_history.append({"role": "user", "content": user_input})

        # Build context-aware prompt
        prompt_parts = []
        for msg in conversation_history:
            prefix = "User: " if msg["role"] == "user" else "Assistant: "
            prompt_parts.append(f"{prefix}{msg['content']}")
        prompt_parts.append("Assistant: ")  # Prompt for next response
        full_prompt = "\n".join(prompt_parts)

        # Get response with full context
        response = run_ollama(full_prompt, model_name)

        if response:
            # Add assistant response to history
            conversation_history.append({"role": "assistant", "content": response})
            print("Ollama:", response)
        else:
            # Remove last user message if failed to get response
            if conversation_history and conversation_history[-1]["role"] == "user":
                removed = conversation_history.pop()
                print(f"Removed last input from history due to error: {removed['content']}")
            print("Failed to get response from Ollama.")

        # Maintain history length
        if len(conversation_history) > max_history_length:
            keep = max_history_length // 2  # Keep more recent messages
            conversation_history = conversation_history[-keep:]

if __name__ == "__main__":
    main()
