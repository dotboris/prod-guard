# Prod Guard

<img
    src="src/icon/dark-icon.svg"
    alt="Prod Guard logo"
    width="128"
    height="128"
    align="right"
/>

[![Known Vulnerabilities](https://snyk.io/test/github/dotboris/prod-guard/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dotboris/prod-guard?targetFile=package.json)

A browser extension that lets you know when you're connected to production by
giving you a clear visual warning. Never accidentally make changes to
production.

Specifically, Prog Guard lets you add big red warnings to any website.

## Install

<p align="center">
    <a href="https://chrome.google.com/webstore/detail/prod-guard/hiimciamoiopmcjmbpgbfkiilbdnccdk">
        <img src="./doc/chrome-install-badge.png" alt="Install on Chrome" />
    </a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/prod-guard/">
        <img src="./doc/firefox-install-badge.png" alt="Install on Firefox" />
    </a>
</p>

## Showcase

What follows are the available warnings that can be shown on websites.

<table>
  <tr>
    <th>Top Banner</th>
    <th>Bottom Banner</th>
    <th>Border</th>
  </tr>
  <tr>
    <td><img src="doc/top-banner-showcase.png" alt="Website with a top banner warning"/></td>
    <td><img src="doc/bottom-banner-showcase.png" alt="Website with a bottom banner warning"/></td>
    <td><img src="doc/border-showcase.png" alt="Website with a border warning"/></td>
  </tr>
</table>

## Usage

Adding a warning to a site is very simple.

1.  Open click on the Prod Guard icon in your browser to open the settings.

    ![home screen showing that no warnings are configured](doc/empty-home-screen.png)

1.  Click on __New Warning__ in the top right corner.

1.  Fill in the details for the site of your choice.

    ![new warning screen](doc/new-warning-screen.png)

1.  Click on __Save__.

1.  Open or refresh the page you want to see a warning on. You should now see a
    warning.
