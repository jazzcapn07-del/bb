"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

// Full list of countries with their flags and dial codes
const countries: Country[] = [
  { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "AS", dialCode: "+1684", flag: "🇦🇸" },
  { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "AI", dialCode: "+1264", flag: "🇦🇮" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1268", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", dialCode: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "AW", dialCode: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", dialCode: "+1242", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", dialCode: "+1246", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", dialCode: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", dialCode: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", dialCode: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "BM", dialCode: "+1441", flag: "🇧🇲" },
  { name: "Bhutan", code: "BT", dialCode: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", dialCode: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", dialCode: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "British Indian Ocean Territory", code: "IO", dialCode: "+246", flag: "🇮🇴" },
  { name: "Brunei Darussalam", code: "BN", dialCode: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", dialCode: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dialCode: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "KH", dialCode: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "CV", dialCode: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "KY", dialCode: "+1345", flag: "🇰🇾" },
  { name: "Central African Republic", code: "CF", dialCode: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "TD", dialCode: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "CX", dialCode: "+61", flag: "🇨🇽" },
  { name: "Cocos (Keeling) Islands", code: "CC", dialCode: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", dialCode: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "CG", dialCode: "+242", flag: "🇨🇬" },
  { name: "Congo, Democratic Republic of the", code: "CD", dialCode: "+243", flag: "🇨🇩" },
  { name: "Cook Islands", code: "CK", dialCode: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "CR", dialCode: "+506", flag: "🇨🇷" },
  { name: "Cote d'Ivoire", code: "CI", dialCode: "+225", flag: "🇨🇮" },
  { name: "Croatia", code: "HR", dialCode: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", dialCode: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", dialCode: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420", flag: "🇨🇿" },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", dialCode: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", dialCode: "+1767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1", flag: "🇩🇴" },
  { name: "Ecuador", code: "EC", dialCode: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", dialCode: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", dialCode: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", dialCode: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "ET", dialCode: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands (Malvinas)", code: "FK", dialCode: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "FO", dialCode: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "FJ", dialCode: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "French Guiana", code: "GF", dialCode: "+594", flag: "🇬🇫" },
  { name: "French Polynesia", code: "PF", dialCode: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "GA", dialCode: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dialCode: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", dialCode: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "GI", dialCode: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "GL", dialCode: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "GD", dialCode: "+1473", flag: "🇬🇩" },
  { name: "Guadeloupe", code: "GP", dialCode: "+590", flag: "🇬🇵" },
  { name: "Guam", code: "GU", dialCode: "+1671", flag: "🇬🇺" },
  { name: "Guatemala", code: "GT", dialCode: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", dialCode: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", dialCode: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", dialCode: "+509", flag: "🇭🇹" },
  { name: "Holy See (Vatican City State)", code: "VA", dialCode: "+379", flag: "🇻🇦" },
  { name: "Honduras", code: "HN", dialCode: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "HK", dialCode: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "HU", dialCode: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", dialCode: "+354", flag: "🇮🇸" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Iran, Islamic Republic of", code: "IR", dialCode: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", dialCode: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Jamaica", code: "JM", dialCode: "+1876", flag: "🇯🇲" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", dialCode: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", dialCode: "+686", flag: "🇰🇮" },
  { name: "Korea, Democratic People's Republic of", code: "KP", dialCode: "+850", flag: "🇰🇵" },
  { name: "Korea, Republic of", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996", flag: "🇰🇬" },
  { name: "Lao People's Democratic Republic", code: "LA", dialCode: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", dialCode: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", dialCode: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", dialCode: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dialCode: "+231", flag: "🇱🇷" },
  { name: "Libyan Arab Jamahiriya", code: "LY", dialCode: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", dialCode: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", dialCode: "+352", flag: "🇱🇺" },
  { name: "Macao", code: "MO", dialCode: "+853", flag: "🇲🇴" },
  { name: "Macedonia, the Former Yugoslav Republic of", code: "MK", dialCode: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "MG", dialCode: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dialCode: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", dialCode: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "ML", dialCode: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "MT", dialCode: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", dialCode: "+692", flag: "🇲🇭" },
  { name: "Martinique", code: "MQ", dialCode: "+596", flag: "🇲🇶" },
  { name: "Mauritania", code: "MR", dialCode: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dialCode: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "YT", dialCode: "+262", flag: "🇾🇹" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Micronesia, Federated States of", code: "FM", dialCode: "+691", flag: "🇫🇲" },
  { name: "Moldova, Republic of", code: "MD", dialCode: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", dialCode: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", dialCode: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", dialCode: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "MS", dialCode: "+1664", flag: "🇲🇸" },
  { name: "Morocco", code: "MA", dialCode: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", dialCode: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", dialCode: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", dialCode: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", dialCode: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Netherlands Antilles", code: "AN", dialCode: "+599", flag: "🇦🇳" },
  { name: "New Caledonia", code: "NC", dialCode: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", dialCode: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "NE", dialCode: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "Niue", code: "NU", dialCode: "+683", flag: "🇳🇺" },
  { name: "Norfolk Island", code: "NF", dialCode: "+672", flag: "🇳🇫" },
  { name: "Northern Mariana Islands", code: "MP", dialCode: "+1670", flag: "🇲🇵" },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "PW", dialCode: "+680", flag: "🇵🇼" },
  { name: "Palestinian Territory, Occupied", code: "PS", dialCode: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "PA", dialCode: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", dialCode: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", dialCode: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "PE", dialCode: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { name: "Pitcairn", code: "PN", dialCode: "+64", flag: "🇵🇳" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "PR", dialCode: "+1939", flag: "🇵🇷" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Reunion", code: "RE", dialCode: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "RO", dialCode: "+40", flag: "🇷🇴" },
  { name: "Russian Federation", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", dialCode: "+250", flag: "🇷🇼" },
  { name: "Saint Helena", code: "SH", dialCode: "+290", flag: "🇸🇭" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "+1869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", dialCode: "+1758", flag: "🇱🇨" },
  { name: "Saint Pierre and Miquelon", code: "PM", dialCode: "+508", flag: "🇵🇲" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dialCode: "+1784", flag: "🇻🇨" },
  { name: "Samoa", code: "WS", dialCode: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", dialCode: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", dialCode: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", dialCode: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", dialCode: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", dialCode: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", dialCode: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", dialCode: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", dialCode: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", dialCode: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "South Sudan", code: "SS", dialCode: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", dialCode: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", dialCode: "+597", flag: "🇸🇷" },
  { name: "Swaziland", code: "SZ", dialCode: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Syrian Arab Republic", code: "SY", dialCode: "+963", flag: "🇸🇾" },
  { name: "Taiwan, Province of China", code: "TW", dialCode: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", dialCode: "+992", flag: "🇹🇯" },
  { name: "Tanzania, United Republic of", code: "TZ", dialCode: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", dialCode: "+670", flag: "🇹🇱" },
  { name: "Togo", code: "TG", dialCode: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "TK", dialCode: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "TO", dialCode: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1868", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", dialCode: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", dialCode: "+993", flag: "🇹🇲" },
  { name: "Turks and Caicos Islands", code: "TC", dialCode: "+1649", flag: "🇹🇨" },
  { name: "Tuvalu", code: "TV", dialCode: "+688", flag: "🇹🇻" },
  { name: "Uganda", code: "UG", dialCode: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", dialCode: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", dialCode: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", dialCode: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", dialCode: "+678", flag: "🇻🇺" },
  { name: "Venezuela", code: "VE", dialCode: "+58", flag: "🇻🇪" },
  { name: "Viet Nam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { name: "Virgin Islands, British", code: "VG", dialCode: "+1284", flag: "🇻🇬" },
  { name: "Virgin Islands, U.s.", code: "VI", dialCode: "+1340", flag: "🇻🇮" },
  { name: "Wallis and Futuna", code: "WF", dialCode: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "EH", dialCode: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "YE", dialCode: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", dialCode: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263", flag: "🇿🇼" },
];

interface CountryCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCountry: Country | null;
}

export default function CountryCodeModal({
  isOpen,
  onClose,
  onSelect,
  selectedCountry,
}: CountryCodeModalProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus search input when modal opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const popularCountries = useMemo(() => {
    const popularCodes = ["GB", "US", "CN", "FR", "DE", "NG"];
    return countries.filter((c) => popularCodes.includes(c.code));
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[480px] max-h-[80vh] bg-[#1E2329] rounded-lg shadow-xl flex flex-col border border-gray-800"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.countryCode.searchPlaceholder}
                  className="w-full bg-[#2B3139] text-white pl-12 pr-10 py-3 rounded-lg border border-transparent focus:border-[#FCD535] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Country List */}
            <div className="flex-1 overflow-y-auto min-h-[400px]">
              {/* Popular Countries (only show if not searching) */}
              {!searchQuery && (
                <div className="px-2 pt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t.countryCode.popular}
                  </div>
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onSelect(country);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#2B3139] rounded-lg transition-colors group ${
                        selectedCountry?.code === country.code
                          ? "bg-[#2B3139]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-white group-hover:text-[#FCD535] transition-colors">
                          {country.name}
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono">
                        {country.dialCode}
                      </span>
                    </button>
                  ))}
                  <div className="my-2 border-b border-gray-800" />
                </div>
              )}

              {/* All Countries */}
              <div className="px-2 pb-2">
                {!searchQuery && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t.countryCode.allCountries}
                  </div>
                )}
                
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onSelect(country);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#2B3139] rounded-lg transition-colors group ${
                        selectedCountry?.code === country.code
                          ? "bg-[#2B3139]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-white group-hover:text-[#FCD535] transition-colors text-left">
                          {country.name}
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono">
                        {country.dialCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {t.countryCode.noResults}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
