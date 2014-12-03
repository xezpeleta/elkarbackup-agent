#! /bin/bash

# this script must be on project's root directory

ROOTDIR=$(cd $(dirname $0); pwd)
ATOMDIR=$ROOTDIR/atom-shell
SRCDIR=$ROOTDIR/src/elkarbackup-agent

#
# atom-shell
#
mkdir $ATOMDIR
curl -L -o atom-shell.zip "https://github.com/atom/atom-shell/releases/download/v0.19.5/atom-shell-v0.19.5-win32-ia32.zip"
unzip atom-shell*.zip -d $ATOMDIR

#
# cygwin files
#
curl -L -o cygwin-files.zip "https://www.dropbox.com/s/zo2q6ykc3jeoio0/cygwin-files.zip?dl=1"
unzip cygwin-files.zip -d $SRCDIR
