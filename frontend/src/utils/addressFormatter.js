/**
 * Combines structured delivery address parts into a standard single address string
 * Format: [House Address], [Street], [Area/Landmark], [City], [State] - [PIN], [Country]
 */
export const formatDeliveryAddress = ({
  house = '',
  street = '',
  area = '',
  city = '',
  state = '',
  pin = '',
  country = 'India',
}) => {
  const parts = [];

  if (house && house.trim()) parts.push(house.trim());
  if (street && street.trim()) parts.push(street.trim());
  if (area && area.trim()) parts.push(area.trim());

  let cityStatePin = '';
  if (city && city.trim()) cityStatePin += city.trim();
  if (state && state.trim()) cityStatePin += (cityStatePin ? ', ' : '') + state.trim();
  if (pin && pin.trim()) cityStatePin += (cityStatePin ? ' - ' : '') + pin.trim();

  if (cityStatePin) parts.push(cityStatePin);
  if (country && country.trim()) parts.push(country.trim());

  return parts.join(', ');
};

/**
 * Attempts to parse an existing combined address string into structured parts
 */
export const parseDeliveryAddress = (addressStr) => {
  const defaultFields = {
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  };

  if (!addressStr || typeof addressStr !== 'string') return defaultFields;

  const raw = addressStr.trim();
  const segments = raw.split(',').map((s) => s.trim()).filter(Boolean);

  if (segments.length === 0) return defaultFields;

  // If already in 5-7 segments
  if (segments.length >= 4) {
    // Check if last segment is country
    const lastSeg = segments[segments.length - 1];
    const isCountry = /india|bharat/i.test(lastSeg);

    // Look for PIN code in segments (6 digit number)
    let pinFound = '';
    segments.forEach((seg) => {
      const match = seg.match(/\b\d{6}\b/);
      if (match) pinFound = match[0];
    });

    return {
      house: segments[0] || '',
      street: segments[1] || '',
      area: segments[2] || '',
      city: segments[3] ? segments[3].replace(/ - \d{6}/, '').replace(/\b\d{6}\b/, '').trim() : '',
      state: segments[4] ? segments[4].replace(/ - \d{6}/, '').replace(/\b\d{6}\b/, '').trim() : '',
      pin: pinFound,
      country: isCountry ? lastSeg : 'India',
    };
  }

  // Fallback: put first part in house/street, pin search
  const pinMatch = raw.match(/\b\d{6}\b/);
  return {
    ...defaultFields,
    house: segments[0] || raw,
    street: segments[1] || '',
    pin: pinMatch ? pinMatch[0] : '',
  };
};
