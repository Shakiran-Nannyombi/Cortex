# Testing Plan: Cortex UI

## Overview

This document outlines the comprehensive testing strategy for the Cortex UI application, covering unit tests, integration tests, and API tests to ensure system reliability and proper communication between components and backend services.

## Testing Stack

- **Test Framework**: Vitest
- **Component Testing**: React Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **E2E Testing**: Playwright (optional, for critical flows)
- **Coverage Target**: >80% for critical paths

## 1. Unit Testing

### 1.1 Component Unit Tests

#### Base Components (`src/components/`)

**Button Component** (`Button.test.tsx`)
- Renders with correct variant (primary, secondary, danger, ghost)
- Renders with correct size (sm, md, lg)
- Handles click events
- Disables when `disabled` prop is true
- Shows loading state with spinner
- Renders with icon when provided
- Applies custom className

**Input Component** (`Input.test.tsx`)
- Renders with correct type (text, email, password, number)
- Updates value on change
- Displays error message when provided
- Shows required indicator
- Disables when `disabled` prop is true
- Renders label when provided
- Handles placeholder text

**Select Component** (`Select.test.tsx`)
- Renders all options
- Handles option selection
- Displays selected value
- Disables when `disabled` prop is true
- Shows error state

**Modal Component** (`Modal.test.tsx`)
- Renders when `isOpen` is true
- Hides when `isOpen` is false
- Calls `onClose` when close button clicked
- Renders title and children
- Renders footer when provided
- Handles different sizes (sm, md, lg, xl)

**Card Component** (`Card.test.tsx`)
- Renders children content
- Displays title when provided
- Displays footer when provided
- Applies custom className

**Badge Component** (`Badge.test.tsx`)
- Renders with correct variant (default, success, warning, error, info)
- Displays custom color when provided
- Renders children text

**Skeleton Component** (`Skeleton.test.tsx`)
- Renders with correct width
- Renders with correct height
- Applies custom className

**Spinner Component** (`Spinner.test.tsx`)
- Renders loading indicator
- Applies correct size classes

#### Context Hooks (`src/hooks/`)

**useAuth Hook** (`useAuth.test.tsx`)
- Returns auth context value
- Throws error when used outside AuthProvider
- Provides user, isLoading, login, register, logout functions
- Login function updates user state
- Register function updates user state
- Logout function clears user state

**useTheme Hook** (`useTheme.test.tsx`)
- Returns theme context value
- Throws error when used outside ThemeProvider
- Provides theme, toggleTheme, setTheme functions
- toggleTheme switches between light and dark
- setTheme updates theme to specified value

#### Utility Functions

**API Client** (`api/client.test.ts`)
- Creates axios instance with correct base URL
- Adds authorization header with token
- Handles 401 responses with token refresh
- Retries failed requests
- Handles network errors

### 1.2 Hook Unit Tests

**useQueryClient Hook** (`hooks/useQueryClient.test.ts`)
- Returns configured QueryClient
- Has correct stale time (5 minutes)
- Has correct cache time (10 minutes)
- Retries failed queries once

## 2. Integration Tests

### 2.1 Authentication Flow

**Login Integration** (`pages/LoginPage.test.tsx`)
- User enters email and password
- Form validates input
- API call is made to `/api/auth/login`
- Token is stored in localStorage
- User is redirected to dashboard
- Error message displays on failed login
- Loading state shows during request

**Registration Integration** (`pages/RegisterPage.test.tsx`)
- User enters registration details
- Form validates password strength
- API call is made to `/api/auth/register`
- User is automatically logged in
- Tokens are stored in localStorage
- User is redirected to dashboard
- Error message displays on failed registration

**Token Refresh** (`context/AuthContextProvider.test.tsx`)
- Expired token triggers refresh
- New token is obtained from `/api/auth/refresh`
- Original request is retried with new token
- User remains logged in
- Failed refresh redirects to login

### 2.2 Document Management Flow

**Document Upload** (`components/FileUploader.test.tsx`)
- User drags file to drop zone
- File type is validated
- Upload progress is displayed
- Success notification shows on completion
- Document list is refreshed
- Error notification shows on failure
- Multiple files can be uploaded simultaneously

**Document List** (`pages/DocumentsPage.test.tsx`)
- Documents are fetched from API
- Grid and list views toggle correctly
- Filters work (status, workspace, folder)
- Sorting works (date, title, size)
- Pagination works
- Status badges display correctly
- Action buttons (view, edit, delete) work

**Document Detail** (`pages/DocumentDetail.test.tsx`)
- Document is fetched from API
- Title can be edited
- Metadata displays correctly
- Extracted text displays
- Tags can be added/removed
- Workspace/folder can be changed
- Download button works
- Delete button shows confirmation
- Reprocess button works for failed documents

