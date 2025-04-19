from flask import Flask, jsonify
from flask_cors import CORS


# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        'message' : "Hello world"
    })

if __name__ == "__main__":
    app.run(debug=True)


# def index():
#     return "<p>Hello, World!</p>"