# CAREWEAVE — Smart Maternal Health Monitoring

CAREWEAVE is a healthcare-IoT website and interactive prototype for a smart postpartum wearable.

## Included

- Premium CAREWEAVE product landing page
- Smart textile / wearable presentation
- Mother + caregiver focused UX
- Live maternal monitoring dashboard
- Heart rate, temperature and respiration simulation
- Explainable LOW / MODERATE / HIGH prototype risk engine
- Alert history and trend charts
- Demo Mode and warning simulation
- ESP32 + Bluetooth Low Energy connection interface
- JSON BLE payload handling
- Offline/local browser storage
- Emergency contact, call and SMS handoff
- Safety, privacy and clinical validation roadmap
- Responsive desktop/tablet/mobile design
- Accessible, non-color-only risk labels

## Project structure

```text
CAREWEAVE_GitHub_Ready/
├── index.html
├── styles.css
├── app.js
├── README.md
└── public/
    └── images/
        └── CAREWEAVE visual assets
```

## Run locally

No Node.js is required for the normal website.

You can open `index.html` directly in a browser, or use a local server:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Save.

GitHub will publish `index.html` as the site.

## ESP32 BLE prototype

The frontend includes a Web Bluetooth connection path.

Expected service UUID:

`6e400001-b5a3-f393-e0a9-e50e24dcca9e`

Expected data characteristic:

`6e400003-b5a3-f393-e0a9-e50e24dcca9e`

Expected UTF-8 JSON payload:

```json
{"hr":82,"temp":36.8,"rr":16,"ts":1720000000}
```

For browser BLE, use a compatible browser and a secure context such as HTTPS or localhost.

## Medical safety

CAREWEAVE is a **monitoring and early-warning prototype**. It is not a replacement for professional medical diagnosis, treatment, or emergency medical care.

The demonstration thresholds are illustrative and must not be used for clinical decision-making. Clinical validation, safety testing, algorithm validation, regulatory assessment, secure data infrastructure, and appropriate medical oversight are required before real clinical deployment.

## Data and privacy

The demo stores readings, alerts and emergency-contact information in the browser's local storage. This is suitable for a prototype only. A production system should use authentication, encryption, consent management, secure APIs, audit logging and appropriate clinical-data protections.
