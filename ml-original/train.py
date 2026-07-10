import numpy as np
from datasets import load_from_disk
from transformers import BertForSequenceClassification, TrainingArguments, Trainer
from sklearn.metrics import accuracy_score

# Model ki accuracy check karne ka function
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {"accuracy": accuracy_score(labels, predictions)}

def main():
    print("1. Loading Processed Dataset from Disk...")
    dataset = load_from_disk('./processed_data')
    
    # Preprocess wali script mein humne pehle hi train aur test mein baant diya tha
    train_dataset = dataset['train']
    eval_dataset = dataset['test']
    
    print("2. Loading the BERT Model (4 Classes)...")
    # 0: Normal, 1: Depression, 2: Anxiety, 3: Suicidal
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=4)
    
    print("3. Setting up Training Arguments...")
    # Tumhare HP laptop ke hisaab se batch size 8 rakha hai taaki memory overflow na ho
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,             # Dataset par 3 baar pura round lagayega
        per_device_train_batch_size=8,  
        per_device_eval_batch_size=8,
        eval_strategy="epoch",          # Har round ke baad accuracy check karega
        save_strategy="epoch",
        logging_dir='./logs',
        logging_steps=50,
    )
    
    print("4. Initializing AI Trainer...")
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        compute_metrics=compute_metrics,
    )
    
    print("5. Starting Training! (Isme thoda time lagega, aaram se baitho)...")
    trainer.train()
    
    print("6. Saving the Final Trained Model...")
    # Jab training khatam hogi, model is folder mein save ho jayega
    trainer.save_model('./final_mental_health_model')
    print("Mission Accomplished! Your custom AI model is fully trained and saved.")

if __name__ == "__main__":
    main()