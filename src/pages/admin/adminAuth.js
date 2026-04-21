const KEY = 'subrev_admin_auth';

export function adminLogin(password) {
  if (password === 'admin1409') {
    localStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(KEY);
}

export function isAdminAuthed() {
  return localStorage.getItem(KEY) === '1';
}
