# Contentful Type Generator

This takes majority of the legwork out of the process but since I'm flattening the data it requires some manual edits.
- Need to go through the output and change all `I<something>` references in nested Content Types with `I<something>Field`.
- The Asset import needs to be deleted so ESLint doesn't flag it.
