from django.contrib import admin
from .models import Advert, Survey, Question, Choices, Answer, SurveyResponse, ViewedAdverts
from user_manage.models import Business,Interests

class BusinessAdmin(admin.ModelAdmin):
    list_display = ("advert_title", "advert_slug", "advert_budget","advert_file","username"
                    ) # "advert_file", "username", "email","category_technology","category_sports","category_health","category_diy"

class AdvertAdmin(admin.ModelAdmin):
    list_display = ("advert_title", "advert_slug", "advert_budget", "advert_file","advert_category")


class SurveyAdmin(admin.ModelAdmin):
    list_display = ("name", "advert")


class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question", "survey", "answer_type")

    def survey(self):
        return Survey.name



admin.site.register(Survey, SurveyAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choices)
admin.site.register(Answer)
admin.site.register(ViewedAdverts)
admin.site.register(SurveyResponse)
admin.site.register(Advert, AdvertAdmin)
