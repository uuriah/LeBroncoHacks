from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from functools import wraps
from getItemPrice import get_average_price

# Initialize Flask
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Configure upload folder for temporary file storage
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Firebase Admin with path to your new service account key
# Update this path to where you saved your new service account key
SERVICE_ACCOUNT_PATH = 'serviceAccountKey.json'
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Firebase Storage bucket
# You'll need to get the correct bucket name from Firebase console
BUCKET_NAME = 'broncohacks-2025.firebasestorage.app'  # Update this if needed
bucket = storage.bucket(BUCKET_NAME)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
# @require_auth
def return_home():
    return jsonify({
        'message': f"Hello {request.user['email']}"
    })

@app.route("/api/auth/verify", methods=["POST"])
# @require_auth
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
            'tokens' : 0,
            'Address' : '',
            'phoneNumber' : '',
            'createdAt': firestore.SERVER_TIMESTAMP
        })

        return jsonify({
            'message': 'User created successfully',
            'uid': user.uid
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/price', methods=['GET', 'POST'])
def get_price():
    if request.method == "POST":
        try:
            # Handle both form submissions and JSON requests
            if request.is_json:
                data = request.get_json()
                search_term = data.get('query', '')
            else:
                search_term = request.form.get('query', '')
                
            if not search_term:
                return jsonify({'error': 'No search term provided'}), 400
                
            average_price = get_average_price(search_term)
            
            if average_price is None:
                return jsonify({'error': 'Could not determine average price'}), 404
                
            return jsonify({
                'average_price': average_price,
                'search_term': search_term
            })
            
        except Exception as e:
            print(f"Price lookup error: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    # If GET request, render the form template
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            # Get other form data
            item = request.form.get('item', '')
            size = request.form.get('size', '')
            gender = request.form.get('gender', '')
            price = request.form.get('price', 0)
            
            # Create unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            local_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save locally first
            file.save(local_path)
            
            try:
                # Upload to Firebase Storage
                blob = bucket.blob(f"clothing_images/{unique_filename}")
                blob.upload_from_filename(local_path)
                
                # Make the blob publicly accessible
                blob.make_public()
                
                # Get the public URL
                image_url = blob.public_url
                
                # Clean up local file after upload
                os.remove(local_path)
                
                # Save item data to Firestore
                listing_data = {
                    'id': str(uuid.uuid4()),  # Generate an ID for the listing
                    'item': item,
                    'size': size,
                    'gender': gender,
                    'price': float(price) if price else 0,
                    'imageUrl': image_url,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    # Only include userId if user is authenticated
                    'userId': request.user['uid'] if hasattr(request, 'user') else None
                }
                
                # Add to 'listings' collection
                listing_ref = db.collection('listings').document()
                listing_ref.set(listing_data)
                
                return jsonify({
                    'message': 'File uploaded successfully',
                    'imageUrl': image_url,
                    'listingId': listing_ref.id
                }), 201
                
            except Exception as e:
                # If Firebase upload fails, log the detailed error
                print(f"Firebase Storage error: {str(e)}")
                # Try to clean up the local file if it exists
                if os.path.exists(local_path):
                    os.remove(local_path)
                return jsonify({'error': f'Firebase Storage error: {str(e)}'}), 500
                
        return jsonify({'error': 'File type not allowed'}), 400
    
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        # Get all listings from Firestore
        listings_ref = db.collection('listings').order_by('createdAt', direction=firestore.Query.DESCENDING).limit(50)
        listings_docs = listings_ref.stream()
        
        # Format the listings for the frontend
        formatted_listings = []
        for doc in listings_docs:
            listing = doc.to_dict()
            formatted_listings.append({
                'id': listing.get('id', doc.id),
                'name': listing.get('item', ''),
                'price': f"${listing.get('price', 0)}",
                'image': listing.get('imageUrl', ''),
                'size': listing.get('size', ''),
                'gender': listing.get('gender', '')
            })
        
        return jsonify(formatted_listings)
    
    except Exception as e:
        print(f"Listing retrieval error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)