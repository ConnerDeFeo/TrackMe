import sys
import os

# Add the Server directory to Python path so tests can import from lambdas/
server_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, server_root)

# Add each layer's python directory to the path
layers_root = os.path.join(server_root, 'layers')
layer_python_dirs = [
    os.path.join(layers_root, 'rds', 'python'),
    os.path.join(layers_root, 'dynamo', 'python'),
    os.path.join(layers_root, 'decimal_encoder', 'python')
]

for layer_dir in layer_python_dirs:
    if os.path.exists(layer_dir):
        sys.path.insert(0, layer_dir)
