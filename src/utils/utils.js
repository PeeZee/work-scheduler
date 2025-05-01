/**
 * Utility funkce pro získání CSS třídy podle ID skupiny.
 * @param {number} groupId - ID skupiny.
 * @returns {string} - Název CSS třídy.
 */
export function getClassByGroupId(groupId) {
  switch (groupId) {
    case 1:
      return 'servis'
    case 2:
      return 'store'
    case 3:
      return 'park'
    case 4:
      return 'notes'
    case 5:
      return 'educ'
    default:
      return 'default'
  }
}

/**
 * Další případná pomocná funkce.
 * Převádí datum na formátovaný řetězec.
 * @param {Date} date - Datum, které chcete formátovat.
 * @returns {string} - Formátovaný řetězec ve stylu "DD.MM.RRRR".
 */
export function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('cs-CZ', options)
}

/**
 * Kontrola, zda je vstup číslo.
 * @param {any} value - Hodnota pro kontrolu.
 * @returns {boolean} - True, pokud je číslo, jinak false.
 */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value)
}
/**
 * Formátuje datum z "YYYY-MM-DD" na "DD.MM.YYYY".
 * @param {string} dateString - Datum ve formátu "YYYY-MM-DD".
 * @returns {string} - Formátovaný datum ve stylu "DD.MM.YYYY".
 */
export function formatDateCZ(dateString) {
  if (!dateString) return '' // Pokud je datum prázdné

  const [year, month, day] = dateString.split('-') // Rozdělení řetězce
  return `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}` // Sestavení ve formátu "DD.MM.YYYY"
}
/**
 * Formátuje datum z "YYYY-MM-DD" na "DD. [měsíc slovy] YYYY".
 * @param {string} dateString - Datum ve formátu "YYYY-MM-DD".
 * @returns {string} - Formátované datum ve stylu "DD. [měsíc slovy] YYYY".
 */
export function formatDateVerbose(dateString) {
  if (!dateString) return '' // Pokud je datum prázdné

  const months = [
    'ledna',
    'února',
    'března',
    'dubna',
    'května',
    'června',
    'července',
    'srpna',
    'září',
    'října',
    'listopadu',
    'prosince',
  ]

  const [year, month, day] = dateString.split('-') // Rozdělení řetězce
  return `${parseInt(day, 10)}. ${months[parseInt(month, 10) - 1]} ${year}`
}
/**
 * Zjišťuje název dne v týdnu z datumu.
 * @param {string} dateString - Datum ve formátu "YYYY-MM-DD".
 * @returns {string} - Název dne v týdnu (např. "Pondělí").
 */
export function getDayName(dateString) {
  if (!dateString) return '' // Pokud je datum prázdné

  const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']

  const date = new Date(dateString) // Převede na objekt Date
  return days[date.getDay()] // Vrátí název dne
}
export function zeroFirst(number) {
  return number < 10 ? '0' + number : number
}
