# Message of the Day

/etc/motd.tail:
  file.managed:
    - user: root
    - group: root
    - mode: 444
    - template: jinja
    - source: salt://motd/files/motd