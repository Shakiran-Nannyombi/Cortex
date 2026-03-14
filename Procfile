web: cd backend && gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT wsgi:app
release: cd backend && flask --app wsgi:app db upgrade
