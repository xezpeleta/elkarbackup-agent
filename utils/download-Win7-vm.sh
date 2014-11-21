#! /bin/bash

# This script must be on ./utils

PWD=$(pwd)
ROOTDIR=$(cd $(dirname $0)/..; pwd)
VMDIR=$ROOTDIR/vm

if [ "$(uname)" == "Darwin" ]; then
  URL="https://www.modern.ie/vmdownload?platform=mac&virtPlatform=virtualbox&browserOS=IE11-Win7&parts=4&filename=VMBuild_20131127/VirtualBox/IE11_Win7/Mac/IE11.Win7.For.MacVirtualBox.part{1.sfx,2.rar,3.rar,4.rar}"
  SFX="IE11.Win7.For.MacVirtualBox.part1.sfx"
elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  URL="https://az412801.vo.msecnd.net/vhd/VMBuild_20131127/VirtualBox/IE11_Win7/Linux/IE11.Win7.ForLinuxVirtualBox.part{1.sfx,2.rar,3.rar,4.rar}"
  SFX="IE11.Win7.ForLinuxVirtualBox.part1.sfx"
else
  echo "Not supported platform!"
  exit 1
fi

echo "Moving to $VMDIR directory"
cd $VMDIR

# Download files
curl -O -L "$URL"

# Generate OVA
cd $VMDIR
chmod +x $SFX
./$SFX

# Show generated OVA file
ls -laF $VMDIR/*ova

# Where we were?
cd $PWD
