
# elkarbackup-agent

We are trying to build a graphical installer to make Elkarbackup configuration easy on Windows environments

## Development

Requirements:
  - VirtualBox
  - Vagrant

### 1. Download source
You can download zip file from Github, or download it with 'git clone':
```
git clone https://github.com/xezpeleta/elkarbackup-agent.git
```

### 2. Download dependencies
Bootstrap will download and unzip Atom-Shell and Cygwin files
```
./bootstrap.sh
```

### 3. Build an empty Windows VM for testing purposes
```
cd vm
vagrant up
```

## 4. Change network configuration

From Windows, Start -> Run -> `\\vboxsrv\elkarbackup-agent`. Find the file:
```
utils\configure-ip-address.bat
```
Run as administrator... it will change your VM "Adaptor 3" IP address to: *192.168.33.21*


## 5. Run the installer

Start -> Run -> \\\\vboxsrv -> elkarbackup-agent

Right click on **eb-installer.bat** and select "Run as administrator"
