// Start the app once every module has loaded.
// A first visit starts at setup, so testers see their own baby, not the example.
let hasProfile = false;
try { hasProfile = !!localStorage.getItem('ahead-v2-profile'); } catch (e) {}
month = actualMonth();
if (!hasProfile) page = 'welcome';
render();
