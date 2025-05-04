# Technical Specification: Enhanced Resume Builder

## Overview

This document provides detailed technical specifications for implementing an enhanced resume builder in the Hairly application. This feature will extend the current resume analysis capabilities to include an interactive resume builder with templates and ATS optimization suggestions.

## Current Implementation

The current `ResumeAnalyzer` component provides basic resume analysis functionality:
- Analyzes uploaded resume text using AI
- Extracts structured data (skills, education, experience)
- Saves extracted data to user profile
- Provides general feedback on the resume

The component uses Supabase Edge Functions for AI analysis and stores data in the Supabase database.

## Proposed Enhancements

### 1. Interactive Resume Builder

#### Technical Requirements

- Create a new `ResumeBuilder` component that includes:
  - Multi-step form for resume creation
  - Drag-and-drop section reordering using `@hello-pangea/dnd`
  - Real-time preview of the resume
  - Auto-save functionality

#### Data Structure

Create a new `Resume` type:

```typescript
export type Resume = {
  id: string;
  user_id: string;
  title: string;
  contact_info: {
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  skills: string[];
  experience: {
    id: string;
    job_title: string;
    company_name: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description: string;
    achievements?: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
  }[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date_issued: string;
    expiration_date?: string;
    credential_id?: string;
  }[];
  projects?: {
    id: string;
    name: string;
    description: string;
    url?: string;
    start_date?: string;
    end_date?: string;
  }[];
  template_id: string;
  created_at: string;
  updated_at: string;
};
```

#### Database Schema

Add new tables to Supabase:

```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contact_info JSONB NOT NULL,
  summary TEXT,
  skills JSONB,
  template_id UUID REFERENCES resume_templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE resume_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX resumes_user_id_idx ON resumes(user_id);
```

### 2. Resume Templates

#### Technical Requirements

- Create a `ResumeTemplateSelector` component
- Implement at least 3 professional templates with different styles
- Allow real-time template switching
- Support customization of colors and fonts

#### Template Structure

Each template will be a React component that receives the resume data and renders it according to the template's design:

```typescript
type ResumeTemplateProps = {
  resume: Resume;
  customization?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
};
```

### 3. ATS Optimization

#### Technical Requirements

- Enhance the `ResumeAnalyzer` component to include ATS optimization suggestions
- Implement keyword matching with job descriptions
- Provide actionable feedback for improving ATS compatibility

#### Algorithm Overview

1. Extract keywords from target job description
2. Compare with resume content
3. Identify missing important keywords
4. Suggest improvements for format and content
5. Calculate an "ATS Score" based on compatibility

#### API Integration

Extend the existing `analyze-resume` Supabase Edge Function to include ATS optimization:

```typescript
// Function signature
type AnalyzeResumeRequest = {
  resumeText: string;
  userId?: string;
  jobDescription?: string; // Optional job description for matching
};

type AnalyzeResumeResponse = {
  analysis: string;
  structuredData: any;
  atsScore?: number;
  atsSuggestions?: {
    missingKeywords: string[];
    formatSuggestions: string[];
    contentSuggestions: string[];
  };
};
```

### 4. PDF Export and Sharing

#### Technical Requirements

- Implement PDF generation for created resumes
- Add options to download, email, or share resumes
- Ensure high-quality formatting in exported PDFs

#### Libraries

- Use `react-pdf` or `jspdf` for PDF generation
- Implement custom rendering for each template

## UI/UX Design

### Resume Builder

- Create a multi-step wizard interface:
  1. Personal Information
  2. Professional Summary
  3. Skills
  4. Work Experience
  5. Education
  6. Additional Sections (Projects, Certifications)
  7. Template Selection
  8. Review and Export

- Implement a split-screen layout with form on left and preview on right
- Add drag handles for reordering sections
- Include progress indicator for completion status

### Template Selection

- Display template thumbnails in a carousel
- Show preview with user's actual data
- Include customization panel for colors and fonts

### ATS Optimization

- Display ATS score prominently
- Highlight missing keywords
- Provide actionable suggestions with examples
- Include before/after comparisons

## Implementation Plan

### Phase 1: Core Resume Builder

1. Create the database schema for resumes
2. Implement the multi-step form components
3. Build the resume data management services

### Phase 2: Templates and Preview

1. Design and implement the initial templates
2. Create the template selector component
3. Build the real-time preview functionality

### Phase 3: ATS Optimization and Export

1. Enhance the resume analysis function
2. Implement the ATS optimization suggestions
3. Build the PDF export functionality

## Testing Strategy

### Unit Tests

- Test form validation and data management
- Test template rendering with various data
- Test PDF generation

### Integration Tests

- Test end-to-end resume creation flow
- Test ATS analysis with different job descriptions
- Test data persistence and retrieval

### User Acceptance Testing

- Verify usability of the builder interface
- Test template appearance across devices
- Validate PDF output quality

## Dependencies

- Existing components: `ResumeAnalyzer`
- UI libraries: `@hello-pangea/dnd`, `react-hook-form`
- PDF generation: `react-pdf` or `jspdf`
- API services: Supabase functions
- Database: Supabase tables

## Conclusion

The enhanced resume builder will provide significant value to job seekers by offering a comprehensive tool for creating, optimizing, and managing professional resumes. By integrating ATS optimization and professional templates, users will be able to create more effective resumes that increase their chances of landing interviews.