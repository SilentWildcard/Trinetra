"""
Trinetra — Autonomous Safety Guardian
Dedicated Prototype Server with Strict Content-Type & MIME Configuration
Guarantees text/html; charset=utf-8 to prevent browsers from displaying raw HTML as text.
"""

import http.server
import socketserver
import os
import sys
import posixpath

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class TrinetraHTTPHandler(http.server.SimpleHTTPRequestHandler):
    # Explicit MIME dictionary to override Windows registry quirks
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.htm': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.mjs': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain; charset=utf-8',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def guess_type(self, path):
        # Normalize and strip query parameters or hashes
        clean_path = path.split('?')[0].split('#')[0]
        base, ext = posixpath.splitext(clean_path)
        ext = ext.lower()
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        if clean_path.endswith('/') or clean_path == '' or os.path.isdir(self.translate_path(clean_path)):
            return 'text/html; charset=utf-8'
        return 'application/octet-stream'

    def end_headers(self):
        # Force strict anti-caching and correct content parsing
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    # Bind to all interfaces (0.0.0.0) so both localhost, 127.0.0.1, and ::1 work
    try:
        with ReusableTCPServer(("", PORT), TrinetraHTTPHandler) as httpd:
            print(f"===================================================")
            print(f"  TRINETRA SERVER ACTIVE: http://localhost:{PORT}")
            print(f"  MIME: text/html; charset=utf-8 (Strict Mode)")
            print(f"===================================================")
            sys.stdout.flush()
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server on port {PORT}: {e}", file=sys.stderr)
        sys.exit(1)
