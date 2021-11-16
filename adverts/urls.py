from django.urls import path, include
from .api import AdvertViewExperimentAPI,\
    AdvertExperimentImageAPI, AdvertGetVideoAPI, UploadAdvertAPI, AdvertBelongAPI, AdvertListAPI, \
    AdvertDetailAPI, AdvertExperimentAPI, CreateSurveyAPI, CompleteSurveyAPI, GetAdvertReportAPI, \
    ConsumerAdvertAPI, RetrieveAnalyticsAPI, ConsumerAdvertDetailAPI, getBalanceAPI, updateBusinessVideo


urlpatterns = [
    path('api/upload_advert', UploadAdvertAPI.as_view()),
    # path('api/auth/updateBusinessVideo', updateBusinessVideo),
    path('api/adverts', AdvertListAPI.as_view()),
    # path('api/adverts/<slug:advert_slug>', AdvertDetailAPI.as_view()),
    path('api/adverts/details', AdvertDetailAPI.as_view()),
    path('api/image', AdvertExperimentImageAPI.as_view()),
    path('api/video', AdvertGetVideoAPI.as_view()),
    path('api/advert_test', AdvertExperimentAPI.as_view()),
    path('api/businessAdverts', AdvertBelongAPI.as_view()),
    path('api/consumerVideos', ConsumerAdvertAPI.as_view()),
    # path('api/businessViewAdverts', BusinessAdvertViewAPI.as_view()),
    # path('api/consumerViewAdverts', ConsumerAdvertViewAPI.as_view()),
    path('api/createSurvey', CreateSurveyAPI.as_view()),
    path('api/completeSurvey', CompleteSurveyAPI.as_view()),
    path('api/businessViewAdverts', AdvertViewExperimentAPI.as_view()),
    path('api/downloadReport', GetAdvertReportAPI.as_view()),
    path('api/retrieveAnalyticsAPI', RetrieveAnalyticsAPI.as_view()),
    path('api/consumerVideoInfo', ConsumerAdvertDetailAPI.as_view()),
    path('api/getBalance', getBalanceAPI.as_view()),

]
