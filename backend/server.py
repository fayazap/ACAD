# backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load and prepare the dataset (Replace with your actual dataset)
dataset_path = '../dataset/career_dataset.csv'
df = pd.read_csv(dataset_path)
X, y = df['text'], df['label']

# Train the model
model = make_pipeline(CountVectorizer(), MultinomialNB())
model.fit(X, y)

@app.route('/predict_career', methods=['POST'])
def predict_career():
    try:
        user_input = request.json.get('user_input', '').lower()
         # Get probability estimates for all classes
        probabilities = model.predict_proba([user_input])[0]

        # Create a list of dictionaries containing career and probability
        career_probabilities = [{'career': career, 'probability': prob} for career, prob in zip(model.classes_, probabilities)]

         # Filter careers based on probability (greater than 0.01)
        filtered_careers = [career for career in career_probabilities if career['probability'] > 0.01]

        # Sort filtered careers based on probability in descending order
        sorted_careers = sorted(filtered_careers, key=lambda x: x['probability'], reverse=True)

        response_data = {
            'userInput': user_input,
            'predictedCareers': sorted_careers,
            'message': f"We suggest considering a career in the following fields."
        }

        return jsonify(response_data)


    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
