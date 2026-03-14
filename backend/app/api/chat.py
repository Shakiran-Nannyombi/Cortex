"""Chat API endpoints for chatbot functionality."""
from flask import request, jsonify
from flask_cors import cross_origin
import openai
import os
from functools import wraps
from app.models.user import User

def token_required(f):
    """Decorator to check JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Missing authorization token'}), 401
        try:
            token = token.split(' ')[1]
            from app.extensions import jwt
            data = jwt.decode(token, options={"verify_signature": False})
            user = User.query.get(data['user_id'])
            if not user:
                return jsonify({'error': 'User not found'}), 401
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

def create_chat_bp():
    """Create chat blueprint."""
    from flask import Blueprint
    chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

    @chat_bp.route('/message', methods=['POST'])
    @cross_origin()
    @token_required
    def send_message():
        """Send a message to the chatbot."""
        try:
            data = request.get_json()
            message = data.get('message', '').strip()
            
            if not message:
                return jsonify({'error': 'Message cannot be empty'}), 400
            
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                return jsonify({'error': 'OpenAI API key not configured'}), 500
            
            openai.api_key = api_key
            
            response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {
                        'role': 'system',
                        'content': 'You are a helpful assistant for Cortex, a document management and processing platform. Help users with questions about their documents, the app features, and how to use the platform. Keep responses concise and helpful.'
                    },
                    {
                        'role': 'user',
                        'content': message
                    }
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            reply = response.choices[0].message.content
            return jsonify({
                'success': True,
                'message': reply
            }), 200
            
        except Exception as e:
            return jsonify({
                'error': f'Failed to process message: {str(e)}'
            }), 500

    return chat_bp
