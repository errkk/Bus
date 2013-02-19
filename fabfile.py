import time
from os.path import join
from fabric.api import env, run, local, cd, sudo
from fabric.decorators import hosts
from fabric.utils import puts
from pprint import pprint as pp

env.project = 'busapp'
env.root = '/e/data/www/me/%s' % env.project
env.env = '/e/data/python-virtualenvs/busapp-%s'
env.hosts = ['web2.errkk.co']
env.user = 'ubuntu'


def paths():
    pp( env )

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
    env.branch = branch
    env.rev = local('git log -1 --format=format:%%H %s@{0}' % env.branch,
                    capture=True)
    local('git push -f ssh://%(user)s@%(host)s/%(src_path)s/ %(branch)s' % env)

    with cd(env.src_path):
        run('git reset --hard %(rev)s' % env)


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
