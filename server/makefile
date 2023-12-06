run develop:
	@echo "Running development server"
	venv\Scripts\pserve ini\development.ini --reload

install develop:
	@echo "Installing dependencies, if error occurs, cd into server\ini then run make install develop"
	venv\Scripts\pip install -e ".[dev]"

generate requirements:
	@echo "Generating requirements.txt"
	pip list --format=freeze > requirements.txt

proto generate:
	python -m grpc_tools.protoc -I protobufs --python_out=recommendations --grpc_python_out=recommendations protobufs/recommendations.proto

proto generate2:
	python -m grpc_tools.protoc -I protobufs --python_out=ini/product --grpc_python_out=ini/product protobufs/product.proto