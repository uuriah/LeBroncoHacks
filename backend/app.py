from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from getItemPrice import get_average_price
import firebase_admin
from firebase_admin import credentials, auth, firestore
from functools import wraps
import random

# Initialize Firebase Admin with direct configuration
cred = credentials.Certificate('C:/Users/monke/Projects/LeBroncoHacks/backend/broncohacks-2025-firebase-adminsdk-fbsvc-6f935b8468.json')


firebase_admin.initialize_app(cred)
db = firestore.client()

# Setup Flask
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Authentication decorator
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function

@app.route("/api/home", methods=["GET"])
@require_auth
def return_home():
    return jsonify({
        'message': f"Hello {request.user['email']}"
    })

@app.route("/api/auth/verify", methods=["POST"])
@require_auth
def verify_token():
    return jsonify({
        'uid': request.user['uid'],
        'email': request.user['email']
    })

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password or not name:
            return jsonify({'error': 'Missing required fields'}), 400

        # Create the user in Firebase
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )

        # Store additional user data in Firestore
        db.collection('users').document(user.uid).set({
            'name': name,
            'email': email,
            'createdAt': firestore.SERVER_TIMESTAMP
        })

        return jsonify({
            'message': 'User created successfully',
            'uid': user.uid
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    
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

        return render_template('index.html', average_price=average_price, search_term=search_term)


@app.route('/api/clothes', methods=['GET'])
def getClothes():
    try:
        doc_ref = db.collection('clothes')
        docs = doc_ref.stream()

        # Convert documents to a list of dictionaries
        clothes = []
        for doc in docs:
            clothes.append({'id': doc.id, **doc.to_dict()})

        if len(clothes) < 4:
            return jsonify({'error': 'Not enough items in the collection'}), 400
        
        random_clothes = random.sample(clothes, 4)

        return jsonify(random_clothes), 200

    except Exception as e: 
        return jsonify(e), 500

@app.route('/api/clothes', methods=['POST'])
def newClothes():
    try:
        # Parse the JSON body from the request
        data = request.get_json()

        # Add the clothing item to the Firestore database
        doc_ref = db.collection('clothes').add(data)

        return jsonify({'message': 'Clothing item added successfully', 'id': doc_ref[1].id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clothes/<id>', methods=['PATCH'])
def updateClothes(id):
    try:
        # Parse the JSON body from the request
        data = request.get_json()

        # Validate that at least one field is provided for the update
        if not data:
            return jsonify({'error': 'No fields provided for update'}), 400

        # Reference the specific document in the 'clothes' collection
        doc_ref = db.collection('clothes').document(id)

        # Update the document with the provided fields
        doc_ref.update(data)

        return jsonify({'message': 'Clothing item updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)