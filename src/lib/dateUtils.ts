/**
 * Utilitaires pour la gestion des dates au format français
 */

/**
 * Formate une date au format français JJ/MM/AAAA
 * @param date - Date à formater (string, Date, ou timestamp)
 * @returns Date formatée en JJ/MM/AAAA
 */
export const formatDateFR = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('Erreur lors du formatage de la date:', error);
    return '';
  }
};

/**
 * Formate une date avec l'heure au format français JJ/MM/AAAA HH:mm
 * @param date - Date à formater
 * @returns Date formatée en JJ/MM/AAAA HH:mm
 */
export const formatDateTimeFR = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.warn('Erreur lors du formatage de la date avec heure:', error);
    return '';
  }
};

/**
 * Convertit une date du format JJ/MM/AAAA vers ISO string
 * @param frenchDate - Date au format JJ/MM/AAAA
 * @returns Date ISO string
 */
export const parseFrenchDate = (frenchDate: string): string => {
  if (!frenchDate) return '';
  
  try {
    const parts = frenchDate.split('/');
    if (parts.length !== 3) return '';
    
    const [day, month, year] = parts;
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.warn('Erreur lors de la conversion de la date française:', error);
    return '';
  }
};

/**
 * Formate une date relative (il y a X jours, etc.)
 * @param date - Date à comparer
 * @returns Texte relatif en français
 */
export const formatRelativeDateFR = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Il y a ${months} mois`;
    }
    
    const years = Math.floor(diffDays / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  } catch (error) {
    console.warn('Erreur lors du formatage de la date relative:', error);
    return formatDateFR(date);
  }
};

/**
 * Obtient la date actuelle au format français
 * @returns Date du jour en JJ/MM/AAAA
 */
export const getCurrentDateFR = (): string => {
  return formatDateFR(new Date());
};

/**
 * Vérifie si une date est valide
 * @param date - Date à vérifier
 * @returns true si la date est valide
 */
export const isValidDate = (date: string | Date | number): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};

/**
 * Formate une période (date de début - date de fin)
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Période formatée
 */
export const formatPeriodFR = (startDate: string | Date | number, endDate: string | Date | number): string => {
  const start = formatDateFR(startDate);
  const end = formatDateFR(endDate);
  
  if (!start && !end) return '';
  if (!start) return `Jusqu'au ${end}`;
  if (!end) return `Depuis le ${start}`;
  
  return `${start} - ${end}`;
};

/**
 * Génère la date actuelle au format YYYY-MM-DD pour les inputs date
 * @returns Date actuelle au format YYYY-MM-DD
 */
export const getCurrentDateForInput = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Génère l'heure actuelle au format HH:MM pour les inputs time
 * @returns Heure actuelle au format HH:MM
 */
export const getCurrentTimeForInput = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

/**
 * Génère la date et l'heure actuelles au format datetime-local
 * @returns DateTime actuel au format YYYY-MM-DDTHH:MM
 */
export const getCurrentDateTimeForInput = (): string => {
  const now = new Date();
  // Format: YYYY-MM-DDTHH:MM
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Arrondit l'heure actuelle au quart d'heure supérieur
 * @returns Heure arrondie au format HH:MM
 */
export const getCurrentTimeRoundedUp = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  
  if (roundedMinutes >= 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }
  
  return now.toTimeString().slice(0, 5);
};

/**
 * Génère la date actuelle arrondie au quart d'heure supérieur pour les inputs datetime-local
 * @returns DateTime arrondi au format YYYY-MM-DDTHH:MM
 */
export const getCurrentDateTimeRoundedForInput = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  
  if (roundedMinutes >= 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${mins}`;
};