### 2.3 Search Integration

**Search Flow** (`pages/SearchPage.test.tsx`)
- Search input debounces (300ms)
- API call is made to `/api/search`
- Results display in list/grid format
- Search terms are highlighted
- Result count and search time display
- Filters work (workspace, status)
- Pagination works
- URL parameters are preserved
- "No results" message displays when empty

### 2.4 Workspace Management

**Workspace CRUD** (`pages/WorkspacesPage.test.tsx`)
- Workspaces are fetched from API
- Create workspace modal opens
- New workspace is created via API
- Workspace list updates
- Edit workspace works
- Delete workspace shows confirmation
- Workspace detail page loads folder tree

**Folder Management** (`pages/WorkspaceDetail.test.tsx`)
- Folder tree displays hierarchy
- Folders expand/collapse
- Create folder modal opens
- New folder is created via API
- Folder can be renamed
- Folder can be deleted with confirmation
- Document count displays per folder

### 2.5 Tag Management

**Tag CRUD** (`pages/TagsPage.test.tsx`)
- Tags are fetched from API
- Create tag modal opens
- Color picker works
- New tag is created via API
- Tag list updates
- Edit tag works
- Delete tag shows confirmation
- Duplicate tag names are rejected

### 2.6 API Key Management

**API Key CRUD** (`pages/APIKeysPage.test.tsx`)
- API keys are fetched from API
- Create API key modal opens
- New key is generated via API
- Full key displays in success modal (one-time)
- Copy to clipboard works
- Key preview shows in list
- Revoke action works with confirmation
- Revoked keys display with distinct style

### 2.7 Settings Management

**Profile Update** (`pages/SettingsPage.test.tsx`)
- Current profile data loads
- Full name can be updated
- Username can be updated
- Email is read-only
- Success notification shows on update
- Error notification shows on failure

**Password Change** (`pages/SettingsPage.test.tsx`)
- Password change form validates
- Current password is required
- New password meets requirements
- Confirmation password matches
- API call is made to change password
- Success notification shows
- Error notification shows on failure

## 3. API Integration Tests

### 3.1 Authentication Endpoints

**POST /api/auth/login**
- Valid credentials return user and tokens
- Invalid credentials return 401 error
- Missing fields return 400 error
- Response includes access_token, refresh_token, user

**POST /api/auth/register**
- Valid data creates user and returns tokens
- Duplicate email returns 409 error
- Invalid password returns 400 error
- Response includes access_token, refresh_token, user

**POST /api/auth/refresh**
- Valid refresh token returns new access token
- Invalid refresh token returns 401 error
- Response includes new access_token

**GET /api/auth/me**
- Returns current user data
- Requires valid access token
- Returns 401 if token invalid

**POST /api/auth/logout**
- Clears user session
- Invalidates tokens

### 3.2 Document Endpoints

**GET /api/documents**
- Returns paginated list of documents
- Supports filtering (status, workspace, folder)
- Supports sorting (date, title, size)
- Supports pagination (page, per_page)
- Returns correct response format

**POST /api/documents**
- Accepts multipart form data with file
- Validates file type
- Creates document record
- Returns created document with id
- Stores file in storage

**GET /api/documents/:id**
- Returns document details
- Includes extracted text
- Includes tags
- Includes metadata

**PATCH /api/documents/:id**
- Updates document title
- Updates workspace/folder assignment
- Updates tags
- Returns updated document

**DELETE /api/documents/:id**
- Deletes document
- Removes file from storage
- Returns 204 status

**POST /api/documents/:id/reprocess**
- Reprocesses failed document
- Updates status to processing
- Returns updated document

### 3.3 Search Endpoint

**GET /api/search**
- Accepts query parameter
- Supports filtering (workspace, status)
- Supports pagination
- Returns results with highlights
- Returns result count and search time

### 3.4 Workspace Endpoints

**GET /api/workspaces**
- Returns list of user workspaces
- Includes document and folder counts

**POST /api/workspaces**
- Creates new workspace
- Validates name is not empty
- Returns created workspace

**PATCH /api/workspaces/:id**
- Updates workspace name/description
- Returns updated workspace

**DELETE /api/workspaces/:id**
- Deletes workspace
- Returns 204 status

**GET /api/workspaces/:id/folders**
- Returns folder tree for workspace
- Includes document counts

### 3.5 Folder Endpoints

**POST /api/folders**
- Creates folder in workspace
- Validates name is not empty
- Supports parent folder assignment
- Returns created folder

**PATCH /api/folders/:id**
- Updates folder name
- Returns updated folder

**DELETE /api/folders/:id**
- Deletes folder
- Returns 204 status

### 3.6 Tag Endpoints

**GET /api/tags**
- Returns list of user tags
- Includes document count per tag

