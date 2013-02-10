#!/usr/bin/ruby

#
# Vagrant File for Bus App
# Provisioner: Salt
# OS: Ubuntu 12.04 LTS 64Bit
#

Vagrant::Config.run do |config|

    # Base Box - Hosted on S3
    config.vm.box = "ubuntu_precise64_blank"
    config.vm.box_url = "http://poke.vagrant.boxes.s3.amazonaws.com/ubuntu_precise64_blank.box"

    #
    # Directory Shares
    #

    # The Project Mount - This Directory
    config.vm.share_folder("v-root", "/home/vagrant/busapp", ".", :nfs => true)

    # Project Salt Sates
    config.vm.share_folder("salt_file_root", "/srv/salt", "./salt")

    # Poke Salt States
    if File.directory?(File.join(File.expand_path('~'), '.salt-poke'))
        config.vm.share_folder("salt-poke", "/home/vagrant/.salt-poke", File.join(File.expand_path('~'), '.salt-poke'))
    else
        abort("Please install the Poke Salt States.")
    end

    # Local Developer States - Not in version control, this is for the developer to manage, e.g Git / Vim Configs
    # Developers should symlink this locally to ~/.salt-dev
    if File.directory?(File.join(File.expand_path('~'), '.salt-dev'))
        config.vm.share_folder("salt-local", "/home/vagrant/.salt-dev", File.join(File.expand_path('~'), '.salt-dev'))
    else
        $stdout.write "Vagrant: Warning: You do not have any local states\n"
    end

    #
    # Port Forwarding / Assign static IP
    #

    config.vm.forward_port 80, 8080
    config.vm.network :hostonly, "10.10.10.10", :netmask => "255.255.0.0"

    #
    # Enable Symlinking
    #

    config.vm.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]

    #
    # Provisioner: Salt
    #

    config.vm.provision :salt do |salt|
        salt.run_highstate = true                           # Always run the Salt Proviosining System
        salt.minion_config = "salt/config/minion.conf"      # Where the minion config lives
        salt.salt_install_type = "stable"
    end

end
