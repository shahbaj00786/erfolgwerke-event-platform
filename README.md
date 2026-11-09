# Erfolgwerke - Event Booking & RSVP Platform

Erfolgwerke is a web-based event management platform built to look and feel like Eventbrite. It lets event organizers create, manage, and track their events easily, while attendees can browse upcoming events, check seat availability, and sign up for them in just a few clicks.

---

## What the App Does

### 1. For Organizers
- **Event Creation:** Quickly set up new events with a title, description, date, time, venue, and total seat limit.
- **Event Management:** Easily update details or cancel events whenever needed.
- **Attendee Tracking:** View real-time lists of everyone who has registered (including names and emails) for any event.
- **CSV Export:** Download a complete participant report directly as a CSV file straight from the dashboard.

### 2. For Attendees
- **Event Discovery:** Browse through a clean, organized list of upcoming events.
- **Event Details:** Click on any event to view full information and see how many seats are still left in real-time.
- **Seamless Registration:** Register for events instantly with built-in safety checks.
- **My Registrations:** Access a dedicated page to keep track of all the events you have signed up for.

---

## Important Rules & Safety Checks
- **Seat Limits:** An event can never exceed its maximum seat capacity.
- **Single Registration:** An attendee can only register for the same event once.
- **Strict Ownership:** Organizers can only edit, cancel, or view attendees for the events they personally created.
- **Valid Dates:** Events must be set in the future. Past dates, past times, and cancelled events are automatically blocked.
- **Seat Limit Protection:** Organizers cannot reduce an event's seat limit below the number of people already registered.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Routing & State:** React Router & Local State Management
- **HTTP Client:** Axios with Interceptors for secure JWT authentication
- **Utilities:** Custom modular services for CSV exports and form validations

---

### Bonus Features Included
- **Advanced Search & Filters:** Case-insensitive keyword search and live availability filters.
- **Analytics & Reporting:** Comprehensive organizer performance overview metrics.
- **CSV Export:** One-click download of event participant data and reports directly from the organizer dashboard.

---

## Environment Variables

Create a `.env` file in the root directory of your project and add your backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api