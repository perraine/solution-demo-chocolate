#!/bin/bash
echo Using EVT-CONFIG to set environment variables
# Name of Configuration Store
evt-config add CPG

# base Evrythng URL's
evt-config set CPG.apiUrl https://api-eu.evrythng.com
evt-config set CPG.shortUrl https://eu.tn.gg

# Account Information
evt-config set CPG.operatorKey YOUROPERATORKEY
evt-config set CPG.projectId YOURPROJECTID
evt-config set CPG.trustedAppKey YOURTRUSTEDAPPKEY
evt-config set CPG.appKey YOURAPPAPIKEY
evt-config set CPG.applicationId YOURAPPLICATIONID

# Data Load Settings

evt-config set CPG.defaultUrl https://www.evrythng.com
evt-config set CPG.kidgerAppUrl https://evt-supplychain.netlify.com
evt-config set CPG.region eu



echo Environment variables
echo =========== =========

evt-config get CPG
