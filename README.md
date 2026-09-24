# Construction Specialties LLC — Website

Next.js site for Construction Specialties LLC. There is no database or admin area: all photos are served from `public/`, and the estimate form sends an email through [Resend](https://resend.com).

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev                  # http://localhost:9002
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Sends estimate requests. |
| `RESEND_FROM_EMAIL` | No | Sender address. Defaults to `onboarding@resend.dev`, which only delivers to the email that owns the Resend account. Verify a domain in Resend to send from your own address. |
| `CONTACT_TO_EMAIL` | No | Inbox for estimate requests. Defaults to `constspcltsfargo@gmail.com`. |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL, used for link previews. |

## Where things live

- **Project photos**: `public/Website Pics/`, listed with titles and categories in `src/lib/projects.ts`. To add a photo, drop it in the folder and add a line to that list.
- **Logos**: `public/Logos/` (originals) and `public/brand/` (trimmed copies the site uses). The favicon is `src/app/icon.png`.
- **Contact details and nav links**: `src/lib/site.ts`.
- **Estimate email**: `src/app/actions.ts` (sending) and `src/lib/email/estimate-request-email.ts` (template).
- **Animation primitives**: `src/components/motion/`.
