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
  /** Brand color scheme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
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

export interface CountryData {
  country: string;
  code: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryData[] = [
  { country: 'AF', code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { country: 'AL', code: '+355', name: 'Albania', flag: '🇦🇱' },
  { country: 'DZ', code: '+213', name: 'Algeria', flag: '🇩🇿' },
  { country: 'AS', code: '+1', name: 'American Samoa', flag: '🇦🇸' },
  { country: 'AD', code: '+376', name: 'Andorra', flag: '🇦🇩' },
  { country: 'AO', code: '+244', name: 'Angola', flag: '🇦🇴' },
  { country: 'AI', code: '+1', name: 'Anguilla', flag: '🇦🇮' },
  { country: 'AG', code: '+1', name: 'Antigua & Barbuda', flag: '🇦🇬' },
  { country: 'AR', code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { country: 'AM', code: '+374', name: 'Armenia', flag: '🇦🇲' },
  { country: 'AW', code: '+297', name: 'Aruba', flag: '🇦🇼' },
  { country: 'AU', code: '+61', name: 'Australia', flag: '🇦🇺' },
  { country: 'AT', code: '+43', name: 'Austria', flag: '🇦🇹' },
  { country: 'AZ', code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { country: 'BS', code: '+1', name: 'Bahamas', flag: '🇧🇸' },
  { country: 'BH', code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { country: 'BD', code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { country: 'BB', code: '+1', name: 'Barbados', flag: '🇧🇧' },
  { country: 'BY', code: '+375', name: 'Belarus', flag: '🇧🇾' },
  { country: 'BE', code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { country: 'BZ', code: '+501', name: 'Belize', flag: '🇧🇿' },
  { country: 'BJ', code: '+229', name: 'Benin', flag: '🇧🇯' },
  { country: 'BM', code: '+1', name: 'Bermuda', flag: '🇧🇲' },
  { country: 'BT', code: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { country: 'BO', code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { country: 'BA', code: '+387', name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
  { country: 'BW', code: '+267', name: 'Botswana', flag: '🇧🇼' },
  { country: 'BR', code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { country: 'IO', code: '+246', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { country: 'VG', code: '+1', name: 'British Virgin Islands', flag: '🇻🇬' },
  { country: 'BN', code: '+673', name: 'Brunei', flag: '🇧🇳' },
  { country: 'BG', code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { country: 'BF', code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { country: 'BI', code: '+257', name: 'Burundi', flag: '🇧🇮' },
  { country: 'KH', code: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { country: 'CM', code: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { country: 'CA', code: '+1', name: 'Canada', flag: '🇨🇦' },
  { country: 'CV', code: '+238', name: 'Cape Verde', flag: '🇨🇻' },
  { country: 'BQ', code: '+599', name: 'Caribbean Netherlands', flag: '🇧🇶' },
  { country: 'KY', code: '+1', name: 'Cayman Islands', flag: '🇰🇾' },
  { country: 'CF', code: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { country: 'TD', code: '+235', name: 'Chad', flag: '🇹🇩' },
  { country: 'CL', code: '+56', name: 'Chile', flag: '🇨🇱' },
  { country: 'CN', code: '+86', name: 'China', flag: '🇨🇳' },
  { country: 'CO', code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { country: 'KM', code: '+269', name: 'Comoros', flag: '🇰🇲' },
  { country: 'CD', code: '+243', name: 'DR Congo', flag: '🇨🇩' },
  { country: 'CG', code: '+242', name: 'Congo', flag: '🇨🇬' },
  { country: 'CK', code: '+682', name: 'Cook Islands', flag: '🇨🇰' },
  { country: 'CR', code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { country: 'HR', code: '+385', name: 'Croatia', flag: '🇭🇷' },
  { country: 'CU', code: '+53', name: 'Cuba', flag: '🇨🇺' },
  { country: 'CW', code: '+599', name: 'Curaçao', flag: '🇨🇼' },
  { country: 'CY', code: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { country: 'CZ', code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { country: 'DK', code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { country: 'DJ', code: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { country: 'DM', code: '+1', name: 'Dominica', flag: '🇩🇲' },
  { country: 'DO', code: '+1', name: 'Dominican Republic', flag: '🇩🇴' },
  { country: 'EC', code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { country: 'EG', code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { country: 'SV', code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { country: 'GQ', code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { country: 'ER', code: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { country: 'EE', code: '+372', name: 'Estonia', flag: '🇪🇪' },
  { country: 'SZ', code: '+268', name: 'Eswatini', flag: '🇸🇿' },
  { country: 'ET', code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { country: 'FK', code: '+500', name: 'Falkland Islands', flag: '🇫🇰' },
  { country: 'FO', code: '+298', name: 'Faroe Islands', flag: '🇫🇴' },
  { country: 'FJ', code: '+679', name: 'Fiji', flag: '🇫🇯' },
  { country: 'FI', code: '+358', name: 'Finland', flag: '🇫🇮' },
  { country: 'FR', code: '+33', name: 'France', flag: '🇫🇷' },
  { country: 'GF', code: '+594', name: 'French Guiana', flag: '🇬🇫' },
  { country: 'PF', code: '+689', name: 'French Polynesia', flag: '🇵🇫' },
  { country: 'GA', code: '+241', name: 'Gabon', flag: '🇬🇦' },
  { country: 'GM', code: '+220', name: 'Gambia', flag: '🇬🇲' },
  { country: 'GE', code: '+995', name: 'Georgia', flag: '🇬🇪' },
  { country: 'DE', code: '+49', name: 'Germany', flag: '🇩🇪' },
  { country: 'GH', code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { country: 'GI', code: '+350', name: 'Gibraltar', flag: '🇬🇮' },
  { country: 'GR', code: '+30', name: 'Greece', flag: '🇬🇷' },
  { country: 'GL', code: '+299', name: 'Greenland', flag: '🇬🇱' },
  { country: 'GD', code: '+1', name: 'Grenada', flag: '🇬🇩' },
  { country: 'GP', code: '+590', name: 'Guadeloupe', flag: '🇬🇵' },
  { country: 'GU', code: '+1', name: 'Guam', flag: '🇬🇺' },
  { country: 'GT', code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { country: 'GG', code: '+44', name: 'Guernsey', flag: '🇬🇬' },
  { country: 'GN', code: '+224', name: 'Guinea', flag: '🇬🇳' },
  { country: 'GW', code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { country: 'GY', code: '+592', name: 'Guyana', flag: '🇬🇾' },
  { country: 'HT', code: '+509', name: 'Haiti', flag: '🇭🇹' },
  { country: 'HN', code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { country: 'HK', code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { country: 'HU', code: '+36', name: 'Hungary', flag: '🇭🇺' },
  { country: 'IS', code: '+354', name: 'Iceland', flag: '🇮🇸' },
  { country: 'IN', code: '+91', name: 'India', flag: '🇮🇳' },
  { country: 'ID', code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { country: 'IR', code: '+98', name: 'Iran', flag: '🇮🇷' },
  { country: 'IQ', code: '+964', name: 'Iraq', flag: '🇮🇶' },
  { country: 'IE', code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { country: 'IM', code: '+44', name: 'Isle of Man', flag: '🇮🇲' },
  { country: 'IL', code: '+972', name: 'Israel', flag: '🇮🇱' },
  { country: 'IT', code: '+39', name: 'Italy', flag: '🇮🇹' },
  { country: 'CI', code: '+225', name: 'Ivory Coast', flag: '🇨🇮' },
  { country: 'JM', code: '+1', name: 'Jamaica', flag: '🇯🇲' },
  { country: 'JP', code: '+81', name: 'Japan', flag: '🇯🇵' },
  { country: 'JE', code: '+44', name: 'Jersey', flag: '🇯🇪' },
  { country: 'JO', code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { country: 'KZ', code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { country: 'KE', code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { country: 'KI', code: '+686', name: 'Kiribati', flag: '🇰🇮' },
  { country: 'XK', code: '+383', name: 'Kosovo', flag: '🇽🇰' },
  { country: 'KW', code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { country: 'KG', code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { country: 'LA', code: '+856', name: 'Laos', flag: '🇱🇦' },
  { country: 'LV', code: '+371', name: 'Latvia', flag: '🇱🇻' },
  { country: 'LB', code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { country: 'LS', code: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { country: 'LR', code: '+231', name: 'Liberia', flag: '🇱🇷' },
  { country: 'LY', code: '+218', name: 'Libya', flag: '🇱🇾' },
  { country: 'LI', code: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
  { country: 'LT', code: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { country: 'LU', code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { country: 'MO', code: '+853', name: 'Macao', flag: '🇲🇴' },
  { country: 'MK', code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
  { country: 'MG', code: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { country: 'MW', code: '+265', name: 'Malawi', flag: '🇲🇼' },
  { country: 'MY', code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { country: 'MV', code: '+960', name: 'Maldives', flag: '🇲🇻' },
  { country: 'ML', code: '+223', name: 'Mali', flag: '🇲🇱' },
  { country: 'MT', code: '+356', name: 'Malta', flag: '🇲🇹' },
  { country: 'MH', code: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
  { country: 'MQ', code: '+596', name: 'Martinique', flag: '🇲🇶' },
  { country: 'MR', code: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { country: 'MU', code: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { country: 'YT', code: '+262', name: 'Mayotte', flag: '🇾🇹' },
  { country: 'MX', code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { country: 'FM', code: '+691', name: 'Micronesia', flag: '🇫🇲' },
  { country: 'MD', code: '+373', name: 'Moldova', flag: '🇲🇩' },
  { country: 'MC', code: '+377', name: 'Monaco', flag: '🇲🇨' },
  { country: 'MN', code: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { country: 'ME', code: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { country: 'MS', code: '+1', name: 'Montserrat', flag: '🇲🇸' },
  { country: 'MA', code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { country: 'MZ', code: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { country: 'MM', code: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { country: 'NA', code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { country: 'NR', code: '+674', name: 'Nauru', flag: '🇳🇷' },
  { country: 'NP', code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { country: 'NL', code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { country: 'NC', code: '+687', name: 'New Caledonia', flag: '🇳🇨' },
  { country: 'NZ', code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { country: 'NI', code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { country: 'NE', code: '+227', name: 'Niger', flag: '🇳🇪' },
  { country: 'NG', code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { country: 'NU', code: '+683', name: 'Niue', flag: '🇳🇺' },
  { country: 'NF', code: '+672', name: 'Norfolk Island', flag: '🇳🇫' },
  { country: 'KP', code: '+850', name: 'North Korea', flag: '🇰🇵' },
  { country: 'MP', code: '+1', name: 'Northern Mariana Islands', flag: '🇲🇵' },
  { country: 'NO', code: '+47', name: 'Norway', flag: '🇳🇴' },
  { country: 'OM', code: '+968', name: 'Oman', flag: '🇴🇲' },
  { country: 'PK', code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { country: 'PW', code: '+680', name: 'Palau', flag: '🇵🇼' },
  { country: 'PS', code: '+970', name: 'Palestine', flag: '🇵🇸' },
  { country: 'PA', code: '+507', name: 'Panama', flag: '🇵🇦' },
  { country: 'PG', code: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { country: 'PY', code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { country: 'PE', code: '+51', name: 'Peru', flag: '🇵🇪' },
  { country: 'PH', code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { country: 'PL', code: '+48', name: 'Poland', flag: '🇵🇱' },
  { country: 'PT', code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { country: 'PR', code: '+1', name: 'Puerto Rico', flag: '🇵🇷' },
  { country: 'QA', code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { country: 'RE', code: '+262', name: 'Réunion', flag: '🇷🇪' },
  { country: 'RO', code: '+40', name: 'Romania', flag: '🇷🇴' },
  { country: 'RU', code: '+7', name: 'Russia', flag: '🇷🇺' },
  { country: 'RW', code: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { country: 'WS', code: '+685', name: 'Samoa', flag: '🇼🇸' },
  { country: 'SM', code: '+378', name: 'San Marino', flag: '🇸🇲' },
  { country: 'ST', code: '+239', name: 'São Tomé & Príncipe', flag: '🇸🇹' },
  { country: 'SA', code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { country: 'SN', code: '+221', name: 'Senegal', flag: '🇸🇳' },
  { country: 'RS', code: '+381', name: 'Serbia', flag: '🇷🇸' },
  { country: 'SC', code: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { country: 'SL', code: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { country: 'SG', code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { country: 'SX', code: '+1', name: 'Sint Maarten', flag: '🇸🇽' },
  { country: 'SK', code: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { country: 'SI', code: '+386', name: 'Slovenia', flag: '🇸🇮' },
  { country: 'SB', code: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
  { country: 'SO', code: '+252', name: 'Somalia', flag: '🇸🇴' },
  { country: 'ZA', code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { country: 'KR', code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { country: 'SS', code: '+211', name: 'South Sudan', flag: '🇸🇸' },
  { country: 'ES', code: '+34', name: 'Spain', flag: '🇪🇸' },
  { country: 'LK', code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { country: 'BL', code: '+590', name: 'Saint Barthélemy', flag: '🇧🇱' },
  { country: 'SH', code: '+290', name: 'Saint Helena', flag: '🇸🇭' },
  { country: 'KN', code: '+1', name: 'Saint Kitts & Nevis', flag: '🇰🇳' },
  { country: 'LC', code: '+1', name: 'Saint Lucia', flag: '🇱🇨' },
  { country: 'MF', code: '+590', name: 'Saint Martin', flag: '🇲🇫' },
  { country: 'PM', code: '+508', name: 'Saint Pierre & Miquelon', flag: '🇵🇲' },
  { country: 'VC', code: '+1', name: 'Saint Vincent & Grenadines', flag: '🇻🇨' },
  { country: 'SD', code: '+249', name: 'Sudan', flag: '🇸🇩' },
  { country: 'SR', code: '+597', name: 'Suriname', flag: '🇸🇷' },
  { country: 'SJ', code: '+47', name: 'Svalbard & Jan Mayen', flag: '🇸🇯' },
  { country: 'SE', code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { country: 'CH', code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { country: 'SY', code: '+963', name: 'Syria', flag: '🇸🇾' },
  { country: 'TW', code: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { country: 'TJ', code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { country: 'TZ', code: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { country: 'TH', code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { country: 'TG', code: '+228', name: 'Togo', flag: '🇹🇬' },
  { country: 'TK', code: '+690', name: 'Tokelau', flag: '🇹🇰' },
  { country: 'TO', code: '+676', name: 'Tonga', flag: '🇹🇴' },
  { country: 'TT', code: '+1', name: 'Trinidad & Tobago', flag: '🇹🇹' },
  { country: 'TN', code: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { country: 'TR', code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { country: 'TM', code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { country: 'TC', code: '+1', name: 'Turks & Caicos Islands', flag: '🇹🇨' },
  { country: 'TV', code: '+688', name: 'Tuvalu', flag: '🇹🇻' },
  { country: 'VI', code: '+1', name: 'US Virgin Islands', flag: '🇻🇮' },
  { country: 'UG', code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { country: 'UA', code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { country: 'AE', code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { country: 'GB', code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { country: 'US', code: '+1', name: 'United States', flag: '🇺🇸' },
  { country: 'UY', code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { country: 'UZ', code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { country: 'VU', code: '+678', name: 'Vanuatu', flag: '🇻🇺' },
  { country: 'VA', code: '+39', name: 'Vatican City', flag: '🇻🇦' },
  { country: 'VE', code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { country: 'VN', code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { country: 'WF', code: '+681', name: 'Wallis & Futuna', flag: '🇼🇫' },
  { country: 'EH', code: '+212', name: 'Western Sahara', flag: '🇪🇭' },
  { country: 'YE', code: '+967', name: 'Yemen', flag: '🇾🇪' },
  { country: 'ZM', code: '+260', name: 'Zambia', flag: '🇿🇲' },
  { country: 'ZW', code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
  { country: 'AX', code: '+358', name: 'Åland Islands', flag: '🇦🇽' },
];

/**
 * MedixDeck PhoneInput
 *
 * Phone number input with country code selector (defaults to Nigeria +234).
 * Features a searchable country picker dropdown with full country names.
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
  colorScheme = 'blue',
  isInvalid = false,
  errorMessage,
  label,
  helperText,
  isDisabled = false,
  id,
}: PhoneInputProps) {
  const fallbackId = React.useId();
  const inputId = id ?? fallbackId;

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
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [searchFilter, setSearchFilter] = React.useState('');

  const pickerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.country === selectedCountryId) ?? defaultCountryObj;

  // Close picker when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerOpen]);

  // Focus search input when open
  React.useEffect(() => {
    if (isPickerOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchFilter('');
    }
  }, [isPickerOpen]);

  // Real-time country filtering
  const filteredCountries = React.useMemo(() => {
    if (!searchFilter.trim()) return COUNTRY_CODES;
    const q = searchFilter.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [searchFilter]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    setLocalNumber(raw);
    onChange?.(`${selectedCountry.code}${raw.replace(/\s/g, '')}`);
  };

  const handleSelectCountry = (c: CountryData) => {
    setSelectedCountryId(c.country);
    onChange?.(`${c.code}${localNumber.replace(/\s/g, '')}`);
    setIsPickerOpen(false);
  };

  const focusColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';

  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isFocused || isPickerOpen
      ? focusColor
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

      {/* Outer wrapper */}
      <Box
        display="flex"
        alignItems="center"
        borderRadius="10px"
        transition="border-color 0.15s, box-shadow 0.15s"
        opacity={isDisabled ? 0.5 : 1}
        pointerEvents={isDisabled ? 'none' : undefined}
        position="relative"
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow,
          background: 'var(--medix-form-bg)',
        }}
      >
        {showCountryCode && (
          <Box position="relative" ref={pickerRef} h="full">
            <button
              id={`${inputId}-country`}
              type="button"
              onClick={() => !isDisabled && setIsPickerOpen(!isPickerOpen)}
              disabled={isDisabled}
              aria-label="Select country code"
              aria-expanded={isPickerOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                background: 'var(--medix-form-bg-subtle)',
                border: 'none',
                borderRight: '1px solid var(--medix-form-border)',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                height: '100%',
                color: 'var(--medix-form-text)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
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
              <span>{selectedCountry.code}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isPickerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease',
                  opacity: 0.7,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Floating Searchable Country List Dropdown */}
            {isPickerOpen && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                mt="2"
                w="280px"
                maxH="320px"
                bg="bg.surface"
                border="1px solid"
                borderColor="border"
                borderRadius="card"
                zIndex="popover"
                display="flex"
                flexDirection="column"
                overflow="hidden"
                boxShadow="none"
              >
                {/* Search Bar */}
                <Box
                  p="2.5"
                  color="text.heading"
                  borderBottom="1px solid"
                  borderColor="border"
                  bg="bg.surface"
                >
                  <Box color="text.heading" position="relative" display="flex" alignItems="center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        position: 'absolute',
                        left: '10px',
                        opacity: 0.5,
                        pointerEvents: 'none',
                      }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search country or code..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px 6px 30px',
                        fontSize: '13px',
                        fontFamily: 'var(--font-body)',
                        borderRadius: '6px',
                        border: '1px solid var(--medix-form-border)',
                        background: 'var(--medix-form-bg)',
                        color: 'var(--medix-form-text)',
                        outline: 'none',
                      }}
                    />
                  </Box>
                </Box>

                {/* Country Options List */}
                <Box overflowY="auto" flex="1" py="1">
                  {filteredCountries.length === 0 ? (
                    <Box px="4" py="3" fontSize="xs" color="text.muted" textAlign="center">
                      No country found
                    </Box>
                  ) : (
                    filteredCountries.map((c) => {
                      const isSelected = c.country === selectedCountry.country;
                      return (
                        <button
                          key={`${c.country}-${c.code}`}
                          type="button"
                          onClick={() => handleSelectCountry(c)}
                          style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 14px',
                            background: isSelected ? 'var(--medix-form-bg-subtle)' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            color: 'var(--medix-form-text)',
                            transition: 'background 0.1s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'var(--medix-form-bg-subtle)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = isSelected
                              ? 'var(--medix-form-bg-subtle)'
                              : 'transparent';
                          }}
                        >
                          <Box display="flex" alignItems="center" fontSize="md" flexShrink={0}>
                            <ReactCountryFlag
                              countryCode={c.country}
                              svg
                              style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}
                            />
                          </Box>
                          <Text flex="1" truncate fontWeight={isSelected ? '600' : '400'}>
                            {c.name}
                          </Text>
                          <Text fontSize="xs" color="text.muted" flexShrink={0}>
                            {c.code}
                          </Text>
                        </button>
                      );
                    })
                  )}
                </Box>
              </Box>
            )}
          </Box>
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
