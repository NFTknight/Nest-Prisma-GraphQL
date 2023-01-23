#!/usr/bin/env bash

service="backend-api"
env=$1

helm upgrade --install --atomic --timeout 5m $service ./infra/ -f ./infra/values-$env.yaml \
          --namespace $env --create-namespace \
          --set-string sha=$(git rev-parse HEAD)