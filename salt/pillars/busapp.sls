# Projeect Pillars (Variables)
# These are used by salt states to provision the instance to the pillars below.

# Project
user: vagrant
project_client: 'wsp'
project_name: 'planner'

# Paths
root_dir: /home/vagrant
virtualenv_dir: /home/vagrant/.virtualenvs
home_dir: /home/vagrant

# Config
nginx_conf: /home/vagrant/busapp/config/dev/nginx.conf
post_activate: /home/vagrant/.virtualenvs/busapp/bin/postactivate
