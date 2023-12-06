from concurrent import futures
import grpc
import pymysql
import math
from grpc import RpcError
from pyramid.config import Configurator
from pyramid.view import view_config
from wsgicors import CORS
from product_pb2 import Empty, Product, ProductList, ProductRequest, ProductResponse, ProductId
from product_pb2_grpc import add_ProductServiceServicer_to_server, ProductServiceServicer

# Your existing Pyramid code...
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='product',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# Implement ProductServiceServicer
class ProductServicer(ProductServiceServicer):
    def GetProductList(self, request, context):
        with connection.cursor() as cursor:
            sql = "SELECT * FROM assets"
            cursor.execute(sql)
            data = cursor.fetchall()

        product_data = [
            Product(
                id=datas['id'],
                nama_produk=datas['product_name'],
                harga_produk=datas['product_price'],
                stok=datas['supply']
            )
            for datas in data
        ]

        return ProductList(products=product_data)

    def CreateProduct(self, request, context):
        
        body = request
        
        with connection.cursor() as cursor:
            sql = "INSERT INTO assets (product_name, product_price, product_detail, supply) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (body.nama_produk, body.harga_produk, body.detail_produk, body.stok))
            connection.commit()
        
        product_data = Product(
            nama_produk=body.nama_produk,
            harga_produk=body.harga_produk,
            stok=body.stok
        )

        return ProductResponse(greet="ok", data=product_data)

    def UpdateProduct(self, request, context):
        body = request
        with connection.cursor() as cursor:
            sql = "UPDATE assets SET product_name=%s, product_price=%s, product_detail=%s, supply=%s WHERE id=%s"
            cursor.execute(sql, (body.nama_produk, body.harga_produk, body.detail_produk, body.stok, body.id))
            connection.commit()

        product_data = Product(
            nama_produk=body.nama_produk,
            harga_produk=body.harga_produk,
            stok=body.stok
        )
        return ProductResponse(greet="ok", data=product_data)

    def DeleteProduct(self, request, context):
        # Your existing code for deleting a product
        return ProductResponse(greet="ok", data=Product())

    def GetProductById(self, request, context):
        # Your existing code for getting a product by ID
        product_data = Product(...)  # Replace with actual product data
        return ProductResponse(greet="ok", data=product_data)

    def GetProductCount(self, request, context):
        # Your existing code for getting product count
        count = 42  # Replace with actual count
        return ProductResponse(greet="ok", data=Product(id=count, nama_produk=str(count)))

def main():
    config = Configurator()

    # Your existing route configurations...
    config.add_route('GetProductList', '/')
    config.add_route('CreateProduct', '/product-create')
    config.add_route('UpdateProduct', '/product-update')
    config.add_route('DeleteProduct', '/product-delete')
    config.add_route('GetProductById', '/product')
    config.add_route('GetProductCount', '/product-count')
    config.scan()

    # gRPC server setup
    grpc_app = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_ProductServiceServicer_to_server(ProductServicer(), grpc_app)
    grpc_app.add_insecure_port("localhost:50051")
    grpc_app.start()
    grpc_app.wait_for_termination()

    # Combine your Pyramid and gRPC apps using wsgicors
    pyramid_app = config.make_wsgi_app()
    app = CORS(pyramid_app, headers="*", methods="*", maxage="180", origin="*", expose_headers="*")

    return app

if __name__ == "__main__":
    main()