const fs = require('fs');
const { expect, test } = require('@playwright/test');

async function mockExternalMapServices(page) {
    await page.route('https://photon.komoot.io/**', async route => {
        const query = new URL(route.request().url()).searchParams.get('q') || '';
        const normalizedQuery = query.toLowerCase();
        const locations = {
            nürnberg: [11.0767, 49.4521],
            fürth: [10.9846, 49.4774]
        };
        const coordinates = locations[normalizedQuery];
        const features = coordinates
            ? [{
                type: 'Feature',
                geometry: { type: 'Point', coordinates },
                properties: { name: query, city: query, country: 'Deutschland' }
            }]
            : [];

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ type: 'FeatureCollection', features })
        });
    });

    await page.route('https://*.tile.openstreetmap.org/**', route => route.abort());
}

test.beforeEach(async ({ page }) => {
    await mockExternalMapServices(page);
});

test('plant, speichert, lädt und exportiert eine Route', async ({ page }) => {
    await page.goto('/');
    await page.locator('#routeName').fill('Rundwanderung E2E');
    await page.locator('#startLocation').fill('Nürnberg');
    await page.locator('#endLocation').fill('Fürth');
    await page.getByRole('button', { name: 'Kürzeste gefundene Route' }).click();

    await expect(page.locator('#statusText')).toContainText('Kürzeste von 2 gefundenen Alternativen');
    await expect(page.locator('#routeProgress')).toBeHidden();
    await expect(page.locator('#distanceText')).not.toHaveText('0.00');
    const routePoints = await page.evaluate(() => finalRoadPoints);
    expect(routePoints[1].lat).toBeCloseTo((49.4521 + 49.4774) / 2, 6);
    expect(routePoints[1].lng).toBeCloseTo((11.0767 + 10.9846) / 2, 6);

    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'In DB Speichern' }).click();
    await expect(page.locator('#route-list li')).toContainText('Rundwanderung E2E');
    await page.locator('#route-list li').click();
    await expect(page.locator('#statusText')).toContainText('Route "Rundwanderung E2E" geladen.');

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Als GPX exportieren' }).click()
    ]);
    expect(download.suggestedFilename()).toBe('rundwanderung_e2e.gpx');
    const gpx = fs.readFileSync(await download.path(), 'utf8');
    expect(gpx).toContain('<name>Rundwanderung E2E</name>');
    expect(gpx).toContain('<trkpt');
});

test('zeigt bei einem unbekannten Ort einen Hinweis und beendet den Ladevorgang', async ({ page }) => {
    await page.goto('/');
    await page.locator('#startLocation').fill('Unbekannter Ort');
    await page.locator('#endLocation').fill('Fürth');
    await page.getByRole('button', { name: 'Kürzeste gefundene Route' }).click();

    await expect(page.locator('#statusText')).toContainText('Kein Treffer für „Unbekannter Ort“');
    await expect(page.locator('#routeProgress')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Kürzeste gefundene Route' })).toBeEnabled();
});

test('zeichnet Wegpunkte per Kartenklick und unterstützt Undo und Leeren', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
        map.fire('click', { latlng: L.latLng(49.4521, 11.0767) });
        map.fire('click', { latlng: L.latLng(49.4531, 11.0777) });
    });

    await expect(page.locator('#statusText')).toHaveText('Weg durch den Park automatisch berechnet!');
    await expect(page.locator('#distanceText')).not.toHaveText('0.00');
    await page.getByRole('button', { name: '↩ Rückgängig' }).click();
    await expect(page.locator('#statusText')).toHaveText('Letzter Schritt wurde rückgängig gemacht.');
    await expect(page.locator('#distanceText')).toHaveText('0.00');

    await page.getByRole('button', { name: 'Karte leeren' }).click();
    await expect(page.locator('#statusText')).toHaveText('Karte geleert.');
});
