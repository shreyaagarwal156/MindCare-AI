import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification

def main():
    print("Loading your custom Mental Health AI Model...")
    # Model wahi path se load hoga jahan tumne extract kiya hai
    model_path = "./final_mental_health_model" 
    
    try:
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertForSequenceClassification.from_pretrained(model_path)
    except Exception as e:
        print(f"Error loading model! Check if the folder path is correct. Error: {e}")
        return

    # Labels map kar rahe hain jo humne training mein set kiye the
    label_map = {0: "Normal", 1: "Depression", 2: "Anxiety", 3: "Suicidal"}
    
    print("\n" + "="*50)
    print("AI Analyzer is Active! (Type 'exit' to stop)")
    print("="*50 + "\n")
    
    while True:
        user_input = input("User (Simulated Input): ")
        
        if user_input.lower() in ['exit', 'quit', 'stop']:
            print("Shutting down analyzer...")
            break
            
        # Text ko AI ke samajhne layaq numbers mein convert karna
        inputs = tokenizer(user_input, return_tensors="pt", padding=True, truncation=True, max_length=128)
        
        # Model se prediction lena
        with torch.no_grad():
            outputs = model(**inputs)
            
        # Probabilities calculate karna (Confidence score)
        probs = F.softmax(outputs.logits, dim=1)
        predicted_class_id = torch.argmax(probs, dim=1).item()
        confidence = probs[0][predicted_class_id].item() * 100
        
        diagnosis = label_map[predicted_class_id]
        
        print(f"  --> [HIDDEN AI ANALYSIS]: {diagnosis} (Confidence: {confidence:.2f}%)")
        print("-" * 50)

if __name__ == "__main__":
    main()