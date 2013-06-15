import os
import time
from fabric.api import env, run, sudo, local, cd
from fabric.state import output
from fabric.utils import puts
from fabric.colors import blue, green, yellow
from fabric.operations import prompt

from velcro.env import bootstrap as _bootstrap
from velcro.decorators import pre_hooks, post_hooks
from velcro.http.nginx import (restart_nginx, reload_nginx, stop_nginx,
                               start_nginx)
from velcro.service.upstart import install, start, stop, restart, restart_all
from velcro.scm.git import deploy as _deploy
from velcro.target import live, stage
from velcro.py.django import syncdb, migrate
from velcro.conf import settings


# Silence Output
output['running'] = False

# Project Details
env.client = 'me'
env.project = 'busapp'

# Paths & Directories
env.root_path = '/e/data/www/'
env.directories = {
    'media': None, 'static': None, 'logs': None, 'src': None,
}

# Users
env.user = 'root'
env.sudo_user = 'root'

# Version Control
env.scm = 'git'

# Hosts to deploy too
env.hosts = [
    'web3.errkk.co',
]

# HTTP Server
env.http_server_conf_path = '/etc/nginx/'
env.nginx_conf = 'nginx.conf'

# Python Settings
env.py_venv_base = '/e/data/python-virtualenvs'
env.py_venv_name = lambda: '{project}_{target}'.format(
    project=settings.PROJECT(),
    target=settings.TARGET())

# Django Settings
env.django_settings_module = '{project}.config.{target}.settings'

# Upstart Scripts
env.upstart_scripts = ['gunicorn.conf']

env.config_path_pipeline = [
    'config',
    '{target}',
]
BUILD_DIR = 'app/static/'

cache_exempt = [
    '/api/',
    'http://www.google-analytics.com/ga.js',
    'http://maps.google.com/maps/api/',
    'http://maps.gstatic.com/',
    'http://maps.googleapis.com/',
    'http://csi.gstatic.com/',
    'http://mt0.googleapis.com/',
    'http://mt1.googleapis.com/',
    'http://www.google-analytics.com/',
]


@post_hooks(
    'velcro.http.nginx.symlink')
def bootstrap():
    _bootstrap()


@post_hooks(
    'velcro.scm.git.clean',
    'velcro.http.nginx.symlink',
)
def deploy(branch, **kwargs):
    _deploy(branch)
    manifest(branch)
    #version()


def version():
    """ Writes the new verion number onto the server """
    with cd(settings.SRC_PATH()):
        new_version = prompt('New version number?')
        run('echo "window.version=\'{0}\';" > app/static/js/version.js'
            .format(new_version))


def manifest(branch):
    """ Generates the cache manifest locally """
    env.timestamp = str(int(time.time()))
    env.branch = branch
    manifest = 'app/cache.manifest'
    env.rev = local('git log -1 --format=format:%%H %s@{0}' % env.branch,
                    capture=True)
    with open(manifest, 'w') as fh:
        fh.write('CACHE MANIFEST\n\n')
        fh.write('# {0}\n'.format(env.timestamp))
        fh.write('# {0}\n'.format(env.branch))
        fh.write('# {0}\n\n'.format(env.rev))
        fh.write('CACHE:\n')
        for root, dirs, files in os.walk(BUILD_DIR):
            for filename in files:
                path = os.path.join(root, filename)
                if filename[0] != '.':
                    if path != manifest:
                        rel_path = os.path.relpath(path, BUILD_DIR)
                        fh.write('/static/{0}\n'.format(rel_path))
        fh.write('\n\nNETWORK:\n')
        for url in cache_exempt:
            fh.write('{0}\n'.format(url))
    local("cat %s" % manifest)
