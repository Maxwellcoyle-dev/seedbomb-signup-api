# SeedBomb Signup API

A serverless microservice for handling gym customer signups in the SeedBomb CRM platform. Built with AWS SAM, Lambda, DynamoDB, and EventBridge, this service validates incoming data, ensures unique slugs, persists gym customer records, and emits provisioning events for downstream systems.

---

## Features

- **Validation & Normalization**: Ensures required fields are present and properly formatted.
- **Slug Uniqueness Check**: Confirms that user-provided slugs are unique before persisting.
- **Idempotent Customer Save**: Saves customer profiles using a deterministic customer ID (email + slug).
- **Event Emission**: Emits a `CustomerSignupCompleted` event to EventBridge after a successful signup.
- **Structured Logging & Error Handling**: Includes standardized error codes and logs for debugging.
- **Unit Tested**: Full suite of tests using [Vitest](https://vitest.dev/).
- **CI/CD Pipeline**: GitHub Actions pipelines for testing and deployment based on git branches.

---

## Project Structure

```bash
seedbomb-signup-api/
├── src/
│   ├── functions/
│   │   └── handleSignup.mjs
│   ├── modules/
│   │   ├── checkSlugAvailability.mjs
│   │   ├── emitEvent.mjs
│   │   ├── saveCustomer.mjs
│   │   └── validateInput.mjs
│   └── utils/
│       ├── errors.mjs
│       ├── generateCustomerId.mjs
│       ├── response.mjs
│       └── slugify.mjs
├── test/
├── template.yaml
├── samconfig.toml
├── events/
├── env/
├── package.json
└── README.md
```

---

## Setup & Installation

### Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Node.js v18+
- A configured AWS account

### Install Dependencies

```bash
npm ci
```

---

## Local Development

### Invoke Locally

```bash
sam local invoke HandleNewCustomerSignup \
  --event events/valid-signup.json \
  --env-vars env/dev-env.json
```

### Start Local API

```bash
sam local start-api --env-vars env/dev-env.json
```

Then POST to [http://localhost:3000/signup](http://localhost:3000/signup)

---

## Testing

### Run Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### Testing Coverage

> \[Coming Soon] Add coverage flags and badge

---

## Deployment

### Deploy with SAM

```bash
sam deploy --config-env dev --no-fail-on-empty-changeset
```

### GitHub CI/CD

- `dev` branch → deploys to `seedbomb-signup-dev`
- `staging` branch → deploys to `seedbomb-signup-staging`
- `main` branch → deploys to `seedbomb-signup-prod`

Make sure your `samconfig.toml` contains sections for each environment.

---

## API

### Endpoint

```
POST /signup
```

### Payload Example

```json
{
  "gym_name": "Iron Temple",
  "contact_email": "owner@irontemple.fit",
  "template_id": "template-3",
  "slug": "iron-temple"
}
```

### Possible Responses

- **200**: Signup successful
- **409**: Customer or slug already exists
- **422**: Validation failed
- **500**: Server error

---

## Environment Variables

- `CUSTOMERS_TABLE_NAME`: DynamoDB table for storing gym records
- `EVENT_BUS_NAME`: EventBridge bus for emitting provisioning events
- `STAGE`: Deployment stage (dev, staging, prod)

---

## Author

Maxwell Coyle

---

## License

MIT or ISC (TBD)
