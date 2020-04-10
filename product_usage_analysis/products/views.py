"""Model views are defined here"""
from rest_framework import generics
from .serializers import ProductSerializer
from .models import JBProduct

class ProductListAPIView(generics.ListAPIView):
    """
        Read-only вьюха для списочного представления модели записи об использовании продукта
    """
    queryset = JBProduct.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


