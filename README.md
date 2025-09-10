### [LIVE HERE](https://covert-calculator.vercel.app/)

## About the Project

This is a **Cryptocurrency Token Conversion Price Calculator** - a modern web application that allows users to calculate real-time conversion rates between different cryptocurrency tokens. The application provides an intuitive interface for users to:

- **Select Source and Target Tokens**: Choose from a comprehensive list of supported cryptocurrency tokens
- **Real-time Price Conversion**: Get instant conversion rates and amounts based on current market prices

### Key Features

- 🔄 **Real-time Token Conversion**: Calculate conversion amounts between different cryptocurrency tokens
- 📊 **Live Price Data**: Integration with cryptocurrency APIs for up-to-date pricing information
- 🎨 **Modern UI/UX**: Built with Next.js 15, React 19, and Tailwind CSS for a smooth user experience
- ⚡ **Performance Optimized**: Uses React Query for efficient data fetching and caching
- 🔒 **Type Safety**: Full TypeScript implementation with Zod validation
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Cryptocurrency API**: Funkit API integration
- **Build Tool**: Turbopack for fast development and builds

## API Caching Optimizations

This application implements sophisticated caching strategies to optimize performance and reduce API calls:

### ⏱️ **Tiered Caching Strategy**

- **Token Information**: 10-minute cache for static token metadata (symbol, name, chainId)
- **Price Data**: Real-time fetching (0 stale time) for accurate conversion rates
- **Supported Tokens**: Long-term caching for the token list (rarely changes)
- **Error Handling**: Graceful fallbacks for failed token lookups (e.g., "FAIL" token)

## Potential Areas of Improvements

### 🚀 **Future Enhancements**

1. **Dynamic Token List Loading**:

   - Implement API-based token list loading instead of static data
   - Enable real-time updates for new tokens and delisted tokens

2. **Virtualized Token Selection**:

   - Add virtualization for token dropdown when dealing with large token lists (1000+ tokens)
   - Implement search functionality with debounced input for better UX

3. **API Prefetching Strategy**:
   - Implement prefetching for frequently accessed token pairs / token list
   - Add background refresh for popular conversion rates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
