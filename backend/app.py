from flask import Flask
from flask_cors import CORS


# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"