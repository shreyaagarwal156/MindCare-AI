import pandas as pd
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from tqdm import tqdm
import warnings
import random

warnings.filterwarnings('ignore')

def main():
    print("Loading Model and Tokenizer...")
    model_path = "./final_mental_health_model"
    try:
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertForSequenceClassification.from_pretrained(model_path)
        model.eval() 
    except Exception as e:
        print(f"Model load nahi ho paya: {e}")
        return

    dataset_path = "Combined Data.csv" 
    print(f"\nLoading testing data from {dataset_path}...")
    
    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        print(f"Error: File '{dataset_path}' nahi mili.")
        return

    # 🔴 THE DATA FILTER FIX
    if 'statement' in df.columns and 'status' in df.columns:
        # Data clean karna
        df['status'] = df['status'].astype(str).str.strip().str.capitalize()
        
        # Sirf un 4 classes ko filter karna jinpar model actually trained hai
        valid_classes = ["Normal", "Depression", "Anxiety", "Suicidal"]
        df = df[df['status'].isin(valid_classes)]
        
        texts = df['statement'].tolist()
        labels_text = df['status'].tolist()
        
        label_map = {"Normal": 0, "Depression": 1, "Anxiety": 2, "Suicidal": 3} 
        true_labels = [label_map[l] for l in labels_text]
        
    elif 'text' in df.columns and 'label' in df.columns:
        # Agar numeric labels hain toh ensure karo sirf 0-3 wale hi filter hon
        df = df[df['label'].isin([0, 1, 2, 3])]
        texts = df['text'].astype(str).tolist()
        true_labels = df['label'].astype(int).tolist()
    else:
        print("Columns match nahi ho rahe. Ek baar CSV file ke column names check karo.")
        return

    # Data Shuffling taaki saari classes perfectly mix ho jayein
    combined_data = list(zip(texts, true_labels))
    random.seed(42) 
    random.shuffle(combined_data)
    
    # 300 test sentences uthana fast testing ke liye
    combined_data = combined_data[:300]
    texts, true_labels = zip(*combined_data)
    texts = list(texts)
    true_labels = list(true_labels)

    print(f"\nTotal valid test sentences loaded: {len(texts)}")
    predicted_labels = []

    print("Analyzing sentences... (This will take a moment)")
    for text in tqdm(texts, desc="Testing Model"):
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
        with torch.no_grad():
            outputs = model(**inputs)
        pred_id = torch.argmax(F.softmax(outputs.logits, dim=1), dim=1).item()
        predicted_labels.append(pred_id)

    # SCORES REPORT
    print("\n" + "="*60)
    print("📊 COMPLETE MODEL PERFORMANCE REPORT")
    print("="*60)

    acc = accuracy_score(true_labels, predicted_labels)
    print(f"✅ OVERALL ACCURACY: {acc * 100:.2f}%\n")

    target_names = ["Normal", "Depression", "Anxiety", "Suicidal"] 
    
    print("✅ DETAILED SCORES (Class-wise):")
    try:
        report = classification_report(true_labels, predicted_labels, target_names=target_names, zero_division=0)
        print(report)
    except Exception as e:
        print(classification_report(true_labels, predicted_labels, zero_division=0))

    print("\n✅ CONFUSION MATRIX:")
    print(confusion_matrix(true_labels, predicted_labels))
    print("="*60)

if __name__ == "__main__":
    main()