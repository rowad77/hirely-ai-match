# Technical Specification: Advanced Job Search Filters

## Overview

This document provides detailed technical specifications for implementing advanced job search filters in the Hairly application. This enhancement will extend the current filtering capabilities to include skills, experience levels, and saved searches.

## Current Implementation

The current `JobFilters` component provides basic filtering by:
- Job Type (Full-time, Part-time, Contract, Remote)
- Location (San Francisco, New York, Chicago, Seattle, Remote)
- Salary Range (Under $50k, $50k-$100k, $100k-$150k, $150k+)
- Categories (Engineering, Design, Data, Product, Marketing)

The component uses a simple checkbox-based UI and maintains filter state in a React state object.

## Proposed Enhancements

### 1. Skills Filter with Autocomplete

#### Technical Requirements

- Create a new `SkillsFilter` component that includes:
  - Autocomplete input field for searching skills
  - Dropdown with suggested skills based on input
  - Ability to add multiple skills as tags
  - Option to specify required vs. preferred skills

#### Data Structure

Extend the current `JobFilters` type:

```typescript
export type JobFilters = {
  jobTypes: string[];
  locations: string[];
  salaryRanges: string[];
  categories: string[];
  skills: {
    name: string;
    required: boolean;
  }[];
  experienceLevels: string[];
};
```

#### API Integration

- Create a new Supabase function to fetch skills suggestions based on partial input
- Implement debounced API calls to avoid excessive requests during typing
- Cache frequently used skills for better performance

### 2. Experience Level Filter

#### Technical Requirements

- Add a new section to the filters for experience levels
- Include options: Entry-level, Mid-level, Senior, Executive
- Implement as checkboxes similar to existing filters

#### UI Components

- Create a new `ExperienceLevelFilter` component
- Integrate with the existing filter UI
- Add appropriate styling consistent with the current design

### 3. Saved Searches Functionality

#### Technical Requirements

- Create a new `SavedSearches` component that allows users to:
  - Save current search criteria with a custom name
  - View and manage saved searches
  - Set up notifications for new matching jobs

#### Database Schema

Add a new table to Supabase:

```sql
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  notify_new_matches BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX saved_searches_user_id_idx ON saved_searches(user_id);
```

#### API Endpoints

Implement the following API functions:

1. `saveSavedSearch(userId: string, name: string, filters: JobFilters, notifyNewMatches: boolean): Promise<{ id: string }>`
2. `getSavedSearches(userId: string): Promise<SavedSearch[]>`
3. `deleteSavedSearch(id: string): Promise<void>`
4. `updateSavedSearch(id: string, data: Partial<SavedSearch>): Promise<void>`

### 4. Job Recommendations Based on Profile

#### Technical Requirements

- Create a new `JobRecommendations` component
- Implement an algorithm to match user skills with job requirements
- Display personalized job recommendations on the dashboard

#### Algorithm Overview

1. Extract skills from user profile
2. Compare with skills required in job listings
3. Calculate match percentage based on:
   - Number of matching skills
   - Required vs. preferred skills
   - Experience level match
   - Location preference match
4. Sort and display jobs by match percentage

## UI/UX Design

### Skills Filter

- Implement as a combo box with autocomplete
- Show selected skills as removable tags
- Include a toggle for "required skills only"

### Saved Searches

- Add a "Save this search" button at the bottom of filters
- Create a dropdown menu to access saved searches
- Implement a modal for managing saved searches

### Job Recommendations

- Add a "Recommended for You" section on the dashboard
- Display match percentage for each job
- Highlight matching skills

## Implementation Plan

### Phase 1: Core Filter Extensions

1. Extend the `JobFilters` component with experience level filters
2. Create the `SkillsFilter` component with autocomplete
3. Update the filter state management to include new filter types

### Phase 2: Saved Searches

1. Create the database schema for saved searches
2. Implement the API endpoints for managing saved searches
3. Build the UI components for saving and managing searches

### Phase 3: Job Recommendations

1. Implement the matching algorithm
2. Create the UI for displaying recommended jobs
3. Add notification functionality for new matching jobs

## Testing Strategy

### Unit Tests

- Test filter state management
- Test skills autocomplete functionality
- Test saved search CRUD operations

### Integration Tests

- Test filter application to job listings
- Test saved search retrieval and application
- Test job recommendation algorithm

### User Acceptance Testing

- Verify filter usability with real users
- Test performance with large datasets
- Validate recommendation accuracy

## Dependencies

- Existing components: `JobFilters`, `JobListItem`
- UI components: `Autocomplete`, `Tag`, `Modal`
- API services: Supabase functions
- Database: Supabase tables

## Conclusion

Implementing these advanced job search filters will significantly enhance the user experience by providing more targeted job search capabilities. The addition of skills filtering, experience level filtering, and saved searches will make it easier for users to find relevant job opportunities and stay updated on new matching positions.