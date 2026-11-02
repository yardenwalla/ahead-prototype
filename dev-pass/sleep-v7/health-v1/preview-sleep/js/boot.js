// Start the app once every module has loaded.
// A first visit starts at setup, so testers see their own baby, not the example.
let hasProfile = false;
try {
  const savedProfile = JSON.parse(localStorage.getItem('ahead-v2-profile'));
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(parse(value).getTime()) && iso(parse(value)) === value;
  hasProfile = !!savedProfile && validDate(savedProfile.dob) && savedProfile.dob <= iso(NOW) &&
    (!savedProfile.early || validDate(savedProfile.due) && savedProfile.due >= savedProfile.dob);
  if (hasProfile) {
    profile = {...savedProfile, name: typeof savedProfile.name === 'string' ? capName(savedProfile.name) : '',
      pronouns: ['he','she','they'].includes(savedProfile.pronouns) ? savedProfile.pronouns : 'they',
      feed: ['Breast milk','Formula','Both','Prefer not to say'].includes(savedProfile.feed) ? savedProfile.feed : 'Prefer not to say'};
  }
} catch (e) {}
// Preserve stored data for recovery; malformed details must not produce a blank screen.
if (!hasProfile) profile = {...demo};
month = actualMonth();
if (!hasProfile) page = 'welcome';
render();

