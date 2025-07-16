import React, { useState, ChangeEvent } from 'react';
import './Look.scss';
import AddedAvailableUI from './AddedAvailableUI';
import CountryPictureUI from './CountryPictureUI';

// Types
type SiteFeature = {
  name: string;
  Enabled: string;
};

type KnowledgeDomain = {
  name: string;
  label: string;
  url: string;
  language: string;
  taxonomyMemberFirm: string;
  memberFirm: string;
  Enabled: string;
  siteFeatures?: SiteFeature[];
};

type UserFeature = {
  name: string;
  Enabled: string;
};

type MemberFirm = {
  country: string;
  memberFirm?: string;
  knowledgeDomain?: KnowledgeDomain[];
  UserFeatures?: UserFeature[];
};

type MemberFirmsRoot = {
  ResearchPortalMemberfirmsPreview?: MemberFirm[];
  ResearchPortalMemberfirms?: MemberFirm[];
  [key: string]: any;
};

type ExtractedFirms = {
  arr: MemberFirm[];
  rootKey: string | null;
  original: MemberFirmsRoot | MemberFirm[];
};

// Utility to flexibly extract the member firms array and remember the root key
function extractMemberFirms(inputJson: MemberFirmsRoot | MemberFirm[]): ExtractedFirms {
  if (Array.isArray(inputJson)) return { arr: inputJson, rootKey: null, original: inputJson };
  if (inputJson.ResearchPortalMemberfirmsPreview)
    return { arr: inputJson.ResearchPortalMemberfirmsPreview, rootKey: 'ResearchPortalMemberfirmsPreview', original: inputJson };
  if (inputJson.ResearchPortalMemberfirms)
    return { arr: inputJson.ResearchPortalMemberfirms, rootKey: 'ResearchPortalMemberfirms', original: inputJson };
  // Fallback: find the first array property
  const arrKey = Object.keys(inputJson).find(
    (key) => Array.isArray(inputJson[key])
  );
  return arrKey
    ? { arr: inputJson[arrKey], rootKey: arrKey, original: inputJson }
    : { arr: [], rootKey: null, original: inputJson };
}

// Default JSON
const DEFAULT_JSON = `{
  "ResearchPortalMemberfirmsPreview": [
    {
      "country": "dtt",
      "memberFirm": "12345",
      "knowledgeDomain": [
        {
          "name": "auditing",
          "label": "mf_Auditing",
          "url": "/auditing",
          "language": "en-US",
          "taxonomyMemberFirm": "",
          "memberFirm": "12345",
          "Enabled": "true",
          "siteFeatures": [
            { "name": "featureA", "Enabled": "true" }
          ]
        },
        {
          "name": "assurance",
          "label": "mf_Assurance",
          "url": "/assurance",
          "language": "en-US",
          "taxonomyMemberFirm": "",
          "memberFirm": "12345",
          "Enabled": "true"
        }
      ],
      "UserFeatures": [
        { "name": "ResearchAssistant", "Enabled": "true" }
      ]
    }
  ]
}`;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function App() {
  const [inputJson, setInputJson] = useState<string>(DEFAULT_JSON);
  const [error, setError] = useState<string>('');
  const [dataObj, setDataObj] = useState<ExtractedFirms>(() => {
    try {
      return extractMemberFirms(JSON.parse(DEFAULT_JSON));
    } catch (err) {
      return { arr: [], rootKey: null, original: {} };
    }
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const [newDomain, setNewDomain] = useState<{ name: string }>({ name: '' });
  const [newUserFeature, setNewUserFeature] = useState<{ name: string }>({ name: '' });
  const [newSiteFeature, setNewSiteFeature] = useState<{ domain: string; name: string }>({ domain: '', name: '' });

  // Handle textarea input
  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(event.target.value);
    setError('');
  };

  // Handle file upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      try {
        const result = loadEvent.target?.result;
        if (typeof result !== 'string') throw new Error('File is not a string');
        setInputJson(result);
        const parsed = JSON.parse(result);
        setDataObj(extractMemberFirms(parsed));
        setSelectedCountry('');
      } catch (err) {
        setError('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Parse and load JSON from textarea
  const handleLoadJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setDataObj(extractMemberFirms(parsed));
      setSelectedCountry('');
      setError('');
    } catch (err) {
      setError('Invalid JSON format.');
    }
  };

  // UI logic
  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedCountry(event.target.value);

  const handleDownload = () => {
    let output: any;
    if (dataObj.rootKey) {
      output = { ...dataObj.original, [dataObj.rootKey]: dataObj.arr };
    } else if (Array.isArray(dataObj.original)) {
      output = dataObj.arr;
    } else {
      output = dataObj.arr;
    }
    const jsonStr = JSON.stringify(output, null, 2);
    const blob = new window.Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const selected = dataObj.arr.find((item) => item.country === selectedCountry);

  // For output display
  let outputJson: any;
  if (dataObj.rootKey) {
    outputJson = { ...dataObj.original, [dataObj.rootKey]: dataObj.arr };
  } else if (Array.isArray(dataObj.original)) {
    outputJson = dataObj.arr;
  } else {
    outputJson = dataObj.arr;
  }

  return (
    <div className="page-layout">
      <div className="blocks-container">
        <div className="block block-1">
          <h3>1. Paste or Upload JSON</h3>
          <label className="upload-label">
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
            Upload JSON File
          </label>
          <textarea
            value={inputJson}
            onChange={handleJsonChange}
            placeholder="Paste your JSON here..."
          />
          {error && <div className="error-msg">{error}</div>}
          <button onClick={handleLoadJson}>Load JSON</button>
        </div>

        <div className="block block-2">
          <h3>Interactive</h3>
          <div style={{ marginBottom: '1rem' }}>
            <select value={selectedCountry} onChange={handleCountryChange}>
              <option value="">Select a Country</option>
              {dataObj.arr.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.country}
                </option>
              ))}
            </select>
          </div>
          {selected && (
            <CountryPictureUI
              country={selectedCountry}
              countryList={dataObj.arr.map(item => item.country)}
              onCountryChange={handleCountryChange}
              knowledgeDomains={selected?.knowledgeDomain || []}    
            />
          )}
          <AddedAvailableUI
            selected={selected}
            selectedCountry={selectedCountry}
            setDataObj={setDataObj}
          />
        </div>
      </div>

      <div className="block block-3">
        <h3>3. Output JSON</h3>
        <button style={{ marginBottom: '1rem' }} onClick={handleDownload}>
          Download JSON
        </button>
        <pre>
          {JSON.stringify(outputJson, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
