# config valid for current version and patch releases of Capistrano
lock "~> 3.16.0"

set :application, "Lukoma Medical Store"
set :repo_url, "git@bitbucket.org:kiwala22/lukoma-medical-store.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/html/lukoma_medical_store"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

set :ssh_options, {:forward_agent => true, port: 8181}

set :deploy_via, :copy

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

set :passenger_restart_with_touch, true

set :rvm_type, :system
set :rvm_ruby_version, '2.7.0'

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'node_modules')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

set :assets_prefix, 'packs'

set :copy_files, %w[node_modules]


namespace :deploy do

 after :restart, :clear_cache do
   on roles(:web), in: :groups, limit: 3, wait: 10 do
     # Here we can do anything such as:
     # within release_path do
     #   execute :rake, 'cache:clear'
     # end
   end
 end
end

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
