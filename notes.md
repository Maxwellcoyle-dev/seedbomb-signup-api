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
