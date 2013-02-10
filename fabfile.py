import time
from os.path import join
from fabric.api import env, run, local, cd, sudo
from fabric.decorators import hosts
from fabric.utils import puts
from pprint import pprint as pp

env.project = 'planner'
env.root = '/e/data/www/wsp/%s' % env.project
env.env = '/e/data/python-virtualenvs/planner-%s'
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

    init_path = join('/', 'etc', 'init',
                     'gunicorn_%(project)s_%(target)s.conf' % env)

    conf_path = join(env.src_path, 'app', 'config', env.target,
                     'upstart.conf')

    sudo('cp -f %s %s' % (conf_path, init_path))

    cron_script = join(env.src_path, 'app', 'config', env.target,
                     'cron.sh')

    sudo ('chmod +x %s' % cron_script)


def link_nginx():
    conf_path = join(env.src_path, 'app', 'config', env.target,
                     'nginx.conf')
    nginx_available = join('/','etc','nginx','sites-available', 
                        '%(project)s_%(target)s.conf' % env)

    nginx_enabled = join('/','etc','nginx','sites-enabled', 
                        '%(project)s_%(target)s.conf' % env)

    sudo('ln -s %s %s && ln -s %s %s' % (conf_path, nginx_available, 
            nginx_available, nginx_enabled))

def install():
    
    with cd(env.src_path):
        run('%(env)s/bin/python setup.py develop' % env)
        run('rm -rf %(project)s.egg-info' % env)


def deploy(branch):

    git_push(branch)
    install()
    restart()


def restart():
    restart_nginx()
    restart_gunicorn()


def start_gunicorn():
    sudo('sudo start gunicorn_%(project)s_%(target)s ' % env)


def stop_gunicorn():
    sudo('sudo stop gunicorn_%(project)s_%(target)s ' % env)


def restart_gunicorn():
    stop_gunicorn()
    start_gunicorn()


def install_requirements():
    run('%s install -q -r %s' % (join(env.env, 'bin', 'pip'),
                                 join(env.src_path, 'requirements.txt')))


def restart_nginx():
    sudo('/etc/init.d/nginx configtest && /etc/init.d/nginx restart')


def reload_nginx():
    sudo('/etc/init.d/nginx configtest && /etc/init.d/nginx reload')


def django_admin(arguments):
    settings = 'app.config.%(target)s.settings' % env
    cmd = '%(env)s/bin/django-admin.py' % env
    run('%s %s --settings=%s' % (cmd, arguments, settings))


def collectstatic():
    django_admin('collectstatic')


def migrate():
    django_admin('migrate')