**POST /api/tags**
- Creates new tag
- Validates name is not empty
- Validates color format
- Rejects duplicate names
- Returns created tag

**PATCH /api/tags/:id**
- Updates tag name/color
- Returns updated tag

**DELETE /api/tags/:id**
- Deletes tag
- Returns 204 status

### 3.7 API Key Endpoints

**GET /api/api-keys**
- Returns list of user API keys
- Masks key values (show only last 4 chars)

**POST /api/api-keys**
- Creates new API key
- Returns full key value (one-time)
- Returns key metadata

**POST /api/api-keys/:id/revoke**
- Revokes API key
- Returns updated key with revoked status

### 3.8 Dashboard Endpoint

**GET /api/dashboard/stats**
- Returns dashboard statistics
- Includes document count
- Includes workspace count
- Includes tag count
- Includes storage used
- Includes status breakdown
- Includes file type breakdown
- Includes recent documents

## 4. Error Handling Tests

### 4.1 API Error Scenarios

**Network Errors**
- Timeout errors show retry option
- Connection errors show offline message
- Failed retries show error message

**Authentication Errors**
- 401 errors redirect to login
- 403 errors show access denied page
- Token refresh failures redirect to login

**Validation Errors**
- 400 errors display field-level errors
- Error messages are user-friendly
- Form fields highlight errors

**Server Errors**
- 500 errors show server error page
- 503 errors show service unavailable message
- Errors are logged for debugging

### 4.2 Component Error Boundaries

**Error Boundary**
- Catches React errors
- Displays fallback UI
- Shows reload button
- Logs errors to console

## 5. Performance Tests

### 5.1 Load Time Tests

**Initial Page Load**
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

**Route Transitions**
- Route changes complete < 500ms
- Lazy loaded components load < 1s

### 5.2 API Response Times

**Document List**
- Response time < 500ms
- Pagination works with large datasets

**Search**
- Debounced search responds < 300ms
- Results display < 500ms

**Dashboard**
- Stats load < 1s
- All data loads < 2s

## 6. Test Execution

### 6.1 Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "authentication"
```

### 6.2 Coverage Requirements

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### 6.3 CI/CD Integration

- Tests run on every pull request
- Coverage reports generated
- Failed tests block merge
- Coverage reports visible in PR

## 7. Mock Data

### 7.1 Mock API Responses

All API responses are mocked using MSW (Mock Service Worker) with realistic data:

- User objects with all required fields
- Document objects with various statuses
- Workspace and folder hierarchies
- Tag objects with colors
- API key objects with masked values
- Error responses with proper status codes

### 7.2 Test Fixtures

Reusable test data in `src/__tests__/fixtures/`:
- `users.ts` - Mock user data
- `documents.ts` - Mock document data
- `workspaces.ts` - Mock workspace data
- `tags.ts` - Mock tag data
- `apiKeys.ts` - Mock API key data

## 8. Test Organization

```
cortex-ui/src/
├── __tests__/
│   ├── fixtures/
│   │   ├── users.ts
│   │   ├── documents.ts
│   │   ├── workspaces.ts
│   │   ├── tags.ts
│   │   └── apiKeys.ts
│   ├── mocks/
│   │   ├── handlers.ts (MSW handlers)
│   │   └── server.ts (MSW server setup)
│   ├── setup.ts (Test environment setup)
│   └── utils.ts (Test utilities)
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── pages/
│   ├── LoginPage.tsx
│   └── LoginPage.test.tsx
└── ...
```

## 9. Continuous Integration

### 9.1 GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## 10. Testing Best Practices

1. **Test Behavior, Not Implementation** - Focus on what users see and do
2. **Use Descriptive Test Names** - Test names should explain what is being tested
3. **Keep Tests Isolated** - Each test should be independent
4. **Mock External Dependencies** - Mock API calls, not internal functions
5. **Use Fixtures for Consistency** - Reuse mock data across tests
6. **Test Error Cases** - Don't just test the happy path
7. **Avoid Testing Implementation Details** - Focus on public APIs
8. **Keep Tests Fast** - Aim for tests to complete in < 100ms
9. **Use Meaningful Assertions** - Make it clear what failed
10. **Maintain Test Coverage** - Keep coverage above 80%

## 11. Debugging Tests

### 11.1 Debug Mode

```bash
# Run tests with debug output
npm run test -- --reporter=verbose

# Run single test with debugging
npm run test -- Button.test.tsx --reporter=verbose
```

### 11.2 Browser Debugging

```bash
# Run tests with browser UI
npm run test -- --ui
```

## 12. Maintenance

- Review and update tests when features change
- Keep mock data in sync with API changes
- Monitor test execution time
- Update coverage targets as needed
- Archive old test results for trend analysis
