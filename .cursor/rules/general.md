# TableDemo Project Rules

## Project Overview
This is a comprehensive data table demo application showcasing high-performance, feature-rich table interactions with high-cardinality healthcare data. The focus is on performance, user experience, and real-world data handling patterns.

## Technology Stack Decisions

### Core Framework
- **Framework**: Next.js 14+ with App Router (full-stack approach)
- **Language**: TypeScript everywhere (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Table Library**: AG-Grid Community Edition
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Validation**: Zod for API validation

### Additional Tools
- **Caching**: Redis for backend + Next.js built-in caching
- **Development**: Local-only development (no CI/CD, no deployment concerns)
- **Data**: Synthetic patient healthcare dataset (high cardinality)

## Architectural Principles

### Performance First
- Only fetch data that's actually needed (server-side pagination/filtering)
- Implement debouncing for all user inputs
- Use virtual scrolling for large datasets
- Multi-layer caching strategy (browser, Next.js, Redis)
- Optimize bundle sizes and lazy load components

### Code Organization
- Use Next.js App Router structure
- Shared TypeScript types between client and server
- API routes in `/api` directory
- Components organized by feature, not by type
- Utility functions in dedicated utils folders

### Data Handling
- Server-side filtering, sorting, and pagination
- No database migrations (rebuild from scratch when needed)
- Proper database indexing for common query patterns
- Input validation on both client and server
- Smart filtering (only show options that return results)

## Code Style Preferences

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper generic typing for reusable components
- No `any` types unless absolutely necessary
- Use Prisma-generated types for database operations

### React/Next.js Patterns
- Prefer Server Components when possible
- Use Client Components only when necessary (interactivity)
- Implement proper error boundaries
- Use Next.js built-in loading and error handling
- Prefer composition over inheritance

### API Design
- RESTful API design with clear endpoints
- Consistent response formats
- Proper HTTP status codes
- Request/response validation with Zod
- Include metadata (pagination, totals, etc.)

### Database Patterns
- Use Prisma for all database operations
- Implement proper indexing strategy
- Use connection pooling
- Optimize queries with proper relations
- Include database performance monitoring

## Feature Implementation Guidelines

### Table Features
- Server-side pagination with configurable page sizes
- Multi-column sorting capabilities
- Advanced filtering with various data types
- Column show/hide and reordering
- Row selection with bulk actions
- Export functionality (CSV, Excel, JSON)

### User Experience
- Loading states for all async operations
- Error states with helpful messages
- Debounced search and filter inputs
- Keyboard navigation support
- Responsive design for mobile
- Accessibility (WCAG 2.1 AA compliance)

### Performance Features
- Virtual scrolling for large datasets
- Lazy loading of data
- Optimistic updates where appropriate
- Proper caching strategies
- Bundle size optimization

## Data Schema Considerations

### Patient Data Structure
- High-cardinality dataset (100k+ records)
- Mixed data types: strings, numbers, booleans, dates, enums
- Complex relationships between entities
- Proper indexing for filtering and sorting
- Timezone-aware date handling

### API Response Format
```typescript
interface ApiResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  filters?: FilterState
  sorting?: SortState
}
```

## Development Practices

### Local Development
- Use Docker for consistent development environment
- Hot reloading for both frontend and API changes
- Comprehensive error handling and logging
- Network scenario testing capabilities
- Performance monitoring and profiling

### Testing Strategy
- Unit tests for utility functions and components
- Integration tests for API endpoints
- E2E tests for critical user workflows
- Performance testing with large datasets
- Network condition testing

### File Naming Conventions
- Use kebab-case for files and directories
- Component files: `PascalCase.tsx`
- API routes: `kebab-case.ts`
- Utils: `camelCase.ts`
- Types: `types.ts` or `index.ts`

## Quality Standards

### Performance Targets
- Initial load: < 2 seconds
- Search response: < 300ms
- Sorting: < 200ms
- Pagination: < 100ms
- Export: < 5 seconds for 10k records

### Code Quality
- ESLint and Prettier configuration
- Pre-commit hooks for code quality
- Consistent error handling patterns
- Comprehensive TypeScript coverage
- Regular performance profiling

## Project-Specific Notes

### This is a DEMO project
- Focus on learning and showcasing best practices
- No authentication/authorization needed
- Local development only (no deployment concerns)
- Can rebuild database from scratch when needed
- Experiment with different approaches freely

### Healthcare Data Context
- Use synthetic patient data
- Demonstrate real-world healthcare data patterns
- High-cardinality data with complex relationships
- Various data types and visualization needs
- Privacy-conscious development practices (even for demo data)

When generating code, prioritize performance, type safety, and user experience. Always consider the full-stack nature of the Next.js application and leverage its built-in optimizations. 