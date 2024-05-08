#!/bin/bash
set -euxo pipefail

# This script will iterate over the micro-services and generate front-end
# network calls (in typescript) for each specification. The output will be
# placed inside ./src/networking/codegen

outputPath="./src/networking/codegen"

rm -rf $outputPath

specs=(
    ../microservices/boauth/src/main/resources/boauth.yml
    ../microservices/boworkflow/src/main/resources/boworkflow.yml
    ../microservices/configuration/src/main/resources/configuration.yml
    ../microservices/contenthub/src/main/resources/contenthub.yml
)

for spec in "${specs[@]}"; do
    openapi-generator-cli generate -i "${spec}" -g typescript-axios -o $outputPath --additional-properties=withSeparateModelsAndApi=true,apiPackage=api,modelPackage=model
done

indexFilePath="./src/networking/index.ts"
>$indexFilePath

# Iterate over apis and add entries in register
apiDirectory="./src/networking/codegen/api/*"

for dir in $apiDirectory; do
    lastPathComponent=$(basename $dir)
    fileName="${lastPathComponent%.*}"
    apiName=$(echo $fileName | perl -nE 'say ucfirst join "", map {ucfirst lc} split /[^[:alnum:]]+/')
    apiFileName="${apiName}.ts"
    exportStatement="export {${apiName}} from './codegen/api/${fileName}';"
    echo $exportStatement>>$indexFilePath
done

# Iterate over models and add entries in register
modelDirectory="./src/networking/codegen/model/*"
for dir in $modelDirectory; do
    lastPathComponent=$(basename $dir)
    echo $lastPathComponent
    if [ "$lastPathComponent" != "index.ts" ]; then
        fileName="${lastPathComponent%.*}"
        apiName=$(echo $fileName | perl -nE 'say ucfirst join "", map {ucfirst lc} split /[^[:alnum:]]+/')
        apiFileName="${apiName}.ts"
        exportStatement="export * from './codegen/model/${fileName}';"
        echo "$exportStatement">>$indexFilePath
    fi  
done

# Generate package
packagePath="./src/networking/package.json"
echo "{\"name\": \"@bo/networking\",\"version\": \"0.0.1\"}">$packagePath
    
