# Next.js Admin Dashboard

A responsive, feature-rich admin dashboard built with **Next.js 15 (App Router)**, **React**, **Tailwind CSS v4**, and **Axios**. This project uses the free [DummyJSON API](https://dummyjson.com) to manage products.

## Features

- **Authentication:** Secure login using Next.js Middleware and Server Actions to protect dashboard routes.
- **Product Management:** Full CRUD operations (Add, Edit, Delete). Because DummyJSON does not save mutations to their servers, this app elegantly intercepts these actions and uses **localStorage** to seamlessly persist your changes across browser sessions.
- **Advanced Data Table:** Desktop table and responsive mobile cards with styled badges, pricing, ratings, and stock indicators.
- **Server-side Pagination:** Custom pagination component integrating seamlessly with DummyJSON's `limit` and `skip` parameters.
- **Search & Filtering:** Debounced search input (500ms) and category filtering, fully synchronized with the URL search parameters to ensure links are shareable.
- **UI/UX:** Modern, clean styling with hover states, loading spinners, and error fallback states.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios (Configured with request/response interceptors)
- **Icons:** Lucide React

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be automatically redirected to the login page.

### Test Credentials

- **Username:** `emilys`
- **Password:** `emilyspass`

## Project Structure

- `src/app/`: Next.js App Router pages (Login, Dashboard layout, Product lists, Details).
- `src/components/`: Reusable UI components (ProductTable, Pagination, SearchFilterBar, Modals).
- `src/api/`: Isolated Axios API wrappers mapping to DummyJSON endpoints.
- `src/lib/`: Axios configuration and the `ProductsContext` for local mock state management.
- `src/types/`: TypeScript interfaces.

## Architectural Notes

- **State Syncing:** Search, filtering, and pagination states are driven entirely by the URL. This ensures the back button works natively and links can be shared directly.
- **Auth Flow:** Cookies are aggressively cleared using Next.js Server Actions on logout, preventing client-side cache desynchronization. Axios automatically intercepts 401 Unauthorized responses to force a logout.
