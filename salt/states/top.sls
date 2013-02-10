# Top File
# Described what states to install for the Vagrant instance.

# Vagrant Environment
vagrant:
  '*':
    # Recomended States
    #- poke.bash
    #- poke.packages
    - nginx
    # States for this instance, for exanple: python
    - python
    # Project Speific States in salt/states/ (same level as this top.sls)
    - busapp
    - motd
    # Developer states (mounted to ~/.salt-dev)
    - developer
