# AtelierOS

**Run your boutique beautifully.**

Studio desk for Indian ateliers — customers, measurements, orders, production, trials, deliveries and payments.

Live: will be published on Vercel after first deploy.

## How to try it

- **Landing:** `/`
- **Studio demo:** `/login` → **Open Meenakshi Atelier demo** (PIN `2026`)
- **HQ admin:** `/login` → **Open HQ admin** (`ajithkutten1998@gmail.com` / `2026`)
- **Customer portal:** `/o/AT-1048` — no login, signed-link style
- **Create a studio:** `/onboarding`

## Three desks

| Desk | Who | What they see |
| --- | --- | --- |
| Studio `/app` | Boutique owner / staff | Their customers, orders, floor, cash |
| HQ `/admin` | You | Every studio, every customer, every payment; impersonate a floor |
| Portal `/o/:orderId` | The wearer | Status, trial, balance — no account |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

This preview keeps data in the browser (`localStorage`) so a boutique owner can walk one complete order without Excel. Inventory, WhatsApp Business API, automations and subscriptions are modelled for later — not in this first desk.

## License

Proprietary. All rights reserved.
