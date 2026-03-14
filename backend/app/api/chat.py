"""Chat API endpoints for chatbot functionality."""
from flask import request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai
import os
from app.models.user import User

def create_chat_bp():
    """Create chat blueprint."""
    from flask import Blueprint
    chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

    @chat_bp.route('/message', methods=['POST'])
    @cross_origin()
    @jwt_required(optional=True)
    def send_message():
        """Send a message to the chatbot."""
        try:
            user_id = get_jwt_identity()
            user = None
            if user_id:
                user = User.query.get(user_id)
            
            data = request.get_json()
            message = data.get('message', '').strip()
            
            if not message:
                return jsonify({'error': 'Message cannot be empty'}), 400
            
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key or api_key == 'your-openai-api-key-here':
                return jsonify({
                    'error': 'Chatbot is not configured. Please add OPENAI_API_KEY to environment variables.',
                    'message': 'Demo mode: Chatbot would respond here with OpenAI API key configured.'
                }), 503
            
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
