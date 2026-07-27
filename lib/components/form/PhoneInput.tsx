'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import ReactCountryFlag from 'react-country-flag';

export interface PhoneInputProps {
  /** Controlled value (full number including country code prefix) */
  value?: string;
  onChange?: (value: string) => void;
  /** Show country code selector */
  showCountryCode?: boolean;
  /** Show the country flag SVG */
  showCountryFlag?: boolean;
  /** Default country calling code e.g. "+234". When multiple countries share
   *  the same code (e.g. "+1"), prefer `defaultCountry` for an exact match. */
  defaultCountryCode?: string;
  /** Default country ISO 3166-1 alpha-2 code (e.g. "US", "NG"). Takes
   *  precedence over `defaultCountryCode` and avoids ambiguity for shared
   *  calling codes such as +1 (NANP) or +7 (Russia/Kazakhstan). */
  defaultCountry?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  isDisabled?: boolean;
  id?: string;
}

/**
 * For calling codes shared by multiple countries, map to the canonical/primary
 * country so that `defaultCountryCode`-only lookup returns the expected result.
 * Consumers can always override via the `defaultCountry` (ISO) prop.
 */
const CANONICAL_COUNTRY_FOR_CODE: Record<string, string> = {
  '+1': 'US', // NANP: many Caribbean/Pacific territories share +1
  '+7': 'RU', // Russia & Kazakhstan
  '+39': 'IT', // Italy & Vatican City
  '+44': 'GB', // UK, Guernsey, Isle of Man, Jersey
  '+47': 'NO', // Norway & Svalbard
  '+212': 'MA', // Morocco & Western Sahara
  '+262': 'RE', // Réunion, Mayotte
  '+290': 'SH', // Saint Helena
  '+358': 'FI', // Finland & Åland Islands
  '+590': 'GP', // Guadeloupe, Saint Barthélemy, Saint Martin
  '+599': 'CW', // Curaçao & Bonaire
};

