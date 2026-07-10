import pandas as pd
import os

def standardize_labels(text):
    # Mapping logic for your specific datasets
    text = str(text).lower().strip()
    if 'anxiety' in text or text == '2':
        return 2
    elif 'suicid' in text or text == '3':
        return 3
    elif 'depress' in text or text == '1': 
        return 1
    elif 'normal' in text or 'non-suicide' in text or text == '0':
        return 0
    else:
        return -1

def main():
    print("1. Loading 'Combined Data.csv'...")
    # Dataset 1: Often uses 'statement' and 'status'
    df1 = pd.read_csv('Combined Data.csv')
    df1 = df1.rename(columns={'statement': 'text', 'status': 'raw_label', 'text': 'text'})
    
    print("2. Loading 'Mental-Health-Twitter.csv'...")
    # Dataset 2: Twitter data
    df2 = pd.read_csv('Mental-Health-Twitter.csv')
    # Finding text column (could be 'post_text' or 'text')
    t_col = 'post_text' if 'post_text' in df2.columns else 'text'
    df2 = df2.rename(columns={t_col: 'text', 'label': 'raw_label'})

    print("3. Loading 'mental_health.csv'...")
    # Dataset 3: Corpus data
    df3 = pd.read_csv('mental_health.csv')
    df3 = df3.rename(columns={'text': 'text', 'label': 'raw_label'})

    print("4. Harmonizing and Merging...")
    # Combining only the necessary columns
    merged_df = pd.concat([
        df1[['text', 'raw_label']], 
        df2[['text', 'raw_label']], 
        df3[['text', 'raw_label']]
    ], ignore_index=True)
    
    merged_df = merged_df.dropna(subset=['text'])

    print("5. Mapping Labels...")
    merged_df['labels'] = merged_df['raw_label'].apply(standardize_labels)
    
    # Filtering out unmapped data
    final_df = merged_df[merged_df['labels'] != -1].copy()
    final_df = final_df[['text', 'labels']]

    print(f"Success! Total rows in final dataset: {len(final_df)}")
    
    print("6. Saving Master Dataset...")
    final_df.to_csv('master_psychiatric_dataset.csv', index=False)
    print("File 'master_psychiatric_dataset.csv' created successfully!")

if __name__ == "__main__":
    main()