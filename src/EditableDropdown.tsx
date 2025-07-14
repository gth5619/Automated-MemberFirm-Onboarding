
import React, { useState } from 'react';

interface EditableDropdownProps {
  data: any;
  onChange: (updatedData: any) => void;
}

const EditableDropdown: React.FC<EditableDropdownProps> = ({ data, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomain(event.target.value);
  };

  const handleFeatureChange = (featureType: string, value: string) => {
    const updatedData = { ...data };
    const countryData = updatedData.find((item: any) => item.country === selectedCountry);
    const domainData = countryData.knowledgeDomain.find((domain: any) => domain.name === selectedDomain);
    domainData[featureType] = value;
    onChange(updatedData);
  };

  return (
    <div>
      <select onChange={handleCountryChange}>
        {data.map((item: any) => (
          <option key={item.country} value={item.country}>
            {item.country}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <select onChange={handleDomainChange}>
          {data.find((item: any) => item.country === selectedCountry).knowledgeDomain.map((domain: any) => (
            <option key={domain.name} value={domain.name}>
              {domain.name}
            </option>
          ))}
        </select>
      )}

      {selectedDomain && (
        <div>
          <input
            type="text"
            value={data.find((item: any) => item.country === selectedCountry).knowledgeDomain.find((domain: any) => domain.name === selectedDomain).siteFeatures[0].Enabled}
            onChange={(e) => handleFeatureChange('siteFeatures', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default EditableDropdown;