const COUNTRY_CODES = [
  { country: 'AF', code: '+93', flag: '🇦🇫' },
  { country: 'AL', code: '+355', flag: '🇦🇱' },
  { country: 'DZ', code: '+213', flag: '🇩🇿' },
  { country: 'AS', code: '+1', flag: '🇦🇸' },
  { country: 'AD', code: '+376', flag: '🇦🇩' },
  { country: 'AO', code: '+244', flag: '🇦🇴' },
  { country: 'AI', code: '+1', flag: '🇦🇮' },
  { country: 'AG', code: '+1', flag: '🇦🇬' },
  { country: 'AR', code: '+54', flag: '🇦🇷' },
  { country: 'AM', code: '+374', flag: '🇦🇲' },
  { country: 'AW', code: '+297', flag: '🇦🇼' },
  { country: 'AU', code: '+61', flag: '🇦🇺' },
  { country: 'AT', code: '+43', flag: '🇦🇹' },
  { country: 'AZ', code: '+994', flag: '🇦🇿' },
  { country: 'BS', code: '+1', flag: '🇧🇸' },
  { country: 'BH', code: '+973', flag: '🇧🇭' },
  { country: 'BD', code: '+880', flag: '🇧🇩' },
  { country: 'BB', code: '+1', flag: '🇧🇧' },
  { country: 'BY', code: '+375', flag: '🇧🇾' },
  { country: 'BE', code: '+32', flag: '🇧🇪' },
  { country: 'BZ', code: '+501', flag: '🇧🇿' },
  { country: 'BJ', code: '+229', flag: '🇧🇯' },
  { country: 'BM', code: '+1', flag: '🇧🇲' },
  { country: 'BT', code: '+975', flag: '🇧🇹' },
  { country: 'BO', code: '+591', flag: '🇧🇴' },
  { country: 'BA', code: '+387', flag: '🇧🇦' },
  { country: 'BW', code: '+267', flag: '🇧🇼' },
  { country: 'BR', code: '+55', flag: '🇧🇷' },
  { country: 'IO', code: '+246', flag: '🇮🇴' },
  { country: 'VG', code: '+1', flag: '🇻🇬' },
  { country: 'BN', code: '+673', flag: '🇧🇳' },
  { country: 'BG', code: '+359', flag: '🇧🇬' },
  { country: 'BF', code: '+226', flag: '🇧🇫' },
  { country: 'BI', code: '+257', flag: '🇧🇮' },
  { country: 'KH', code: '+855', flag: '🇰🇭' },
  { country: 'CM', code: '+237', flag: '🇨🇲' },
  { country: 'CA', code: '+1', flag: '🇨🇦' },
  { country: 'CV', code: '+238', flag: '🇨🇻' },
  { country: 'BQ', code: '+599', flag: '🇧🇶' },
  { country: 'KY', code: '+1', flag: '🇰🇾' },
  { country: 'CF', code: '+236', flag: '🇨🇫' },
  { country: 'TD', code: '+235', flag: '🇹🇩' },
  { country: 'CL', code: '+56', flag: '🇨🇱' },
  { country: 'CN', code: '+86', flag: '🇨🇳' },
  { country: 'CO', code: '+57', flag: '🇨🇴' },
  { country: 'KM', code: '+269', flag: '🇰🇲' },
  { country: 'CD', code: '+243', flag: '🇨🇩' },
  { country: 'CG', code: '+242', flag: '🇨🇬' },
  { country: 'CK', code: '+682', flag: '🇨🇰' },
  { country: 'CR', code: '+506', flag: '🇨🇷' },
  { country: 'HR', code: '+385', flag: '🇭🇷' },
  { country: 'CU', code: '+53', flag: '🇨🇺' },
  { country: 'CW', code: '+599', flag: '🇨🇼' },
  { country: 'CY', code: '+357', flag: '🇨🇾' },
  { country: 'CZ', code: '+420', flag: '🇨🇿' },
  { country: 'DK', code: '+45', flag: '🇩🇰' },
  { country: 'DJ', code: '+253', flag: '🇩🇯' },
  { country: 'DM', code: '+1', flag: '🇩🇲' },
  { country: 'DO', code: '+1', flag: '🇩🇴' },
  { country: 'EC', code: '+593', flag: '🇪🇨' },
  { country: 'EG', code: '+20', flag: '🇪🇬' },
  { country: 'SV', code: '+503', flag: '🇸🇻' },
  { country: 'GQ', code: '+240', flag: '🇬🇶' },
  { country: 'ER', code: '+291', flag: '🇪🇷' },
  { country: 'EE', code: '+372', flag: '🇪🇪' },
  { country: 'SZ', code: '+268', flag: '🇸🇿' },
  { country: 'ET', code: '+251', flag: '🇪🇹' },
  { country: 'FK', code: '+500', flag: '🇫🇰' },
  { country: 'FO', code: '+298', flag: '🇫🇴' },
  { country: 'FJ', code: '+679', flag: '🇫🇯' },
  { country: 'FI', code: '+358', flag: '🇫🇮' },
  { country: 'FR', code: '+33', flag: '🇫🇷' },
  { country: 'GF', code: '+594', flag: '🇬🇫' },
  { country: 'PF', code: '+689', flag: '🇵🇫' },
  { country: 'GA', code: '+241', flag: '🇬🇦' },
  { country: 'GM', code: '+220', flag: '🇬🇲' },
  { country: 'GE', code: '+995', flag: '🇬🇪' },
  { country: 'DE', code: '+49', flag: '🇩🇪' },
  { country: 'GH', code: '+233', flag: '🇬🇭' },
  { country: 'GI', code: '+350', flag: '🇬🇮' },
  { country: 'GR', code: '+30', flag: '🇬🇷' },
  { country: 'GL', code: '+299', flag: '🇬🇱' },
  { country: 'GD', code: '+1', flag: '🇬🇩' },
  { country: 'GP', code: '+590', flag: '🇬🇵' },
  { country: 'GU', code: '+1', flag: '🇬🇺' },
  { country: 'GT', code: '+502', flag: '🇬🇹' },
  { country: 'GG', code: '+44', flag: '🇬🇬' },
  { country: 'GN', code: '+224', flag: '🇬🇳' },
  { country: 'GW', code: '+245', flag: '🇬🇼' },
  { country: 'GY', code: '+592', flag: '🇬🇾' },
  { country: 'HT', code: '+509', flag: '🇭🇹' },
  { country: 'HN', code: '+504', flag: '🇭🇳' },
  { country: 'HK', code: '+852', flag: '🇭🇰' },
  { country: 'HU', code: '+36', flag: '🇭🇺' },
  { country: 'IS', code: '+354', flag: '🇮🇸' },
  { country: 'IN', code: '+91', flag: '🇮🇳' },
  { country: 'ID', code: '+62', flag: '🇮🇩' },
  { country: 'IR', code: '+98', flag: '🇮🇷' },
  { country: 'IQ', code: '+964', flag: '🇮🇶' },
  { country: 'IE', code: '+353', flag: '🇮🇪' },
  { country: 'IM', code: '+44', flag: '🇮🇲' },
  { country: 'IL', code: '+972', flag: '🇮🇱' },
  { country: 'IT', code: '+39', flag: '🇮🇹' },
  { country: 'CI', code: '+225', flag: '🇨🇮' },
  { country: 'JM', code: '+1', flag: '🇯🇲' },
  { country: 'JP', code: '+81', flag: '🇯🇵' },
  { country: 'JE', code: '+44', flag: '🇯🇪' },
  { country: 'JO', code: '+962', flag: '🇯🇴' },
  { country: 'KZ', code: '+7', flag: '🇰🇿' },
  { country: 'KE', code: '+254', flag: '🇰🇪' },
  { country: 'KI', code: '+686', flag: '🇰🇮' },
  { country: 'XK', code: '+383', flag: '🇽🇰' },
  { country: 'KW', code: '+965', flag: '🇰🇼' },
  { country: 'KG', code: '+996', flag: '🇰🇬' },
  { country: 'LA', code: '+856', flag: '🇱🇦' },
  { country: 'LV', code: '+371', flag: '🇱🇻' },
  { country: 'LB', code: '+961', flag: '🇱🇧' },
  { country: 'LS', code: '+266', flag: '🇱🇸' },
  { country: 'LR', code: '+231', flag: '🇱🇷' },
  { country: 'LY', code: '+218', flag: '🇱🇾' },
  { country: 'LI', code: '+423', flag: '🇱🇮' },
  { country: 'LT', code: '+370', flag: '🇱🇹' },
  { country: 'LU', code: '+352', flag: '🇱🇺' },
  { country: 'MO', code: '+853', flag: '🇲🇴' },
  { country: 'MK', code: '+389', flag: '🇲🇰' },
  { country: 'MG', code: '+261', flag: '🇲🇬' },
  { country: 'MW', code: '+265', flag: '🇲🇼' },
  { country: 'MY', code: '+60', flag: '🇲🇾' },
  { country: 'MV', code: '+960', flag: '🇲🇻' },
  { country: 'ML', code: '+223', flag: '🇲🇱' },
  { country: 'MT', code: '+356', flag: '🇲🇹' },
  { country: 'MH', code: '+692', flag: '🇲🇭' },
  { country: 'MQ', code: '+596', flag: '🇲🇶' },
  { country: 'MR', code: '+222', flag: '🇲🇷' },
  { country: 'MU', code: '+230', flag: '🇲🇺' },
  { country: 'YT', code: '+262', flag: '🇾🇹' },
  { country: 'MX', code: '+52', flag: '🇲🇽' },
  { country: 'FM', code: '+691', flag: '🇫🇲' },
  { country: 'MD', code: '+373', flag: '🇲🇩' },
  { country: 'MC', code: '+377', flag: '🇲🇨' },
  { country: 'MN', code: '+976', flag: '🇲🇳' },
  { country: 'ME', code: '+382', flag: '🇲🇪' },
  { country: 'MS', code: '+1', flag: '🇲🇸' },
  { country: 'MA', code: '+212', flag: '🇲🇦' },
  { country: 'MZ', code: '+258', flag: '🇲🇿' },
  { country: 'MM', code: '+95', flag: '🇲🇲' },
  { country: 'NA', code: '+264', flag: '🇳🇦' },
  { country: 'NR', code: '+674', flag: '🇳🇷' },
  { country: 'NP', code: '+977', flag: '🇳🇵' },
  { country: 'NL', code: '+31', flag: '🇳🇱' },
  { country: 'NC', code: '+687', flag: '🇳🇨' },
  { country: 'NZ', code: '+64', flag: '🇳🇿' },
  { country: 'NI', code: '+505', flag: '🇳🇮' },
  { country: 'NE', code: '+227', flag: '🇳🇪' },
  { country: 'NG', code: '+234', flag: '🇳🇬' },
  { country: 'NU', code: '+683', flag: '🇳🇺' },
  { country: 'NF', code: '+672', flag: '🇳🇫' },
  { country: 'KP', code: '+850', flag: '🇰🇵' },
  { country: 'MP', code: '+1', flag: '🇲🇵' },
  { country: 'NO', code: '+47', flag: '🇳🇴' },
  { country: 'OM', code: '+968', flag: '🇴🇲' },
  { country: 'PK', code: '+92', flag: '🇵🇰' },
  { country: 'PW', code: '+680', flag: '🇵🇼' },
  { country: 'PS', code: '+970', flag: '🇵🇸' },
  { country: 'PA', code: '+507', flag: '🇵🇦' },
  { country: 'PG', code: '+675', flag: '🇵🇬' },
  { country: 'PY', code: '+595', flag: '🇵🇾' },
  { country: 'PE', code: '+51', flag: '🇵🇪' },
  { country: 'PH', code: '+63', flag: '🇵🇭' },
  { country: 'PL', code: '+48', flag: '🇵🇱' },
  { country: 'PT', code: '+351', flag: '🇵🇹' },
  { country: 'PR', code: '+1', flag: '🇵🇷' },
  { country: 'QA', code: '+974', flag: '🇶🇦' },
  { country: 'RE', code: '+262', flag: '🇷🇪' },
  { country: 'RO', code: '+40', flag: '🇷🇴' },
  { country: 'RU', code: '+7', flag: '🇷🇺' },
  { country: 'RW', code: '+250', flag: '🇷🇼' },
  { country: 'WS', code: '+685', flag: '🇼🇸' },
  { country: 'SM', code: '+378', flag: '🇸🇲' },
  { country: 'ST', code: '+239', flag: '🇸🇹' },
  { country: 'SA', code: '+966', flag: '🇸🇦' },
  { country: 'SN', code: '+221', flag: '🇸🇳' },
  { country: 'RS', code: '+381', flag: '🇷🇸' },
  { country: 'SC', code: '+248', flag: '🇸🇨' },
  { country: 'SL', code: '+232', flag: '🇸🇱' },
  { country: 'SG', code: '+65', flag: '🇸🇬' },
  { country: 'SX', code: '+1', flag: '🇸🇽' },
  { country: 'SK', code: '+421', flag: '🇸🇰' },
  { country: 'SI', code: '+386', flag: '🇸🇮' },
  { country: 'SB', code: '+677', flag: '🇸🇧' },
  { country: 'SO', code: '+252', flag: '🇸🇴' },
  { country: 'ZA', code: '+27', flag: '🇿🇦' },
  { country: 'KR', code: '+82', flag: '🇰🇷' },
  { country: 'SS', code: '+211', flag: '🇸🇸' },
  { country: 'ES', code: '+34', flag: '🇪🇸' },
  { country: 'LK', code: '+94', flag: '🇱🇰' },
  { country: 'BL', code: '+590', flag: '🇧🇱' },
  { country: 'SH', code: '+290', flag: '🇸🇭' },
  { country: 'KN', code: '+1', flag: '🇰🇳' },
  { country: 'LC', code: '+1', flag: '🇱🇨' },
  { country: 'MF', code: '+590', flag: '🇲🇫' },
  { country: 'PM', code: '+508', flag: '🇵🇲' },
  { country: 'VC', code: '+1', flag: '🇻🇨' },
  { country: 'SD', code: '+249', flag: '🇸🇩' },
  { country: 'SR', code: '+597', flag: '🇸🇷' },
  { country: 'SJ', code: '+47', flag: '🇸🇯' },
  { country: 'SE', code: '+46', flag: '🇸🇪' },
  { country: 'CH', code: '+41', flag: '🇨🇭' },
  { country: 'SY', code: '+963', flag: '🇸🇾' },
  { country: 'TW', code: '+886', flag: '🇹🇼' },
  { country: 'TJ', code: '+992', flag: '🇹🇯' },
  { country: 'TZ', code: '+255', flag: '🇹🇿' },
  { country: 'TH', code: '+66', flag: '🇹🇭' },
  { country: 'TG', code: '+228', flag: '🇹🇬' },
  { country: 'TK', code: '+690', flag: '🇹🇰' },
  { country: 'TO', code: '+676', flag: '🇹🇴' },
  { country: 'TT', code: '+1', flag: '🇹🇹' },
  { country: 'TN', code: '+216', flag: '🇹🇳' },
  { country: 'TR', code: '+90', flag: '🇹🇷' },
  { country: 'TM', code: '+993', flag: '🇹🇲' },
  { country: 'TC', code: '+1', flag: '🇹🇨' },
  { country: 'TV', code: '+688', flag: '🇹🇻' },
  { country: 'VI', code: '+1', flag: '🇻🇮' },
  { country: 'UG', code: '+256', flag: '🇺🇬' },
  { country: 'UA', code: '+380', flag: '🇺🇦' },
  { country: 'AE', code: '+971', flag: '🇦🇪' },
  { country: 'GB', code: '+44', flag: '🇬🇧' },
  { country: 'US', code: '+1', flag: '🇺🇸' },
  { country: 'UY', code: '+598', flag: '🇺🇾' },
  { country: 'UZ', code: '+998', flag: '🇺🇿' },
  { country: 'VU', code: '+678', flag: '🇻🇺' },
  { country: 'VA', code: '+39', flag: '🇻🇦' },
  { country: 'VE', code: '+58', flag: '🇻🇪' },
  { country: 'VN', code: '+84', flag: '🇻🇳' },
  { country: 'WF', code: '+681', flag: '🇼🇫' },
  { country: 'EH', code: '+212', flag: '🇪🇭' },
  { country: 'YE', code: '+967', flag: '🇾🇪' },
  { country: 'ZM', code: '+260', flag: '🇿🇲' },
  { country: 'ZW', code: '+263', flag: '🇿🇼' },
  { country: 'AX', code: '+358', flag: '🇦🇽' },
];

