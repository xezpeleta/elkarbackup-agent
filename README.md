
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

### 2. Build an empty Windows VM for testing purposes
```
cd vm
vagrant up
```

## 3. Change network configuration

From Windows, Start -> Run -> `\\vboxsrv\elkarbackup-agent`. Find the file:
```
utils\configure-ip-address.bat
```
Run as administrator... it will change your VM "Adaptor 3" IP address to: *192.168.33.21*

## 4. Download Cygwin installer and files

```bash
cd src/elkarbackup-agent
curl -L -o cygwin-files.zip "https://www.dropbox.com/s/zo2q6ykc3jeoio0/cygwin-files.zip?dl=1"
unzip cygwin-files.zip
```

## 5. Run the agent

First, you need to download atom-shell and let it in the directory: E:\atom-shell (\\vboxsrv\elkarbackup-agent\atom-shell)

Open a CMD console with administrator privileges, and execute this line:

```
\\vboxsrv\elkarbackup-agent\atom-shell\atom.exe \\vboxsrv\elkarbackup-agent\src\elkarbackup-agent
```
