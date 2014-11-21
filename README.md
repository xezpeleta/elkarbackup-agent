
# elkarbackup-agent

We are trying to build a graphical installer to make Elkarbackup configuration easy on Windows environments

## Development

Requirements:
  - VirtualBox

### 1. Download source
You can download zip file from Github, or download it with 'git clone':
```
git clone https://github.com/xezpeleta/elkarbackup-agent.git
```

### 2. Download Windows VM
Let's download and build Windows7 or Windows8 VM for testing purposes
```
./utils/download-Win7-vm.sh
```
It will create an OVA file ('vm' directory). Now, you can open it with *VirtualBox*.

## 3. Run the VM with VirtualBox

Configuration:
  - Network adapter 2: internal
  - Shared folders: create a shared folder to the project source code "elkarbackup-agent" (auto-mount)

Switch on the VM:
  - Network configuration: 192.168.33.20 (or 21, 22, 23...). Important: don't configure Gateway!
