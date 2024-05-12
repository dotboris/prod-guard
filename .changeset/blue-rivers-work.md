---
"prod-guard": patch
---

Set minimum version of Chrome to 121. This is the first version of Chrome that ignores the `background.scripts` property in `manifest.json`. We need this property to be ignored because we distribute this extension in Firefox which requires this key.
