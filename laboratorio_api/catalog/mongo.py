"""
Conexión a MongoDB usando variables de .env vía Django settings:
  MONGO_URI, MONGO_DB (definidas en lab/settings.py)
"""
from django.conf import settings
from pymongo import MongoClient

_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB]