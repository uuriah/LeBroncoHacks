from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from getItemPrice import get_average_price


# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message': "Hello world"
    })

@app.route('/api/price', methods=['GET', 'POST'])
def index():
    average_price = None
    search_term = ''

    if request.method == "POST":
        # Handle both form submissions and JSON requests
        if request.is_json:
            data = request.get_json()
            search_term = data.get('query', '')
        else:
            search_term = request.form.get('query', '')
            
        if search_term:
            average_price = get_average_price(search_term)
            
        # Return JSON response for API requests
        return jsonify({
            'average_price': average_price,
            'search_term': search_term
        })
    
    # For GET requests, return the HTML template
    return render_template('index.html', average_price=average_price, search_term=search_term)

if __name__ == "__main__":
    app.run(debug=True, port=8080)  # Changed to port 8080 to match frontend