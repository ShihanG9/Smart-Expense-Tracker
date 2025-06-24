
# Smart Expense Tracker

**Smart Expense Tracker** is a project developed by Codec Technologies designed to assist students and working professionals in managing their income, expenses, and savings. It features theme customization, expense analysis, a budgeting assistant chatbot, and LocalStorage-based data storage, providing an efficient, user-friendly financial management experience.

The application is built using **HTML, CSS, and JavaScript**, featuring a modern user interface, offline-first functionality, and a comprehensive suite of features.

---

## Folder Structure

```

et/
├── et.html          # Contains 9 <section> screens (Single Page Application format)
├── et.css           # Responsive styling, animations, dark/pastel themes
└── et.js            # All navigation, logic, data processing, OCR, voice, insights, and export functionality

```

---

## Screen-by-Screen Features

### 1. Welcome Screen
- Animated splash screen with app logo and name
- “Start” call-to-action button
- Fade-in text effect with gradient background

### 2. Profile Selection
- Create or select a user profile
- Optional profile image upload
- Separate data storage per profile
- Support for multiple datasets per user

### 3. Dashboard
- Summary of recent expenses:
  - Today / This Week / This Month
  - Top 3 spending categories
  - Upcoming recurring expenses
- Quick navigation cards

### 4. Add Expense
- Manual form input: title, category, amount, note, date
- Voice input using Web Speech API with natural language support
- OCR functionality using Tesseract.js to extract receipt data
- Category suggestions based on spending history

### 5. View Expenses
- Scrollable, searchable list of expenses
- Filters: Date range, amount slider, category dropdown
- Timeline mode with horizontal card-style display
- Undo delete option via notification

### 6. Charts and Insights
- Pie chart: Category-wise spending
- Line chart: Expense trends over time
- AI-based forecast of next month’s budget
- Animated spending meter with category limits
- Calendar heatmap of daily spending

### 7. Goals and Achievements
- Set monthly or category-based goals
- Visual progress indicators
- Unlockable achievements for hitting milestones
- Motivational messages based on progress

### 8. Export Options
- Export data as:
  - PDF (via jsPDF)
  - Excel (.xls)
  - JSON for backup
- Import JSON to restore saved data

### 9. Settings
- Local PIN-based access control
- Theme toggle: Light, Dark, Pastel, or Auto (based on time)
- Reset data or delete profiles
- Currency selector
- Toggle optional modules (OCR, voice, goals, graphs)

---

## Feature Overview

### Core Functionalities

| Feature            | Technology Used       | Description                               |
|--------------------|------------------------|-------------------------------------------|
| Offline Support    | Service Worker (PWA)   | Full functionality without internet       |
| Local Storage      | Vanilla JavaScript     | Stores user data securely per profile     |
| SPA Navigation     | JavaScript             | Smooth section-to-section screen flow     |

### Voice Input
- Web Speech API
- Parses user input such as: “Spent ₹150 on groceries yesterday”

### OCR (Receipt Scanning)
- Tesseract.js
- Extracts amount, date, and merchant name from uploaded receipts

### AI-Powered Insights
- Provides basic financial trend analysis
- Forecasts future spending
- Displays percent changes over weeks/months

### Recurring Expense Detection
- Detects repeated patterns (category, amount, frequency)
- Suggests marking them as recurring

### Security
- Local-only PIN lock
- Auto-lock after inactivity

### Plugin Toggle System
- Enable/disable optional modules such as:
  - Achievements
  - Graphs and charts
  - Goals
  - OCR
  - Voice input

---

## UI/UX Design Standards

| Element     | Specification                                     |
|-------------|---------------------------------------------------|
| Fonts       | Poppins, Open Sans, Raleway                       |
| Themes      | Light, Dark, Pastel, Auto (based on time of day)  |
| Animations  | Fade transitions, badge unlocks, animated meters  |
| Buttons     | Rounded with hover effects and icons              |
| Layout      | Section-based SPA with full-page transitions      |
| Cards       | Glassmorphism design with shadows and motion      |

---

## Navigation Flow

```

Welcome → Profile Selection → Dashboard → Add Expense → View Expenses → Charts and Insights → Goals and Achievements → Export → Settings

```

---

## Additional Enhancements

| Feature                | Description                                                   |
|------------------------|---------------------------------------------------------------|
| Cleanup Suggestions    | Prompts to remove outdated or duplicate entries               |
| Narration              | Reads aloud the last three expenses using speech synthesis    |
| PWA Support            | App can be installed and works offline                        |
| Auto Theme             | Automatically switches between light and dark themes by time  |
| Import/Export Utility  | JSON-based backup and restore functionality                   |

---

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Web Speech API
- Tesseract.js (OCR functionality)
- jsPDF (PDF export)
- Service Workers (Progressive Web App support)
- LocalStorage (data persistence)

---

## License

This project is licensed under the Codec Technologies


---

## Developed By

**Codec Technologies**  
For feedback, improvements, or feature requests, feel free to open an issue or contact the development team.
```

