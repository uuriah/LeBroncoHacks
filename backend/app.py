from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from getItemPrice import get_average_price


# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message' : "Hello world"
    })

@app.route('/api/price', methods=['GET', 'POST'])
def index():
    average_price = None
    search_term = ''

    if request.method == "POST":
        search_term = request.form.get('query', '')
        if search_term:
            average_price = get_average_price(search_term)
        
        return render_template('index.html', average_price=average_price, search_term=search_term)

if __name__ == "__main__":
    app.run(debug=True)


# def index():
#     return "<p>Hello, World!</p>"