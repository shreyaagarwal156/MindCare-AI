import os
import pandas as pd
from datasets import Dataset
from transformers import BertTokenizer

def main():
    print("1. Loading Master Dataset...")
    # Loading the merged CSV we just created
    df = pd.read_csv('master_psychiatric_dataset.csv')
    
    # Drop any rows where text might be missing just to be safe
    df = df.dropna(subset=['text'])
    
    print("2. Converting to Hugging Face format...")
    hf_dataset = Dataset.from_pandas(df)
    
    print("3. Loading BERT Tokenizer...")
    # Downloading the vocabulary rules for BERT
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    
    def tokenize_function(examples):
        # Converting text to tokens, padding short ones and cutting long ones to 128 words
        return tokenizer(examples['text'], padding='max_length', truncation=True, max_length=128)
    
    print("4. Tokenizing the data (This might take a few minutes)...")
    tokenized_dataset = hf_dataset.map(tokenize_function, batched=True)
    
    print("5. Formatting for PyTorch...")
    # Keeping only the columns the model needs
    tokenized_dataset.set_format(type='torch', columns=['input_ids', 'token_type_ids', 'attention_mask', 'labels'])
    
    print("6. Splitting into 90% Training and 10% Testing data...")
    split_dataset = tokenized_dataset.train_test_split(test_size=0.1)
    
    print("7. Saving final processed dataset to disk...")
    os.makedirs('./processed_data', exist_ok=True)
    split_dataset.save_to_disk('./processed_data')
    
    print("\nSuccess! Preprocessing complete. Data is 100% ready for Model Training.")

if __name__ == "__main__":
    main()