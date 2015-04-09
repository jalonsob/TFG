from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dashboards.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':'static'}),
    url(r'^db/$','dinamic.views.totalList'),
    url(r'^db/\d*$','dinamic.views.actualizeDash'),
    url(r'^templates/(?P<path>.*)$','django.views.static.serve',{'document_root':'templates'}),
    url(r'^\d*$','dinamic.views.home'),
    url(r'^companies/','dinamic.views.allCompanies'),

)
