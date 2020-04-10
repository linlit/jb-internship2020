import csv

from django.db.models import Model, DateTimeField, ForeignKey, \
    DateTimeField, CharField, PositiveIntegerField


class JBProduct(Model):
    """
        Модель записи об использовании продукта. 
    """
    product_name = CharField("Название продукта", max_length=100, blank=True)
    time = DateTimeField("Время использования", blank=True)
    count = PositiveIntegerField("Количество использований", blank=True)

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

    def __str__(self):
        return self.product_name