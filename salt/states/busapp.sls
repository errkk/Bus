#
# Project Nginx Config Symlinking
#
/etc/nginx/conf.d/{{ pillar['project_name'] }}.conf:
  file.symlink:
    - target: {{ pillar['nginx_conf'] }}
    - require:
      - pkg: nginx

#
# Python Virtual Environment
#
create_{{ pillar['project_name'] }}_venv:
  cmd.run:
    - name: virtualenv --no-site-packages {{ pillar['virtualenv_dir'] }}/{{ pillar['project_name'] }}
    - unless: test -d {{ pillar['virtualenv_dir'] }}/{{ pillar['project_name'] }}
    - cwd: {{ pillar['root_dir'] }}
    - user: {{ pillar['user'] }}
    - require:
      - pip: virtualenvwrapper

ensure_post_activate_exists:
  file.touch:
    - name: {{ pillar['post_activate'] }}
    - user: {{ pillar['user'] }}
    - group: {{ pillar['user'] }}
    - require:
      - cmd: create_{{ pillar['project_name'] }}_venv

post_activate_cd_to_project:
  file.append:
    - name: {{ pillar['post_activate'] }}
    - text:
      - 'cd /home/vagrant/{{ pillar['project_name'] }}'
    - require:
      - file: ensure_post_activate_exists
      - cmd: create_{{ pillar['project_name'] }}_venv

post_activate_export_django_settings:
  file.append:
    - name: {{ pillar['post_activate'] }}
    - text:
      - 'export DJANGO_SETTINGS_MODULE={{ pillar['project_name'] }}.config.dev.settings'
    - require:
      - file: ensure_post_activate_exists
      - cmd: create_{{ pillar['project_name'] }}_venv

#
# Create Database
#
ensure_libmysqlclient_dev_installed:
  pkg:
    - installed
    - name: libmysqlclient-dev

ensure_python_mysqldb_installed:
  pkg:
    - installed
    - name: python-mysqldb
    - require:
      - pkg: mysql-server
      - pkg: mysql-client
      - pkg: libmysqlclient-dev

create_mysql_databses:
  mysql_database:
    - present
    - name: {{ pillar['project_name'] }}
    - require:
      - pkg: ensure_python_mysqldb_installed

#
# Git Flow
#
git-flow:
  pkg.installed

