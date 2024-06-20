from django.contrib import admin
from api.models import Category, Course, Module, Section, Cart, Enrollment, Payment

admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Section)
admin.site.register(Cart)
admin.site.register(Enrollment)
admin.site.register(Payment)
