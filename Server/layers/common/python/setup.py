from setuptools import setup, find_packages

setup(
    name="lambda-layers",
    version="0.1.0",
    packages=find_packages(),
    py_modules=["rds","dynamo"]
)