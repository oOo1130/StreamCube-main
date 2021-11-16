from rest_framework import serializers
from user_manage.serializers import InterestsSerializer
from user_manage.models import Consumer, User
from .models import Advert, Question, Survey, Choices, Answer, SurveyResponse


class AdvertSerializer(serializers.ModelSerializer):

    class Meta:
        model = Advert
        fields = ('advert_title', 'advert_category', 'advert_budget', 'advert_file', 'advert_image') #'advert_uploader',


class AnswerChoicesSerializer(serializers.Serializer):
    choice = serializers.CharField(max_length=250)


class QuestionSerializer(serializers.Serializer):
    choices = AnswerChoicesSerializer(many=True, required=False)
    question = serializers.CharField(max_length=250)
    answer_type = serializers.CharField(max_length=30)


class SurveySerializer(serializers.ModelSerializer):

    questions = QuestionSerializer(many=True)

    class Meta:
        model = Survey
        fields = ('name', 'questions')

    def create(self, validated_data):
        question_data = validated_data.pop('questions')
        new_survey = Survey.objects.create(**validated_data)
        for question_data in question_data:
            new_question = Question.objects.create(survey=new_survey,
                                                   question=question_data['question'],
                                                   answer_type=question_data['answer_type'])
            if question_data['answer_type'] == "RADIO_SELECT":
                for cur in question_data['choices']:
                    Choices.objects.create(question=new_question, choice=cur['choice'])
        return new_survey

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance


class ReadAnswerSerializer(serializers.Serializer):
    answer = serializers.CharField(max_length=450)


class AnswerSerializer(serializers.ModelSerializer):

    answers = ReadAnswerSerializer(many=True)

    class Meta:
        model = Answer
        fields = ('answers', )

    def create(self, validated_data):
        print(validated_data)
        answer_data = validated_data.pop('answers')
        answer_list = list(answer_data)
        advert = Advert.objects.get(advert_slug=validated_data.pop('advert_slug'))
        survey = Survey.objects.get(advert=advert)
        questions = Question.objects.filter(survey=survey)
        user = User.objects.get(username=validated_data.pop('user'))
        consumer = Consumer.objects.get(user=user)
        survey_response = SurveyResponse.objects.create(survey=survey, user=consumer, advert=advert)
        for question in questions:
            answer = answer_list.pop(0)
            Answer.objects.create(answer=answer['answer'],
                                  survey_response=survey_response,
                                  question=question,
                                  consumer=consumer)
        return survey_response