---
"prod-guard": major
---

Migrate to Manifest v3

This is considered a **breaking change** because a change in the web extension
permission model might require some users to accept new permissions. To resolve
this, **simply open the Prod Guard popup**. If you have new permissions to
accept, you'll see a yellow warning guiding you through the process.

The permission in question is "Access data for all websites". We use this
permission to inject the warnings that you have configured. Note that this is
not a new permission. In Manifest v2, this permission was granted to use
automatically when you installed Prod Guard. In Manifest v3, browsers may no
longer grant this permission implicitly. From our testing, we've seen this
behavior in Firefox.
