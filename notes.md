# SAM DEPLOY with Param overrides

```
sam deploy \
  --parameter-overrides Stage=dev \
  --stack-name seedbomb-signup-dev \
  --capabilities CAPABILITY_IAM
```

# Local testing with events

VALID SIGNUP
sam local invoke HandleNewCustomerSignup \
 --event events/valid-signup.json \
 --env-vars env/dev-env.json

INVALID JSON
sam local invoke HandleNewCustomerSignup \
 --event events/invalid-json.json \
 --env-vars env/dev-env.json

INVALID JSON
sam local invoke HandleNewCustomerSignup --event events/invalid-json.json

MISSING FIELD
sam local invoke HandleNewCustomerSignup --event events/missing-field.json


CURL TESTING W/ DEV
```
curl -X POST https://p77uhimcs3.execute-api.us-east-2.amazonaws.com/dev/signup \
  -H "Content-Type: application/json" \
  -d '{
    "gym_name": "Iron Temple",
    "contact_email": "owner@irontemple.fit",
    "template_id": "template-1",
    "slug": "iron-temple_02"
  }'
  ```


  RUN UNIT TESTS LOCALLY
  ```
  npm test
  sam 