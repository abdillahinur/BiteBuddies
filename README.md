# BiteBuddies

BiteBuddies is a cross-platform (React Native + Expo) app for discovering, voting, and reviewing restaurants with friends. It features session-based group dining, collaborative restaurant suggestions, voting, and a personal dining history with ratings and image uploads.

## Features

- **Session Management**: Create, join, and leave group dining sessions. Sessions support voting, restaurant suggestions, and real-time updates.
- **Restaurant Suggestions**: Suggest restaurants for group voting, filter by cuisine and dietary preferences, and view nearby options (location-based).
- **Voting System**: Vote on restaurant choices within a session. See top choices and voting progress.
- **Dining History**: Track your past dining sessions, add/edit/delete entries, rate experiences (Likert scale), and upload review images.
- **Profile & Preferences**: Set dietary preferences, view your avatar (with fallback), and manage your account.
- **Image Uploads**: Upload and preview images for reviews (web and native support).
- **Cross-Platform UI**: Consistent, modern design for both web and mobile.

## Screenshots

- Home, Sessions, History, and Profile tabs
- Session voting and suggestion UI
- Dining history with ratings and image uploads

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository:**
   ```sh
git clone <your-repo-url>
cd Hackathon
```
2. **Install dependencies:**
   ```sh
yarn install
# or
npm install
```
3. **Start the Expo development server:**
   ```sh
npx expo start
```
4. **Run on your device or simulator:**
   - Use the Expo Go app (iOS/Android) or a simulator/emulator.
   - For web: press `w` in the Expo CLI.

### Environment Variables
- Configure your Supabase credentials in `lib/supabaseClient.ts`.
- Add any other required API keys or environment variables as needed.

## Project Structure

```
app.json                # Expo app config
package.json            # Project dependencies and scripts
tsconfig.json           # TypeScript config
app/                    # Main app screens and navigation
  (tabs)/               # Tab screens: Home, Sessions, History, Profile
  _layout.tsx           # App layout
assets/                 # Images and static assets
components/             # Reusable UI components
constants/              # App-wide constants (e.g., colors)
hooks/                  # Custom React hooks
lib/                    # Supabase client and utilities
pages/api/              # API routes (if using Next.js API routes)
types/                  # TypeScript types
```

## Key Files
- `app/(tabs)/sessions.tsx`: Session management, voting, and restaurant suggestions
- `app/(tabs)/history.tsx`: Dining history, ratings, and image uploads
- `app/(tabs)/profile.tsx`: User profile and preferences
- `lib/supabaseClient.ts`: Supabase integration
- `components/`: UI components (e.g., RestaurantCard, SessionCard)

## Customization
- **Styling**: Edit `constants/Colors.ts` and component styles for branding.
- **API Integration**: Update `lib/supabaseClient.ts` and API routes as needed.
- **Image Upload**: Web uses file input; native uses a placeholder (can be extended with Expo ImagePicker).

## Development Tips
- Use Expo Go for fast mobile testing.
- For native features (location, image picker), ensure permissions are set in `app.json`.
- TypeScript is used throughout for type safety.

## Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a pull request

## License
MIT

## Acknowledgments
- [Supabase](https://supabase.com/) for backend services
- [Expo](https://expo.dev/) for cross-platform development
- [React Native](https://reactnative.dev/)

---

For questions or support, open an issue or contact the project maintainer.
