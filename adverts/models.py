from django.db import models
from django.db.models.signals import pre_save, post_save
from user_manage.models import Business, Interests, Consumer
from django.utils.text import slugify
import hashlib


class Advert(models.Model):

    advert_title = models.CharField(max_length=100)
    advert_uploader = models.ForeignKey(Business, on_delete=models.CASCADE, null=True)
    advert_file = models.FileField(null=True, upload_to='videos/')
    advert_image = models.ImageField(null=True, upload_to='thumbnails/')
    advert_category = models.CharField(max_length=30, choices=Consumer.INTERESTS_CHOICES)
    advert_budget = models.FloatField(null=True)
    advert_slug = models.SlugField(max_length=360, null=True, blank=True, unique=True)
    advert_views = models.IntegerField(default=0, null=True)
    advert_gender_male = models.IntegerField(default=0)
    advert_gender_female = models.IntegerField(default=0)
    advert_gender_other = models.IntegerField(default=0)
    advert_cost = models.FloatField(default=0)

    def update_gender_stats(self, user_gender):
        if user_gender == "Male" or "M":
            self.advert_gender_male += 1
            # total_male = self.advert_gender_male / self.self.advert_views
        elif user_gender == "Female" or "F":
            self.advert_gender_female += 1
            # total_female = self.advert_gender_male / self.self.advert_views
        else:
            self.advert_gender_other += 1


def slug_generator(sender, instance, *args, **kwargs):
    if not instance.advert_slug:
        string = str(instance.advert_uploader.company_name +"_"+ instance.advert_title)
        hash_object = hashlib.md5(string.encode())
        instance.advert_slug = slugify(instance.advert_uploader.company_name +"_" + instance.advert_title + "_" + hash_object.hexdigest())


pre_save.connect(slug_generator, sender=Advert)

class Survey(models.Model):
    name = models.CharField(max_length=400)
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, null=True)


class Question(models.Model):
    ANSWER_CHOICES = (
        ('RADIO_SELECT', 'RADIO_SELECT'),
        ('TEXT', 'TEXT'),
    )

    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, null=True, related_name="survey_title")
    question = models.CharField(max_length=250)
    answer_type = models.CharField(max_length=30, choices=ANSWER_CHOICES)


class Choices(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, related_name="question_related_to_answer")
    choice = models.CharField(max_length=250)


class SurveyResponse(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Consumer, on_delete=models.CASCADE, null=True)
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, null=True)


class Answer(models.Model):
    answer = models.CharField(max_length=450, blank=True)
    survey_response = models.ForeignKey(SurveyResponse, on_delete=models.CASCADE, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True)
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE, null=True)


class ViewedAdverts(models.Model):
    user = models.ForeignKey(Consumer, on_delete=models.CASCADE, null=True)
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, null=True)