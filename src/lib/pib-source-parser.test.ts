import { describe, expect, it } from "vitest";

import { buildPibDateForm, extractPibReleaseLinks, parsePibRelease, recentCompletePibDates } from "./pib-source-parser";

const officialUrl = "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305021";

const listHtml = `
  <main>
    <a title="Century-old limit on turning heat into electricity surpassed" href="/PressReleaseDetail.aspx?PRID=2305021">First label</a>
    <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305021">Duplicate label</a>
    <a href="/unrelated">Ignore me</a>
  </main>`;

const detailHtml = `
  <html><body>
    <nav>Press Releases Follow us</nav>
    <h2 id="Titleh2">Century-old limit on turning heat into electricity surpassed</h2>
    <div id="PrDateTime">Posted On: 31 AUG 2026 4:59PM by PIB Delhi</div>
    <div class="BackgroundRelease">
      <p>Indian scientists reported a result that enables ultrasensitive temperature sensing.</p>
      <figure><img src="third-party.jpg"><figcaption>Image: laboratory equipment</figcaption></figure>
      <p>It builds on a century-old thermodynamic limit &amp; reports the measured effect.</p>
    </div>
    <span id="ReleaseId">(Release ID: 2305021)</span>
    <footer>Visitor Counter: 88 Follow us</footer>
  </body></html>`;

describe("PIB source parser", () => {
  it("collects complete days and does not include the current India day", () => {
    expect(recentCompletePibDates(new Date("2026-08-31T00:00:00Z"), 2).map((date) => date.toISOString().slice(0, 10))).toEqual([
      "2026-08-30",
      "2026-08-29"
    ]);
  });

  it("builds the official date form without inventing query parameters", () => {
    const formHtml = `
      <input type="hidden" name="__VIEWSTATE" value="state-value">
      <input type="hidden" name="__EVENTVALIDATION" value="event-value">
      <select name="ctl00$ContentPlaceHolder1$ddlMinistry"><option selected="selected" value="0">All Ministry</option></select>`;
    const form = buildPibDateForm(formHtml, new Date("2026-08-30T00:00:00Z"));
    expect(Object.fromEntries(form)).toMatchObject({
      __EVENTTARGET: "ctl00$ContentPlaceHolder1$ddlday",
      __EVENTVALIDATION: "event-value",
      __VIEWSTATE: "state-value",
      "ctl00$ContentPlaceHolder1$ddlMinistry": "0",
      "ctl00$ContentPlaceHolder1$ddlday": "30",
      "ctl00$ContentPlaceHolder1$ddlMonth": "8",
      "ctl00$ContentPlaceHolder1$ddlYear": "2026"
    });
  });

  it("extracts unique release IDs and titles from the official list", () => {
    expect(extractPibReleaseLinks(listHtml)).toEqual([
      {
        id: "2305021",
        title: "Century-old limit on turning heat into electricity surpassed",
        url: officialUrl
      }
    ]);
  });

  it("removes navigation, image labels, and footer text from the release evidence", () => {
    const release = parsePibRelease(detailHtml, officialUrl, new Date("2026-08-31T12:00:00Z"));
    expect(release.evidenceText).not.toMatch(/Visitor Counter|Follow us|Image:/i);
    expect(release.evidenceText).toContain("thermodynamic limit & reports the measured effect");
    expect(release.publishedAt).toBe("2026-08-31T00:00:00.000Z");
  });

  it("reads live-shape sibling evidence between the date and reel markers", () => {
    const liveShapeHtml = `
      <h2 id="Titleh2">Century-old limit on turning heat into electricity surpassed</h2>
      <div id="PrDateTime">Posted On: 31 AUG 2026 4:59PM by PIB Delhi</div>
      <div class="pt20"></div><input type="hidden" name="hydphotoUrl">
      <p>Indian scientists reported a measured thermoelectric effect in a peer-reviewed study.</p>
      <div id="reel_pic"></div><span id="ReleaseId">(Release ID: 2305021)</span>
      <div class="BackgroundRelease"></div>`;
    const release = parsePibRelease(liveShapeHtml, officialUrl, new Date("2026-08-31T12:00:00Z"));
    expect(release.evidenceText).toBe("Indian scientists reported a measured thermoelectric effect in a peer-reviewed study.");
  });

  it("rejects a detail page without evidence", () => {
    expect(() => parsePibRelease(`<h2 id="Titleh2">A title</h2><div id="PrDateTime">31 AUG 2026</div>`, officialUrl, new Date())).toThrow(
      "PIB release evidence is missing."
    );
  });
});
