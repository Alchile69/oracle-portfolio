from functions_framework import https_fn
import firebase_admin
from firebase_admin import initialize_app

initialize_app( )

@https_fn
def getSystemHealth(req ):
    return {"status": "OK", "version": "3.0.0", "timestamp": "2025-06-24"}
