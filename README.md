# MODO

MODO is an interactive web application designed to help users discover travel destinations in Belarus based on their current mood, interests, and travel preferences.

The project is designed for users who want to travel but have not yet decided where to go. Instead of starting with a specific destination, users can begin by selecting the type of experience they are looking for and receive relevant destination suggestions.

## Concept

Choosing a travel destination is not always based only on location or price. A person's current mood, interests, and expectations can also influence their decision.

MODO explores a mood-based approach to destination discovery. Users select preferences that reflect the type of experience they are looking for and receive destination suggestions based on their choices.

The project also explores the role of visual design and color in user perception and interaction.

## Features

* Mood-based destination discovery
* Selection of travel interests and preferences
* Destination suggestions based on user choices
* Destination comparison
* Route planning
* Interactive maps powered by Leaflet
* Responsive interface
* Anonymous interaction statistics

## Search Panel

The project includes a separate `/search-panel` page for viewing anonymized interaction statistics.

Currently, the panel displays:

* Total number of searches
* Most frequently selected moods

The collected data is stored persistently and remains available after page refreshes or application restarts. No personal user information is collected.

## Architecture

The application follows the **Feature-Sliced Design (FSD)** architectural methodology.

The project structure separates application logic into independent layers and segments, helping maintain clear responsibility boundaries and scalability.

```text
src/
├── app/        # Application initialization and configuration
├── pages/      # Application pages
├── widgets/    # Large reusable UI blocks
├── features/   # User interactions and features
├── entities/   # Business entities
└── shared/     # Shared UI, utilities and configuration
```

## Tech Stack

* React
* TypeScript
* React Router
* Vite
* Sass
* Leaflet
* Feature-Sliced Design (FSD)
* Netlify

## Research Context

MODO was developed as part of a research project focused on studying the relationship between digital interface design, color perception, emotional responses, and user preferences.

The application provides an interactive environment for observing how users interact with a mood-based destination selection process. User feedback and anonymized interaction data can be used to analyze interface perception and destination preferences.

## Demo

The project is deployed using Netlify.

**Live Demo:** 
