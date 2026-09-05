import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

export const metadata = {
  title: "Privacy · Syāt",
  description: "What Syāt stores, what it does not, and where the boundaries are."
};

const UPDATED = "5 September 2026";

export default function PrivacyPage() {
  return (
    <SiteChrome active="about">
      <article className="policy-page">
        <header>
          <p className="micro-copy">Privacy</p>
          <h1>What Syāt keeps, and what it never collects.</h1>
          <p className="page-lede">Syāt asks you to check its sources rather than trust its conclusions. It would be inconsistent to then be vague about what it does with you. This page is written to be checked the same way.</p>
          <p className="policy-updated">Last updated {UPDATED}.</p>
        </header>

        <section aria-labelledby="short-title">
          <h2 id="short-title">The short version</h2>
          <p>There are no accounts unless you create one. There is no analytics, no advertising, no tracking pixel, and no third-party script of any kind. Your reading is stored on your own device and is never sent to us. The only thing you can send us is a question you choose to propose.</p>
        </section>

        <section aria-labelledby="device-title">
          <h2 id="device-title">Kept on your device, never sent to us</h2>
          <p>These use your browser&rsquo;s local storage. They stay in that browser, on that device. We cannot read them, they are not synced, and clearing your browser data removes them permanently.</p>
          <ul className="policy-list">
            <li><strong>Your shelf.</strong> Which pages you saved.</li>
            <li><strong>Guide progress.</strong> Whether you have finished the first-read guide.</li>
            <li><strong>A random token</strong> used only to limit how many questions one browser can propose in an hour. It is generated on your device from a random number, is derived from nothing about you, and is useless for identifying anyone.</li>
          </ul>
        </section>

        <section aria-labelledby="sent-title">
          <h2 id="sent-title">What reaches our servers</h2>
          <p>Only when you deliberately send it.</p>
          <ul className="policy-list">
            <li><strong>A proposed question.</strong> If you use <Link href="/en/propose">Propose a question</Link>, we store the question, your optional note, the theme you picked, the random rate-limit token above, and the time. Nothing else. Every proposal starts as pending and a person reads it before anything is published.</li>
            <li><strong>Sign-in details, if you sign in.</strong> Signing in with Google stores the name, email address and profile picture Google gives us, and an identifier for the account. We ask Google for nothing else: no contacts, no calendar, no files, no Gmail. You can sign in and never do anything with it, because no feature currently requires an account.</li>
          </ul>
        </section>

        <section aria-labelledby="never-title">
          <h2 id="never-title">What Syāt does not do</h2>
          <ul className="policy-list">
            <li>No analytics or measurement service. Not Google Analytics, not any other.</li>
            <li>No advertising, and no data sold, shared or brokered. There is no commercial arrangement for anyone to buy.</li>
            <li>No tracking pixels, no fingerprinting, no cross-site tracking, no social media buttons that phone home.</li>
            <li>No profiling and no recommendations. Suggesting what you should read next would mean building a picture of you, and that needs a policy before it needs code. It is off.</li>
            <li>No email. We have no newsletter and will not contact you.</li>
            <li>No fonts loaded from another company. Typefaces are served from this site, so opening a page does not tell a third party you did.</li>
          </ul>
        </section>

        <section aria-labelledby="infra-title">
          <h2 id="infra-title">Companies involved, and what they see</h2>
          <p>Being honest about this matters more than claiming we run everything ourselves.</p>
          <ul className="policy-list">
            <li><strong>Vercel</strong> hosts and serves the pages. Like any web host, its servers process the requests that deliver a page to you, which necessarily includes your IP address. We do not add our own logging on top and we do not build any record of readers.</li>
            <li><strong>Convex</strong> runs the small backend that receives proposals and handles sign-in.</li>
            <li><strong>Google</strong> is involved only if you choose to sign in with it, and only at that moment.</li>
          </ul>
          <p>Nothing else is contacted when you read a page.</p>
        </section>

        <section aria-labelledby="cookies-title">
          <h2 id="cookies-title">Cookies</h2>
          <p>Syāt sets no advertising cookies, no analytics cookies and no tracking cookies of any kind. Reading the site sets no cookie at all.</p>
          <p>One cookie exists, and only if you sign in: a session cookie that keeps you signed in between pages. It is required for sign-in to work, is not used to follow you anywhere, and is removed when you sign out. The shelf and guide progress described above use your browser&rsquo;s local storage rather than cookies, which means they are never transmitted with a request.</p>
        </section>

        <section aria-labelledby="rights-title">
          <h2 id="rights-title">Deleting your data, and how long it is kept</h2>
          <p>Anything stored on your device you can delete yourself by clearing your browser&rsquo;s data for this site. We cannot see it and it goes when you say so.</p>
          <ul className="policy-list">
            <li><strong>To delete your account,</strong> write to the contact address below from the address you signed in with, and it will be deleted along with the name, email and picture Google supplied. Nothing is retained afterwards.</li>
            <li><strong>To delete a question you proposed,</strong> write to the same address describing it and it will be removed from the review queue.</li>
            <li><strong>Retention.</strong> Proposals are kept only until they are reviewed and then either written up or deleted. Account details are kept until you ask for deletion or the preview ends. There is no archive of readers, because none is created.</li>
          </ul>
          <p>Requests are handled by one person and are usually done within a few days. There is very little to delete, which is the point.</p>
        </section>

        <section aria-labelledby="state-title">
          <h2 id="state-title">Where this is honest about itself</h2>
          <p>Syāt is a private preview. News pages are labelled as AI-assisted drafts under review and are not indexed by search engines. If any of this changes, this page changes with it and the date at the top moves. It is not a document written once and left.</p>
        </section>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>Questions about anything here go to <a href="mailto:arnavjain166@gmail.com">arnavjain166@gmail.com</a>.</p>
        </section>
      </article>
    </SiteChrome>
  );
}
