import functions_framework
import firebase_admin
from firebase_admin import initialize_app

# Initialisation Firebase (une seule fois )
if not firebase_admin._apps:
    initialize_app()

@functions_framework.https_fn
def getSystemHealth(request ):
    return {
        "status": "OK", 
        "version": "3.0.0",
        "timestamp": "2025-06-24",
        "message": "Oracle Portfolio 3.0 opérationnel"
    }
