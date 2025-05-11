# Local testing with events

VALID SIGNUP
sam local invoke HandleNewCustomerSignup --event events/valid-signup.json

INVALID JSON
sam local invoke HandleNewCustomerSignup --event events/invalid-json.json

MISSING FIELD
sam local invoke HandleNewCustomerSignup --event events/missing-field.json
