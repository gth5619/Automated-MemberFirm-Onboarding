import React from 'react';
import './CountryPictureUI.scss';

const countryBackgrounds: Record<string, string> = {
  dtt: '/images/International_Background_Image.jpg',
  us: '/images/US_Background_Image.jpg',
  gb: '/images/UK_Background_Image.jpg',

};

const countryLabels: Record<string, string> = {
  dtt: 'International',
  us: 'United States',
  gb: 'United Kingdom',
 
};

const domainIcons: Record<string, string> = {
  'auditing': '/images/Auditing_Home_Icon.svg',
  'accounting': '/images/Accounting_Home_Icon.svg',
  'advisory': '/images/Advisory_Home_Icon.svg',
  'assurance': '/images/Assurance_Home_Icon.svg',
};

type Props = {
  country: string;
  countryList: string[];
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  knowledgeDomains: { name: string }[];
};

const CountryPictureUI: React.FC<Props> = ({
  country,
  countryList,
  onCountryChange,
  knowledgeDomains,
}) => {
  const bgUrl = countryBackgrounds[country] || '/images/US_Background_Image.jpg';
    const label = countryLabels[country] || country;

  return (
    <div className="country-picture-ui" style={{
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: 'cover',
      position: 'relative',
      width: '100%',
      height: '300px'
    }}>
  <div className="country-dropdown-container">
        <select value={country} onChange={onCountryChange} className="country-dropdown">
          {countryList.map((c) => (
            <option key={c} value={c}>
              {countryLabels[c] || c}
            </option>
          ))}
        </select>
      </div>
<div className="domain-chips-horizontal">
  {knowledgeDomains.map((domain) => (
    <div key={domain.name} className="domain-chip-horizontal">
      {domainIcons[domain.name] && (
        <img
          src={domainIcons[domain.name]}
          alt={domain.name}
          className="domain-chip-icon-horizontal"
        />
      )}
      <span className="domain-chip-label-horizontal">{domain.name}</span>
    </div>
  ))}
</div>

    </div>
  );
};

export default CountryPictureUI;
