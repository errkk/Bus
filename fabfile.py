import time
from os.path import join, relpath
from os import walk
from fabric.api import env, run, local, cd, sudo
from fabric.decorators import hosts
from fabric.utils import puts
from fabric.operations import prompt
from pprint import pprint as pp
from time import strftime
from datetime import datetime

env.project = 'busapp'
env.root = '/e/data/www/me/%s' % env.project
env.env = '/e/data/python-virtualenvs/busapp-%s'
env.hosts = ['web2.errkk.co']
env.user = 'ubuntu'
BUILD_DIR = 'app/static/'

cache_exempt = [
    'http://www.google-analytics.com/ga.js',
    'http://maps.google.com/maps/api/',
    'http://maps.gstatic.com/',
    'http://maps.googleapis.com/',
    'http://csi.gstatic.com/'
]

def paths():
    pp( env )

def manifest(branch):
    env.timestamp = str(int(time.time()))
    env.branch = branch
    manifest = 'app/cache.manifest'
    env.rev = local('git log -1 --format=format:%%H %s@{0}' % env.branch,
                    capture=True)
    with open(manifest, 'w') as fh:
        fh.write('CACHE MANIFEST\n\n')
        fh.write('CACHE:\n\n')
        fh.write('# {0}\n'.format(env.timestamp))
        fh.write('# {0}\n'.format(env.branch))
        fh.write('# {0}\n\n'.format(env.rev))
        for root, dirs, files in walk(BUILD_DIR):
            for filename in files:
                path = join(root, filename)
                if filename[0] != '.':
                    if path != manifest:
                        rel_path = relpath(path, BUILD_DIR)
                        fh.write('/static/{0}\n'.format(rel_path))
        fh.write('\n\nNETWORK:\n')
        fh.write('/api/\n')
        fh.write('http://*\n')
        fh.write('https://*\n')
        for url in cache_exempt:
            fh.write('{0}\n'.format(url))
    local("cat %s" % manifest)


def version():
    with cd(env.src_path):
        with open('version_number.txt', 'r+') as fh:
            prev = fh.read()
            print 'Previous version number: {0}'.format(prev)
        with open('version_number.txt', 'w') as fh:
            new_version = prompt('New version number?')
            fh.write(new_version)
        cmd = """sed -i 's/\<p class\=\"foot-label version\"\>(.*)\<\/p\>/\<p class\=\"foot-label version\"\>{0}\<\/p\>/g' app/views/index.html""".format(new_version)
        print cmd
        run('echo "{0}" > app/static/version_number.txt'.format(new_version))


def stage():
    env.target = 'stage'
    env.src_path = join(env.root, '%(project)s_%(target)s' % env, 'src')
    env.env = env.env % env.target
    env.t = str(int(time.time()))


def live():
    env.target = 'live'
    env.src_path = join(env.root, '%(project)s_%(target)s' % env, 'src')
    env.env = env.env % env.target
    env.t = str(int(time.time()))


def git_push(branch):
    env.timestamp = str(int(time.time()))
    nice_time = datetime.now().strftime('%a, %d %b %Y %H:%M:%S')
    env.branch = branch
    env.rev = local('git log -1 --format=format:%%H %s@{0}' % env.branch,
                    capture=True)
    local('git push -f ssh://%(user)s@%(host)s/%(src_path)s/ %(branch)s' % env)

    with cd(env.src_path):
        run('git reset --hard %(rev)s' % env)
        run('echo "{0}\n{1}" > app/version.txt'.format(env.rev, nice_time))

    version()



def link_nginx():
    conf_path = join(env.src_path, 'config', env.target,
                     'nginx.conf')
    nginx_available = join('/','etc','nginx','sites-available', 
                        '%(project)s_%(target)s.conf' % env)

    nginx_enabled = join('/','etc','nginx','sites-enabled', 
                        '%(project)s_%(target)s.conf' % env)

    sudo('ln -s %s %s && ln -s %s %s' % (conf_path, nginx_available, 
            nginx_available, nginx_enabled))


def deploy(branch):
    git_push(branch)


def restart():
    restart_nginx()


def restart_nginx():
    sudo('/etc/init.d/nginx configtest && /etc/init.d/nginx restart')


def reload_nginx():
    sudo('/etc/init.d/nginx configtest && /etc/init.d/nginx reload')
