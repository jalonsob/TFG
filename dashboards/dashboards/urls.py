from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dashboards.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'static/(?P<path>.*)$','django.views.static.serve',{'document_root':'static'}),
    url(r'^$','dinamic.views.home'),
    url(r'saveall/$','dinamic.views.saveall'),
    url(r'templates/(?P<path>.*)$','django.views.static.serve',{'document_root':'templates'}),

)
