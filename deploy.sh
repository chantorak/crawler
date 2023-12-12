npm run build

cd lib/
npm i --omit=dev
cd ..

sam deploy --template-file template.yaml --s3-bucket "mybucket-1111111122" \
  --stack-name test-stack --capabilities CAPABILITY_IAM --region eu-west-2
