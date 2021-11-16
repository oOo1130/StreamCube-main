from .models import Advert, Survey, Choices, Question, SurveyResponse, Answer, ViewedAdverts
from django.db.models import F
from rest_framework import permissions, generics
from .serializers import AdvertSerializer, SurveySerializer, QuestionSerializer, AnswerChoicesSerializer, AnswerSerializer
from rest_framework.response import Response
from django.http import HttpResponse
from wsgiref.util import FileWrapper
from user_manage.models import User, Business, Consumer, Interests
from user_manage.serializers import UserSerializer, InterestsSerializer, BusinessSerializer
from zipfile import ZipFile
from django.http import FileResponse
import random
from fpdf import FPDF


class IncrementAdvertViewsAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        data = request.data
        slug = data.get("advert_slug")
        advert = Advert.objects.get(advert_slug=slug)
        advert.advert_views = advert.advert_views + 1
        advert.save()


class ConsumerAdvertDetailAPI(generics.GenericAPIView):

    def get(self, request):
        slug = request.query_params.get("slug")
        advert = Advert.objects.get(advert_slug=slug)
        print(advert.advert_title, advert.advert_views)
        return Response({"title": advert.advert_title,
                         "views": advert.advert_views})


class ConsumerAdvertAPI(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    @staticmethod
    def check_history(advert_list, consumer):
        survey_adverts_list = list(
            SurveyResponse.objects.filter(user=consumer))
        for survey_advert in survey_adverts_list:
            if survey_advert.advert in advert_list:
                advert_list.remove(survey_advert.advert)
        return advert_list

    def post(self, request):
        user = request.user
        consumer = Consumer.objects.get(user=user)
        advert_list = []
        response_list = []
        query_size = 6

        for interest in consumer.interests:
            advert = list(Advert.objects.filter(advert_category=interest))
            checked_adverts = self.check_history(advert, consumer)
            advert_list.extend(checked_adverts)

        for advert in advert_list:
            response_element = {}
            response_element["advert_title"] = advert.advert_title
            response_element["advert_slug"] = advert.advert_slug
            response_element["advert_uploader"] = advert.advert_uploader.company_name
            response_element["advert_category"] = advert.advert_category
            response_list.append(response_element)
        random.shuffle(response_list)

        return Response({"advert_list": response_list})


class UploadAdvertAPI(generics.GenericAPIView):
    serializer_class = AdvertSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        business = Business.objects.get(user=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.save(advert_uploader=business):
            return Response({
                "msg": "Success"
            })

# Test API to return video files

# sweets here


class updateBusinessVideo(generics.GenericAPIView):
    def post(self, request, *arg, **kwargs):
        request_data = request.data
        print(request_data)
        advert_slug = request_data.get('advert_slug')

        advert_title = request_data.get('advert_title')
        advert_category = request_data.get('advert_category')
        advert_budget = request_data.get('advert_budget')
        advert_file = request_data.get('advert_file')
        advert_image = request_data.get('advert_image')

        advert = Advert.objects.get(advert_slug=advert_slug)
        business = Business.objects.get(advert=advert)
        business.save()

        try:
            advert.advert_title = advert_title
            advert.advert_category = advert_category
            advert.advert_budget = advert_budget
            advert.advert_file = advert_file
            advert.advert_image = advert_image
            advert.save()
        except:
            return Response({
                "msg": "Username or Email maybe be invalid or already in use"
            })
        return Response({
            "msg": "Success"
        })


class AdvertExperimentImageAPI(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        slug = request.data.get('img_url')
        advert = Advert.objects.get(advert_slug=slug)
        response = HttpResponse(FileWrapper(
            advert.advert_image), content_type='application/png')
        response['Content-Disposition'] = 'attachment; filename="' + \
            advert.advert_title + '"'
        return response


# Test API to return video files
class AdvertExperimentAPI(generics.GenericAPIView):

    def get(self, request):
        advert = Advert.objects.get(advert_slug='dfdgsf')
        response = HttpResponse(FileWrapper(
            advert.advert_image), content_type='application/png')
        response['Content-Disposition'] = 'attachment; filename="' + \
            advert.advert_title+'"'
        return response

# Test API to return video files


class AdvertGetVideoAPI(generics.GenericAPIView):
    permission_classes = [
        # permissions.IsAuthenticated
    ]

    def post(self, request):
        slug = request.data.get('advert_slug')
        advert = Advert.objects.get(advert_slug=slug)
        response = HttpResponse(FileWrapper(
            advert.advert_file), content_type='application/mp4')
        response['Content-Disposition'] = 'attachment; filename="' + \
            advert.advert_title+'"'
        return response


# Get Advert Detail
class AdvertDetailAPI(generics.GenericAPIView):
    permission_classes = [
        # permissions.IsAuthenticated
    ]

    def post(self, request):
        params = request.data
        print(params)
        advert = Advert.objects.get(advert_slug=params.get('advert_slug'))
        business = advert.advert_uploader
        return Response({
            "title": advert.advert_title,
            "business": business.company_name,
            "budget": advert.advert_budget,
            "category": advert.advert_category,
            "views": advert.advert_views,
            "cost": advert.advert_cost
        })


"""class BusinessAdvertViewAPI(generics.GenericAPIView):
    permission_classes = [
       # permissions.IsAuthenticated
    ]

    @staticmethod
    def create_zip(file_list, name):
        zip_file = ZipFile("zip_files/" + name + ".zip", "w")
        for filename in file_list:
            zip_file.write(filename)
        zip_file.close()

    def get(self, request):
        user = User.objects.get(username="books_r_us_1") # Comment this line out
        business = Business.objects.get(user=user)# Change to request.user
        advert_set = Advert.objects.filter(advert_uploader=business)
        data = list(advert_set.values())
        business_adverts = []
        files_to_be_zipped = []

        for cur in data:
            data_dict = {}
            business = Business.objects.get(id=cur.get('advert_uploader_id'))
            data_dict['advert_organization'] = business.company_name
            data_dict['advert_title'] = cur.get('advert_title')
            data_dict['advert_category'] = cur.get('advert_category')
            data_dict['advert_image'] = cur.get('advert_image')
            data_dict['advert_slug'] = cur.get('advert_slug')

            raw_title = cur.get('advert_image')
            title = str(raw_title).replace("thumbnails/", "").replace(".png", "").replace(".jpg", "")
            thumbnail_title = str(raw_title).replace("thumbnails/", "")
            print(title)
            business_adverts.append(data_dict)

            with open('json_files/' + title + '.json', 'w') as f:
                json.dump(data_dict, f)
            files_to_be_zipped.append('json_files/' + title + '.json')
            files_to_be_zipped.append('thumbnails/' + thumbnail_title)

        self.create_zip(files_to_be_zipped, business.company_name)
        file = open('zip_files/'+business.company_name+".zip", 'rb')
        response = FileResponse(file)

        return response"""


class AdvertViewExperimentAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        print(request.user)
        # user = User.objects.get(username="KeyurBusiness") # Comment this line out
        business = Business.objects.get(
            user=request.user)  # Change to request.user

        advert_set = Advert.objects.filter(advert_uploader=business)
        data = list(advert_set.values())
        business_adverts = []

        for cur in data:
            data_dict = {}
            business = Business.objects.get(id=cur.get('advert_uploader_id'))
            data_dict['advert_organization'] = business.company_name
            data_dict['advert_title'] = cur.get('advert_title')
            data_dict['advert_category'] = cur.get('advert_category')
            data_dict['advert_image'] = cur.get('advert_image')
            data_dict['advert_slug'] = cur.get('advert_slug')
            business_adverts.append(data_dict)

        return Response(business_adverts)


class EditSurveyAPI(generics.GenericAPIView):
    pass

# Create Survey Created in serializer


class CreateSurveyAPI(generics.GenericAPIView):
    serializer_class = SurveySerializer

    def post(self, request):
        data = request.data
        title = data.get('name')
        advert = Advert.objects.get(advert_title=title)
        # advert_slug=request.data
        # Can use slug if you want but just pass it in from the request.data
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        serializer.is_valid(raise_exception=True)
        # Pass advert to save method to add it to the survey model
        survey = serializer.save(advert=advert)
        return Response({
            "survey": survey.name,
            "msg": "success"
        })


# Two requests in one view a get and a post
# Get will retrieve the questions
# Post will save the answers using the answer serializers
# You can pass the data as a dictionary as shown below
# answers = [{"answer":"#Answer to question 1"}, {"answer":"#Answer to question 2"}]

class CompleteSurveyAPI(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = AnswerSerializer

    def get(self, request):
        params = request.query_params
        slug = params.get('slug')
        advert = Advert.objects.get(advert_slug=slug)
        print(advert.advert_title, advert.advert_slug, advert)
        # add advert slug request data
        survey = Survey.objects.get(advert=advert)
        question = Question.objects.filter(survey=survey)
        data = list(question.values())
        survey_dict = []
        for cur in data:
            data_dict = {}
            data_dict['question'] = cur.get('question')
            data_dict['answer_type'] = cur.get('answer_type')

            if cur.get('answer_type') == "RADIO_SELECT":
                choice_arr = []
                choices = Choices.objects.filter(question=cur.get('id'))
                choices_list = list(choices.values())
                num = 0
                for temp in choices_list:
                    choice_dict = {}
                    choice_dict['choice'] = temp.get('choice')
                    choice_arr.append(choice_dict)
                    num += 1
                data_dict["choices"] = choice_arr
            survey_dict.append(data_dict)
        return Response({'questions': survey_dict})

    def post(self, request):
        slug = request.data.pop("slug")
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user.username, advert_slug=slug)
        # add advert slug request data
        success = self.update_consumer_balance(slug, user=request.user)
        if success:
            self.update_cost(slug)
        self.update_views(slug)
        return Response({
            "msg": success
        })

    @staticmethod
    def update_views(slug):
        Advert.objects.filter(advert_slug=slug).update(
            advert_views=F('advert_views') + 1)

    @staticmethod
    def update_cost(slug):
        Advert.objects.filter(advert_slug=slug).update(
            advert_cost=F('advert_cost') + 0.1)

    @staticmethod
    def update_consumer_balance(slug, user):
        advert = Advert.objects.get(advert_slug=slug)
        if advert.advert_cost + 0.1 >= advert.advert_budget:
            print("Error")
            return False
        elif advert.advert_cost + 0.1 <= advert.advert_budget:
            Consumer.objects.filter(user=user).update(
                balance=F('balance') + 0.1)
            return True


# Used to format the pdf page

class PDF(FPDF):

    WIDTH = 210

    def header(self):
        # Logo
        self.image('resources/letterhead_Replaced.png', 0, 0, self.WIDTH)
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Line break
        self.ln(55)

    # Page footer
    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()), 0, 0, 'C')


class GetAdvertReportAPI(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    @staticmethod
    def create_zip(file_list, name):
        zip_file = ZipFile("zip_files/" + name + ".zip", "w")
        zip_file.write(file_list)
        zip_file.close()

    @staticmethod
    def create_report(report_data, advert_title):
        pdf = PDF()
        pdf.set_font('Arial', '', 12)
        pdf.add_page()
        for report in report_data:
            line = 55
            if line == 100:
                pdf.add_page()
                line = 55
            else:
                pdf.cell(60, 10, str(report), 0, line, 'L')
            line += 1
        pdf.output('reports/' + advert_title + '.pdf', 'F')

    def get(self, request):
        answers_to_report = []
        slug = request.query_params.get('slug')
        advert = Advert.objects.get(advert_slug=slug)
        answers_to_report.append("Advert Title: " + str(advert.advert_title))
        answers_to_report.append("Category: " + str(advert.advert_category))
        answers_to_report.append("Advert Views: " + str(advert.advert_views))
        answers_to_report.append(
            "Male Consumer: " + str(advert.advert_gender_male))
        answers_to_report.append(
            "Female Consumers: " + str(advert.advert_gender_female))
        answers_to_report.append(
            "Other Consumers: " + str(advert.advert_gender_other))
        # advert_slug=request.data
        # Can use slug if you want but just pass it in from the request.data
        survey = Survey.objects.get(advert=advert)
        questions = Question.objects.filter(survey=survey)
        for question in questions:
            answer_set = Answer.objects.filter(question=question)
            answer_data = list(answer_set.values())
            answers_to_report.append("QUESTION : " + question.question)
            for answer in answer_data:
                consumer = Consumer.objects.get(id=answer['consumer_id'])
                answers_to_report.append("Username: " + str(consumer.user.username) +
                                         "\n Age: " + str(consumer.age) +
                                         "\n Gender: " + str(consumer.gender) +
                                         "\n Answer : " + answer.get('answer'))
        self.create_report(answers_to_report, survey.advert.advert_title)
        self.create_zip("reports/" + survey.advert.advert_title +
                        ".pdf", survey.advert.advert_title)
        file = open('zip_files/' + survey.advert.advert_title + ".zip", 'rb')
        response = HttpResponse(
            file, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="%s"' % survey.advert.advert_title + '.zip'
        return response

# gonna work on the request to display this data will add it also to the pdf


"""total_males = (advert.advert_gender_male / total) * 100
        total_females = (advert.advert_gender_female / total) * 100
        total_others = (advert.advert_gender_other / total) * 100
        stats['Male'] = total_males
        stats['Female'] = total_females
        stats['Other'] = total_others
        print("MALE: ", total_males, "%")
        print("FEMALE: ", total_females, "%")
        print("OTHER", total_others, "%")"""


class RetrieveAnalyticsAPI(generics.GenericAPIView):

    @staticmethod
    def retrieve_stats(advert):
        stats = dict()
        age = list()
        gender_list = dict()
        gender_list.setdefault("Male", 0)
        gender_list.setdefault("Female", 0)
        gender_list.setdefault("Other", 0)
        survey_response_list = list(
            SurveyResponse.objects.filter(advert=advert))
        for response in survey_response_list:
            age.append(response.user.age)
            if response.user.gender == "Male":
                cur = gender_list.get("Male")
                cur += 1
                gender_list["Male"] = cur
            elif response.user.gender == "Female":
                cur = gender_list.get("Female")
                cur += 1
                gender_list["Female"] = cur
            else:
                cur = gender_list.get("Other")
                cur += 1
                gender_list["Other"] = cur
        total = sum(gender_list.values())
        try:
            total_males = (gender_list.get("Male") / total) * 100
            total_females = (gender_list.get("Female") / total) * 100
            total_other = (gender_list.get("Other") / total) * 100
            avg_age = (sum(age) / len(age))
        except ZeroDivisionError:
            total_males = "N/A"
            total_females = "N/A"
            total_other = "N/A"
            avg_age = "N/A"
        stats["Male %"] = total_males
        stats["Female %"] = total_females
        stats["Other %"] = total_other
        stats["Avg Age"] = avg_age
        print(stats)
        return stats

    def get(self, request):
        slug = request.query_params.get('advert_slug')
        print(slug)
        advert = Advert.objects.get(advert_slug=slug)
        stats = self.retrieve_stats(advert)
        for key, value in stats.items():
            if value == 0:
                stats[key] = "N/A"
        return Response({
            "Advert": stats
        })


class getBalanceAPI(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        consumer = Consumer.objects.get(user=request.user)
        balance = consumer.balance
        return Response({
            "balance": balance
        })


"""class ConsumerAdvertViewAPI(generics.GenericAPIView):
    permission_classes = [
       # permissions.IsAuthenticated
    ]

    @staticmethod
    def create_zip(file_list, name):
        zip_file = ZipFile("zip_files/" + name + ".zip", "w")
        for filename in file_list:
            zip_file.write(filename)
        zip_file.close()

    def get(self, request):

        consumer_adverts = []
        files_to_be_zipped = []
        user = User.objects.get(username="ken") # Comment this line out
        consumer = Consumer.objects.get(user=user) # Change this to request.user
        interests = list(consumer.interests)

        for temp in interests:
            advert_set = Advert.objects.filter(advert_category=temp)
            data = list(advert_set.values())
            for cur in data:
                data_dict = {}
                data_dict['advert_title'] = cur.get('advert_title')
                data_dict['advert_category'] = cur.get('advert_category')
                data_dict['advert_image'] = cur.get('advert_image')
                data_dict['advert_slug'] = cur.get('advert_slug')
                consumer_adverts.append(data_dict)

                raw_title = cur.get('advert_image')
                title = str(raw_title).replace("thumbnails/", "").replace(".png", "").replace(".jpg", "")
                thumbnail_title = str(raw_title).replace("thumbnails/", "")

                with open('json_files/' + title + '.json', 'w') as f:
                    json.dump(data_dict, f)
                files_to_be_zipped.append('json_files/' + title + '.json')
                files_to_be_zipped.append('thumbnails/' + thumbnail_title)

        self.create_zip(files_to_be_zipped, consumer.user.username)
        file = open('zip_files/'+consumer.user.username+".zip", 'rb')
        response = FileResponse(file)

        return response"""


class AdvertBelongAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        business = Business.objects.get(user=request.user)
        advert_set = Advert.objects.filter(advert_uploader=business)
        data = list(advert_set.values())
        business_adverts = []

        for i in data:
            data_dict = {}
            business = Business.objects.get(id=i.get('advert_uploader_id'))
            interest = Interests.objects.get(id=i.get('advert_category_id'))
            data_dict['advert_uploader'] = business.user.username
            data_dict['advert_organization'] = business.company_name
            data_dict['advert_title'] = i.get('advert_title')
            data_dict['advert_category'] = InterestsSerializer(interest).data
            business_adverts.append(data_dict)

        return Response({'some': business_adverts})


class AdvertListAPI(generics.ListAPIView):
    queryset = Advert.objects.all()
    permission_classes = [
        # permissions.IsAuthenticated
    ]
    serializer_class = AdvertSerializer
