# Start Solo Blueprint

A landing page for the Start Solo Blueprint course, designed to help solopreneurs build profitable businesses without burnout.

## Features

- Responsive design optimized for all devices
- Interactive webinar registration system
- Countdown timer for urgency
- Testimonials and social proof sections
- WhatsApp community integration
- Content management system for easy updates

## Deployment

This site is deployed on Netlify at [startsolo.in](https://startsolo.in)

## CMS Setup

This project uses Netlify CMS with GitHub authentication for content management. To set up the CMS:

1. Deploy the site to Netlify
2. Enable Netlify Identity in your Netlify site settings
3. Set up GitHub OAuth for authentication:
   - Go to GitHub Developer settings and create a new OAuth App
   - Set the Authorization callback URL to `https://api.netlify.com/auth/done`
   - Add the Client ID and Client Secret to your Netlify site's Identity settings
4. Invite users to your site through the Netlify Identity tab
5. Access the CMS at `/admin` on your deployed site

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Structure

The content is organized in JSON files under `src/content/`:

- `settings/` - Global site settings
- `sections/` - Content for each page section

## License

All rights reserved.