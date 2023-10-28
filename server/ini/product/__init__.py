'''import module'''
import json
from pyramid.config import Configurator
from pyramid.view import view_config
import pymysql
from wsgicors import CORS
import jwt
import datetime

# Koneksi ke database MySQL

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='product',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

@view_config(route_name='product', request_method='GET', renderer='json')
def product(request):
    '''Create a hello view to get'''
    # show from table movies
    with connection.cursor() as cursor:
        sql = "SELECT * FROM assets"
        cursor.execute(sql)
        result = cursor.fetchall()
        
    data = []
    for item in result:
        data.append({
            'id': item['id'],
            'nama_produk': item['product_name'],
            'harga_produk': item['product_price'],
            'stok': item['supply'],
        })
    return {
        'greet': 'ok', 
        'data': data
        }

@view_config(route_name='product-create', request_method='POST', renderer="json")
def product_create(request):
    '''Create a product view to post'''
    # insert into table assets
    body = request.json_body
    with connection.cursor() as cursor:
        sql = "INSERT INTO assets (product_name, product_price, product_detail, supply) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (body['nama_produk'], body['harga_produk'], body['detail_produk'], body['stok']))
        connection.commit()
    return {'greet': 'ok'}

@view_config(route_name='product-update', request_method='PUT', renderer="json")
def product_update(request):
    '''Create a product view to put'''
    # update table assets
    body = request.json_body
    with connection.cursor() as cursor:
        sql = "UPDATE assets SET product_name=%s, product_price=%s, product_detail=%s, supply=%s WHERE id=%s"
        cursor.execute(sql, (body['nama_produk'], body['harga_produk'], body['detail_produk'], body['stok'], body['id']))
        connection.commit()
    return {'greet': 'ok'}
    
@view_config(route_name='product-delete', request_method='DELETE', renderer="json")
def product_delete(request):
    '''Create a product view to delete'''
    # delete from table assets
    with connection.cursor() as cursor:
        sql = "DELETE FROM assets WHERE id=%s"
        cursor.execute(sql, (request.GET.get('id')))
        connection.commit()
    return {'greet': 'ok'}

@view_config(route_name='product-byID', request_method='GET', renderer="json")
def product_byID(request):
    '''Create a product view to get by ID'''
    with connection.cursor() as cursor:
        sql = "SELECT * FROM assets WHERE id=%s"
        cursor.execute(sql, (request.GET.get('id')))
        response = cursor.fetchone()
    return {'greet': 'ok', 'data': response}

def main(global_config, **settings):
    config = Configurator()
    config.add_route('product', '/')
    config.add_route('product-create', '/product-create')
    config.add_route('product-update', '/product-update')
    config.add_route('product-delete', '/product-delete')
    config.add_route('product-byID', '/product')
    config.scan()
    config.add_static_view(name='static', path='static')
    app = config.make_wsgi_app()
    return CORS(app, headers="*", methods="*", maxage="180", origin="*", expose_headers="*")