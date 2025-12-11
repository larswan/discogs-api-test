# Project Planning

This document tracks planned features, improvements, and tasks for the Discogs API test project.

## Todo

- [ ] **Improved Loading Display**

  - While loading the results for the next screen the app should use some sexy library to show a loading animation and say "Pulling Results for [insert query title]'

- [ ] **Release or Musician Image Display**

  - Pull and display artist/contributor images from Discogs on the musician and contributor pages
  - Apply the same styles currently used for album art on the AlbumDisplay page
  - Ensure consistent visual presentation across album and artist pages

- [ ] **Wikipedia Summary Feature (AI-Powered Inspirations)**
  - Create button that appears underneath the albumInfo block (only when Wikipedia article exists for release)
  - Button design: Include Wikipedia logo icon and text "Summarize Inspirations"
  - Research AI options and costs:
    - Evaluate open-source/low-compute options (e.g., Deep Seek) and server hosting costs
    - Evaluate connected services (OpenAI, Anthropic, etc.) and their pricing models
    - Decide on best solution considering hosting constraints and budget
  - Implementation:
    - AI reads Wikipedia article and extracts:
      - Direct musical inspirations
      - Cover versions mentioned
      - Notable contributors listed
    - Display as a formatted summary
    - Create hyperlinks to artists/releases within the app
    - Links should navigate to artist or album results display pulling Discogs info
    - Keep users in the app workflow
  - Phase 2:
    - Check if artist has Wikipedia page
    - Parse artist Wikipedia page for inspirations
    - Display as separate summary feature

## In Progress

- [ ]

## Completed

- [ ]

## Ideas & Future Considerations

- How can this app be connected to different streaming services? can this be used as the OAuth to create users and get access to their accounts to create playlists based on their findings in the app?
- How can we create a Queue of songs or releases found that a user could then port to a streaming platform?
- Within this queue I'd like to add a tag of the summary of connection or pathway from the queried release/artist to the resulting artist. This should display both as a simple paht ex: 'You Searched "Birth fo the Cool" by Miles Davis" > Charlie Parker played on "Move" > Added "Bird and Diz" 1952 to your List'. There should also be an AI summarized summary of the connection in natural language compiling the findings from Wikipedia or other articles we end up querying.

## Notes

- (Add notes here)
