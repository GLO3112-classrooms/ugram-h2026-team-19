export default function initials(firstname: string, lastname: string) {
  return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
}
