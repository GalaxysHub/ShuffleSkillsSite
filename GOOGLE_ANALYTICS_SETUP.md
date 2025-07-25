# Google Analytics Setup

This project includes Google Analytics 4 (GA4) integration for tracking user interactions and site performance.

## Setup Instructions

### 1. Create a Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or select an existing one
3. Create a new GA4 property for your website
4. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Update the Measurement ID

Replace `GA_MEASUREMENT_ID` in the following files with your actual measurement ID:

#### In `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_MEASUREMENT_ID');
</script>
```

#### In `src/utils/analytics.ts`:
```typescript
export const GA_MEASUREMENT_ID = 'YOUR_MEASUREMENT_ID';
```

### 3. What Gets Tracked

The analytics implementation automatically tracks:

- **Page Views**: Every route change
- **Move Completions**: When users mark moves as complete
- **Goal Setting**: When users set learning goals
- **Move Views**: When users open move detail modals
- **User Interactions**: Various user actions throughout the site

### 4. Privacy Considerations

- IP addresses are anonymized
- No personally identifiable information is collected
- Consider adding a privacy policy and cookie consent for GDPR compliance

### 5. Testing

To test if analytics is working:

1. Deploy your site with the correct measurement ID
2. Visit your site and navigate between pages
3. Check the Google Analytics real-time reports
4. Interact with moves (complete them, set goals, view details)
5. Verify events appear in the GA4 events section

## Custom Events

The following custom events are tracked:

- `complete_move`: When a user completes a shuffle move
- `set_goal`: When a user sets a learning goal
- `view_move`: When a user opens a move detail modal
- `login`: When a user authenticates
- `upload_move`: When a user submits a new move
- `filter_moves`: When a user applies filters to the skill tree

These events help you understand:
- Which moves are most popular
- User learning patterns
- Feature usage
- Geographic distribution of users