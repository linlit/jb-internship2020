"""Model serializers are defined here"""
from rest_framework import serializers
from .models import JBProduct


class ProductSerializer(serializers.ModelSerializer):
    """ 
        Стандартный сериализатор для модели записи об использовании продукта
    """

    class Meta:
        model = JBProduct
        fields = ('id', 'product_name', 'time', 'count')