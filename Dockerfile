FROM registry.sptek/nginx-paas-portal:1.17.6-alpine-6

ARG INSTALL_PATH=/usr/share/nginx/html
COPY dist ${INSTALL_PATH}

