# ClientPulse
A simple, hyper-polished SaaS tool where Dutch freelancers or digital agencies can manage clients, log project hours, and auto-generate invoices with localized payment links.

## Stack
Laravel → Next.js w/Typescript and TailwindCSS

## Features
- Dashboards w/graphs and charts
- Interactive Time Tracker
- Localisation (Dutch and English)

## Technical Features
- Multi-tennancy
- Mollie Sandbox API for mock invoice payments
- Authentication
- An endpoint that agrregates time logs and generates a PDF invoice
- Background job that sends emails to a client when overdue
- A webhook receiver that listens to Mollie to mark an invoice as “Paid” the moment a mock iDEAL transaction completes
- PHP 8.3+ with strict typing and zero “any” types in the Typescript code
- Pest + Vitest testing across the stack
- docker-compose.yml file

## Routes
/login/
/logout/
/dashboard/
/invoices/
/clients/
/projects/

## Models
- User
- Invoice
- Client
- Project