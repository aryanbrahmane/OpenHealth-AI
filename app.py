#!python3.12
"""
OpenHealth AI - Full-Stack Root Entry Point
Delegates execution to the production backend REST engine.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app

if __name__ == '__main__':
    print("=" * 65)
    print("OpenHealth AI - Multi-Disease Clinical Platform (Backend REST Engine)")
    print("Serving on http://localhost:5000")
    print("Frontend UI available on http://localhost:5173 (via npm run dev)")
    print("=" * 65)
    app.run(debug=True, host='0.0.0.0', port=5000)
