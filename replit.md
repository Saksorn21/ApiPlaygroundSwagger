# Docs Snippet API

## Overview

This is a React-based API documentation and testing platform built with Vite that allows users to import, edit, and test OpenAPI/Swagger specifications. The application provides an interactive interface for exploring API endpoints, generating code snippets, and testing API calls in real-time. It serves as both a documentation viewer and an API playground for developers working with REST APIs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Build Tool**: Vite 5+ with fast HMR and optimized bundling
- **Styling**: Tailwind CSS for utility-first styling with dark mode support
- **State Management**: Zustand for lightweight, flexible state management with persistence
- **Routing**: React Router 7.8 for client-side navigation (though currently single-page focused)

### Component Structure
- **Layout Components**: Modular layout system with responsive design and theme support
- **API Components**: Specialized components for API endpoint display, testing, and response viewing
- **UI Components**: Reusable components like forms, dropzones, selectors, and themed boxes
- **Tab System**: Organized tab-based interface for different API interaction modes (parameters, body, headers, responses)

### Data Management
- **API Spec Store**: Centralized Zustand store managing OpenAPI/Swagger specifications with local persistence via LocalForage
- **Schema Processing**: Support for both OpenAPI 3.x and Swagger 2.0 specifications with automatic version detection
- **Form Generation**: Dynamic form generation using React JSON Schema Form (RJSF) with Material-UI and Shadcn theme support

### Theme System
- **Context-Based Theming**: React Context for theme management supporting light, dark, and system preferences
- **Responsive Design**: Mobile-first approach with portrait/landscape orientation support
- **Dynamic Theme Switching**: Real-time theme switching with persistence across sessions

### API Integration Architecture
- **Spec Processing**: Automatic parsing and validation of JSON/YAML API specifications
- **Code Generation**: Integration with openapi-snippet for multi-language code snippet generation
- **Request Testing**: Built-in HTTP client for testing API endpoints directly from the interface
- **Response Handling**: Structured response display with JSON tree visualization

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18.3.1, React DOM, React Router for core functionality
- **Build Tools**: Vite with TypeScript support, ESLint integration, and SWC compilation
- **Type System**: TypeScript with comprehensive type definitions for OpenAPI specifications

### OpenAPI/Swagger Processing
- **@apidevtools/json-schema-ref-parser**: For resolving $ref references in OpenAPI specs
- **swagger-client**: Official Swagger client for API interaction
- **openapi-snippet**: Code snippet generation for multiple programming languages
- **yaml**: YAML parsing and stringification for spec format conversion

### UI and Form Libraries
- **@rjsf/core, @rjsf/mui, @rjsf/shadcn**: React JSON Schema Form with multiple theme support
- **@emotion/react, @emotion/styled**: CSS-in-JS styling for component theming
- **framer-motion**: Animation library for smooth UI transitions
- **lucide-react**: Modern icon library for consistent iconography

### Data Visualization and Editing
- **react-json-tree**: JSON data visualization with syntax highlighting
- **json-edit-react**: Interactive JSON editor for spec modification
- **react18-json-view**: Modern JSON viewer component
- **react-code-blocks**: Syntax-highlighted code display

### Storage and Persistence
- **localforage**: IndexedDB/WebSQL/localStorage abstraction for offline storage
- **zustand**: State management with built-in persistence middleware

### Utility Libraries
- **axios**: HTTP client for API requests with interceptor support
- **file-saver**: Client-side file download functionality
- **react-dropzone**: Drag-and-drop file upload interface
- **react-hot-toast**: Toast notification system
- **clsx**: Conditional className utility for dynamic styling
- **uuid**: UUID generation for unique identifiers

### Development Tools
- **@nabla/vite-plugin-eslint**: ESLint integration for Vite development server
- **Prettier**: Code formatting with automatic formatting on save
- **TypeScript**: Static type checking with strict configuration