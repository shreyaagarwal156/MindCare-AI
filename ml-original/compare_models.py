import ollama
import time
import warnings

warnings.filterwarnings('ignore')

def check_model(model_name, prompt):
    print(f"\n" + "="*40)
    print(f"🤖 TESTING MODEL: {model_name.upper()}")
    print("="*40)
    
    start_time = time.time()
    try:
        response = ollama.chat(model=model_name, messages=[{'role': 'user', 'content': prompt}])
        end_time = time.time()
        
        time_taken = end_time - start_time
        reply = response['message']['content']
        
        print(f"⏱️ Response Time: {time_taken:.2f} seconds")
        print("\n📝 Response Snippet (First 300 chars):")
        print(reply[:300] + "...\n")
        
        return time_taken
    except Exception as e:
        print(f"❌ Error testing {model_name}. Please ensure the model is downloaded via Ollama.")
        print(f"Error details: {e}")
        return None

def main():
    print("--- ⚖️ LLM COMPARISON ENGINE INITIATED ---")
    
    # Ek standard clinical prompt
    test_prompt = """
    You are a professional Clinical Psychologist. 
    A patient says: "I have been feeling completely hopeless lately. I can't sleep, I'm stressed about my upcoming exams, and my heart is always racing. I feel like giving up."
    Write a short, empathetic response (max 3 sentences) and suggest one quick grounding technique.
    """
    
    # 1. Test Llama 3.2
    llama_time = check_model('llama3.2', test_prompt)
    
    # 2. Test Mistral (Ensure downloaded first via: ollama run mistral)
    mistral_time = check_model('mistral', test_prompt)
    
    # 3. Final Report
    print("FINAL COMPARISON REPORT")
    
    if llama_time and mistral_time:
        print(f"- Llama 3.2 Processing Time : {llama_time:.2f} seconds")
        print(f"- Mistral Processing Time   : {mistral_time:.2f} seconds")
        
        print("\nWinner in Speed:")
        if llama_time < mistral_time:
            print("🚀 LLAMA 3.2 is faster! (This justifies why we chose it for real-time chat)")
        else:
            print("🚀 MISTRAL is faster!")
    else:
        print("\nComparison could not be completed. Make sure both models are downloaded in Ollama.")

if __name__ == "__main__":
    main()