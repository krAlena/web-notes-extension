import React, { useState, useEffect } from "react";
import styles from "../styles/LanguageSelector.module.sass";

interface Language {
  code: string;
  label: string;
}

interface LanguageSelectorProps {
  onChange?: (langCode: string) => void;
  defLang: string;
}

const languages: Language[] = [
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "uk-UA", label: "Ukrainian" }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onChange, defLang }) => {
  const [selectedLang, setSelectedLang] = useState<string>(defLang);

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const match = languages.find(lang => lang.code === browserLang);
    if (match) {
      setSelectedLang(match.code);
      onChange?.(match.code);
    }
  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLang(value);
    onChange?.(value);
  };

  return (
    <select value={selectedLang} className={styles["ext-dropdown"]} onChange={handleChange}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.code}
        </option>
      ))}
    </select>
  );
};


export default LanguageSelector;