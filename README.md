# Car Rental System

A modern microservices-based platform enabling seamless vehicle rentals for customers, rental companies, and administrators. Features include robust document verification, secure payments, and real-time communication.

## Demo

- [Customer Walkthrough Video](https://drive.google.com/file/d/1BNiyVJvKwleH7KJaQN0RZqbaz1zh4tr_/view?usp=drive_link)
- [Rental Company & Admin Demo](https://drive.google.com/file/d/1q-ngsWY0ROP4EmidmWJJfT8XD5fw5Nth/view?usp=drive_link)
![WhatsApp Image 2025-08-10 at 11 01 34_c4787c6f](https://github.com/user-attachments/assets/20e94008-295e-4df8-b415-aa7b095bae3a)
![WhatsApp Image 2025-08-10 at 11 02 13_bfb91eff](https://github.com/user-attachments/assets/d3d68689-280d-4971-94cb-c8422ea6a0ab)

## Key Features

### Customer
- Register and upload driving license
- Browse and filter available cars
- Secure booking and payments (Stripe)
- Track bookings and invoices
- Submit reviews with photos
- Real-time notifications and support

### Rental Company
- Register and verify business
- Add/manage vehicles with document compliance
- Handle bookings and communicate with customers
- View and respond to reviews
- Manage revenue, commission, and documents

### Admin
- Verify users, companies, and documents
- Moderate reviews and disputes
- Manage support tickets
- Oversee platform, payments, and analytics

## Verification & Compliance

- Driving license verification for customers
- RC book, insurance, and legal documents for companies
- Automated expiry alerts and manual checks
- Booking restricted until verification is complete

## Communication System

- Customer-to-admin query and chat system
- Structured ticket management
- Review responses and moderation

## Payments & Financials

- Stripe integration (credit/debit cards, wallets)
- Secure PCI-compliant transactions
- Instant payment confirmation and refunds
- Auto invoice generation and transaction history

## Tech Stack

### Frontend
- React.js
- Material-UI, Tailwind CSS
- Stripe for payments

### Backend
- Microservices architecture
- PostgreSQL
- Cloud storage for documents and images

## Development Setup

### Frontend
```bash
cd my-react-app
npm install
npm run dev

