# How to add AdSense and advertising to TechVora

This guide explains the recommended steps to add Google AdSense and ensure compliance.

1. Create or claim your site in Google AdSense and get your publisher ID (pub-XXXXXXXXXXXX).
2. Add a publisher-verified site domain and follow AdSense verification steps.
3. Add an ads.txt file to the site root with the line provided by AdSense.
4. Only load ad scripts after the user has given consent via the cookie banner (CMP). Use a consent management platform (OneTrust, Cookiebot) or implement a server-side flag.
5. Update the privacy policy to disclose advertising and analytics (we added a starter section in privacy-policy.html).
6. For page-level placements, add reserved ad containers with descriptive class names. Example:

<!-- ad slot example: header leaderboard -->
<div class="ad-slot ad-leaderboard" aria-hidden="true"><!-- Replace with ad code after consent --></div>

7. Do not place deceptive ads or misleading buttons. Keep a clear separation between content and advertising.

If you want, I can integrate lazy-loading ad placeholders and a basic CMP hook that defers AdSense script loading until consent is given.
