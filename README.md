# Fund Allocation Service

A TypeScript Express app for managing investment fund allocations across different portfolios with support for one-time and monthly deposit plans.

## Features

- **Fund Allocation**: Distribute deposits across multiple portfolios based on predefined allocation plans
- **Deposit Plans**: Support for both one-time and monthly investment strategies
- **Portfolio Management**: Track fund distribution across different investment portfolios
- **Input Validation**: JSON schema validation for API requests
- **Test Coverage**: Comprehensive test suite with coverage reporting

## Allocation Logic

The service implements a sophisticated fund allocation algorithm:

1. **Plan Matching**: Each deposit is matched to a plan type based on amount - if a deposit exactly matches a ONE_TIME plan's total allocation, it's allocated to that plan first
2. **Proportional Distribution**: Funds are distributed proportionally across portfolios within each plan based on their allocation weights
3. **Overflow Handling**: When deposits exceed plan allocations, excess funds flow to the next available plan type
4. **Ledger Tracking**: The system maintains a count of how many times each plan type has been executed

### Example Flow:

- ONE_TIME plan: High Risk (10000) + Retirement (500) = 10500 total
- MONTHLY plan: High Risk (500) + Retirement (1000) = 1500 total
- Deposits: [10500, 1500]
- Result: First deposit (10500) → ONE_TIME plan, Second deposit (1500) → MONTHLY plan

## API Endpoints

### POST /allocate

Allocates funds across portfolios based on deposit plans and amounts.

**Request Body:**

```json
{
  "depositPlans": [
    {
      "type": "ONE_TIME",
      "allocations": [
        { "portfolioName": "High Risk", "amount": 10000 },
        { "portfolioName": "Retirement", "amount": 500 }
      ]
    },
    {
      "type": "MONTHLY",
      "allocations": [
        { "portfolioName": "High Risk", "amount": 500 },
        { "portfolioName": "Retirement", "amount": 1000 }
      ]
    }
  ],
  "deposits": [10500, 1500]
}
```

**Response:**

```json
{
  "fundAllocation": {
    "High Risk": 5500,
    "Retirement": 1500
  },
  "fundLedger": {
    "ONE_TIME": 1,
    "MONTHLY": 1
  }
}
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```
PORT=3000
```

### Development

```bash
npm run dev
```

Runs the server in development mode with hot-reload.

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:coverage
```

## Project Structure

```
src/
├── handlers/          # Request handlers
├── routes/           # API routes
├── services/         # Business logic
├── types/           # TypeScript type definitions
└── utilities/       # Validation schemas
```

## License

ISC
