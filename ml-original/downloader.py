import ollama

print("Downloading Llama 3.2... (Isme 5-10 minute lag sakte hain, net speed par depend karta hai)")
# Ye command Python ke through model download kar degi
ollama.pull('llama3.2')
print("--- SUCCESS! Model download ho gaya hai! ---")