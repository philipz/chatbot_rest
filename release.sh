#!/bin/bash
az login --service-principal -u $AZURE_LOGIN_USER --password $AZURE_PASSWORD --tenant $AZURE_TENANT
az appservice web config container update -n tradingbot -g tradingbot -c dockware.azurecr.io/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG -r https://dockware.azurecr.io -u dockware -p $AZURE_REG_PASSWORD