/**
 * MedixDeck PhoneInput
 *
 * Phone number input with country code selector (defaults to Nigeria +234).
 * Colors use CSS custom properties (--medix-form-*) that cascade from any
 * .dark ancestor, so dark mode works without any JS theme hook.
 *
 * @example
 * ```tsx
 * // Nigeria (default)
 * <PhoneInput
 *   label="Phone number"
 *   placeholder="80 000 0000"
 *   defaultCountryCode="+234"
 *   onChange={(val) => setValue(val)}
 * />
 *
 * // US (unambiguous ISO override — avoids picking AS for the shared +1 code)
 * <PhoneInput
 *   label="Phone number"
 *   defaultCountry="US"
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export function PhoneInput({
  value = '',
  onChange,
  showCountryCode = true,
  showCountryFlag = true,
  defaultCountryCode = '+234',
  defaultCountry,
  placeholder = '80 000 0000',
  isInvalid = false,
  errorMessage,
  label,
  helperText,
  isDisabled = false,
  id,
}: PhoneInputProps) {
  const fallbackId = React.useId();
  const inputId = id ?? fallbackId;

  // Resolve the initial country object. Priority:
  // 1. Explicit ISO code via `defaultCountry` prop (unambiguous).
  // 2. Canonical country for the given calling code (avoids picking e.g. AS
  //    for +1 instead of US).
  // 3. First country that matches the calling code (covers unique codes).
  // 4. Nigeria (library default) → fallback to first entry.
  const canonicalISO =
    defaultCountry ??
    (defaultCountryCode ? CANONICAL_COUNTRY_FOR_CODE[defaultCountryCode] : undefined);
  const defaultCountryObj =
    (canonicalISO ? COUNTRY_CODES.find((c) => c.country === canonicalISO) : undefined) ??
    COUNTRY_CODES.find((c) => c.code === defaultCountryCode) ??
    COUNTRY_CODES.find((c) => c.country === 'NG') ??
    COUNTRY_CODES[0];
  const [selectedCountryId, setSelectedCountryId] = React.useState(defaultCountryObj.country);
  const [localNumber, setLocalNumber] = React.useState(value);
  const [isFocused, setIsFocused] = React.useState(false);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.country === selectedCountryId) ?? defaultCountryObj;

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    setLocalNumber(raw);
    onChange?.(`${selectedCountry.code}${raw.replace(/\s/g, '')}`);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryId = e.target.value;
    setSelectedCountryId(newCountryId);
    const newCountry = COUNTRY_CODES.find((c) => c.country === newCountryId) ?? defaultCountryObj;
    onChange?.(`${newCountry.code}${localNumber.replace(/\s/g, '')}`);
  };

  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isFocused
      ? '#0685FF'
      : 'var(--medix-form-border)';

  const boxShadow = 'none';

  return (
    <Box w="100%">
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--medix-form-text)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {label}
        </label>
      )}

      {/*
        Outer wrapper: background and border use CSS vars so they
        automatically switch when a .dark ancestor class is present.
      */}
      <Box
        display="flex"
        alignItems="center"
        overflow="hidden"
        borderRadius="10px"
        transition="border-color 0.15s, box-shadow 0.15s"
        opacity={isDisabled ? 0.5 : 1}
        pointerEvents={isDisabled ? 'none' : undefined}
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow,
          background: 'var(--medix-form-bg)',
        }}
      >
        {showCountryCode && (
          <label
            htmlFor={`${inputId}-country`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 12px',
              /* subtle bg separates the flag/code from the number input */
              background: 'var(--medix-form-bg-subtle)',
              borderRight: '1px solid var(--medix-form-border)',
              cursor: 'pointer',
              flexShrink: 0,
              minWidth: '80px',
            }}
          >
            {showCountryFlag && (
              <Box display="flex" alignItems="center" fontSize="lg" lineHeight="1">
                <ReactCountryFlag
                  countryCode={selectedCountry.country}
                  svg
                  style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}
                />
              </Box>
            )}
            <select
              id={`${inputId}-country`}
              value={selectedCountryId}
              onChange={handleCountryChange}
              aria-label="Country code"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                color: 'var(--medix-form-text)',
                cursor: 'pointer',
                width: '42px',
              }}
            >
              {COUNTRY_CODES.map((c) => (
                <option
                  key={c.country}
                  value={c.country}
                  style={{
                    background: 'var(--medix-form-bg)',
                    color: 'var(--medix-form-text)',
                  }}
                >
                  {c.code}
                </option>
              ))}
            </select>
          </label>
        )}

        <input
          id={inputId}
          type="tel"
          value={localNumber}
          onChange={handleLocalChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '15px',
            fontFamily: 'var(--font-body)',
            color: 'var(--medix-form-text)',
            padding: '10px 16px',
            minWidth: 0,
          }}
        />
      </Box>

      {(helperText || errorMessage) && (
        <Text
          mt="1.5"
          fontSize="xs"
          color={isInvalid ? 'red.500' : 'text.muted'}
          fontFamily="var(--font-body)"
        >
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
