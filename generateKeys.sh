#!/bin/bash

# 
# How to run
# With argument: ./generateKeys.sh --override=y
# Witout arguments ./generateKeys.sh
# 

[[ -f /etc/passwd ]] && echo "This file exists!"

echo $'\n\nGenerating keys...\n'



if [ "$1" != --override=y ]
then
    read -p "Do you want to overwrite old keys? y/n: " override
    if [ -f ./keys/private.pem ] && [ "$override" != y ]
    then
        echo "Keys files exists! No key generated!"
        exit
    fi
fi

COUNTRY="AT"                # 2 letter country-code
STATE="Austria"            # state or province name
LOCALITY="Vienna"        # Locality Name (e.g. city)
ORGNAME="ahmedhameed.dev" # Organization Name (eg, company)
ORGUNIT=""                  # Organizational Unit Name (eg. section)
EMAIL="contact@ahmedhameed.dev"    # certificate's email address
# optional extra details             
COMPANY="ahmedhameed.dev"    

# create the certificate request
cat <<__EOF__ | openssl genrsa -des3 -out keys/private.pem 2048
$COUNTRY
$STATE
$LOCALITY
$ORGNAME
$ORGUNIT
$site
$EMAIL
$CHALLENGE
$COMPANY
__EOF__


echo $'\nPrivate key generated. You will asked again to enter your private key password\n'

cat <<__EOF__ | openssl rsa -in keys/private.pem -outform PEM -pubout -out keys/public.pem
$CHALLENGE
__EOF__



echo $'\n\nKeys generated sucessfully!\n'