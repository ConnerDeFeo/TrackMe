import sys
import os

# Add the Server directory to Python path so tests can import from lambdas/
server_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, server_root)

# Add layers directory if you have shared code there
layers_root = os.path.join(server_root, 'layers')
if os.path.exists(layers_root):
    sys.path.insert(0, layers_root)
