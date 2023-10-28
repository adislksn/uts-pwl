'''import setuptools'''
from setuptools import setup

# List of dependencies installed via `pip install -e .`
# by virtue of the Setuptools `install_requires` value below.
requires = [
    'pyramid',
    'pymysql',
    'pyramid_jwt',
    'pyramid_debugtoolbar',
    'waitress',
    'wsgicors'
]
dev_requires = [
    'pyramid_debugtoolbar',
]


setup(
    name='product',
    install_requires=requires,
    extras_require={
        'dev': dev_requires,
    },
    entry_points={
        'paste.app_factory': [
            'main = product:main'
        ],
    },
)