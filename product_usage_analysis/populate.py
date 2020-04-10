#!/usr/bin/env python

"""
    Script to import data from .csv file to JBProduct Database DJango
    To execute this script run: 
                                1) manage.py shell
                                2) exec(open('populate.py').read())
"""

import csv
from products.models import JBProduct 

CSV_PATH = '../fls-data.csv'  


with open(CSV_PATH, newline='\n') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if row[0] == 'timestamp':
            continue 

        if row[1] != '':
            data = row[1]
            if data == 'null':
                data = 0
            JBProduct.objects.create(product_name='WebStorm', time=row[0], count=data)
        if row[2] != '':
            data = row[2]
            if data == 'null':
                data = 0
            JBProduct.objects.create(product_name='PhpStorm', time=row[0], count=data)
        if row[3] != '':
            data = row[3]
            if data == 'null':
                data = 0
            JBProduct.objects.create(product_name='IntelliJ IDEA', time=row[0], count=data)