# Ecluse

A daily dexterity game for Reddit, built on [Devvit Web](https://developers.reddit.com/).

A crate sinks through a canal crossed by five sweeping gates. Tap a gate row to
freeze its sweep for a moment and let the crate slide past. The level is
generated from the day - gate phases, speeds, sinking rate - so the run is the
same for everyone.

## How to play

1. Tap Release the crate.
2. Watch the descent; when a gate sweep approaches the crate, tap that row to
   freeze it briefly.
3. Clear the canal to extend your streak.

One canal per day, the same for everyone; streaks stored per user in Redis.

## Stack

- React 19 + Tailwind 4 + Vite (client inside a Reddit post), requestAnimationFrame loop
- Hono server on Devvit (`/api/init`, `/api/submit`), Redis persistence
- Deterministic daily level generation (UTC seed), unit-tested

## Development

```bash
npm install
npm run dev
npm test
npm run type-check
npm run build
```

## Submission (Reddit's Game of the Day Hackathon)

- App listing: `developers.reddit.com/apps/gameday-ecluse` (private until judging ends)
- Demo post: public test subreddit, post running the game
