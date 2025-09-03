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
    defaultMemberFirm: string;
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

interface Country {
  country: string;
  defaultLanguage: string;
  defaultMemberFirm: string;
  publicationID: string;
  publicationName: string;
  knowledgeDomain: any[]; // Adjust type as needed
}

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
  const [showBlock1, setShowBlock1] = useState(true);

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

   const [countries, setCountries] = useState<Country[]>([]);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);

  const handleAddCountry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newCountry: Country = {
      country: (form.country as any).value,
      defaultLanguage: (form.defaultLanguage as any).value,
      defaultMemberFirm: (form.defaultMemberFirm as any).value,
      publicationID: (form.publicationID as any).value,
      publicationName: (form.publicationName as any).value,
      knowledgeDomain: [],
    };
    setCountries([...countries, newCountry]);
    setShowAddCountryModal(false);
    form.reset();
  };
  return (
    <div className="page-layout">
      <header className="app-header">
        <button
          className="hamburger-btn"
          onClick={() => setShowBlock1((prev) => !prev)}
          aria-label={showBlock1 ? "Hide sidebar" : "Show sidebar"}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h1 className="app-title">Member Firm Onboarding</h1>
      </header>

      <div className="blocks-container">
          {showBlock1 && (
        <div className="block block-1">
          <h3>JSON Configuration</h3>
          <div className="upload-section">
            <label className="upload-label">
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
              <span className="upload-icon">📁</span>
              Upload JSON File
            </label>
            <span className="upload-help">or paste JSON below</span>
          </div>
          <div className="textarea-container">
            <textarea
              value={inputJson}
              onChange={handleJsonChange}
              placeholder="Paste your JSON configuration here..."
              className="json-textarea"
            />
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          <button onClick={handleLoadJson} className="btn btn-primary load-btn">
            <span>⚡</span> Load JSON
          </button>
        </div>
          )}
       <div className={`block block-2 ${showBlock1 ? "" : "full-width"}`}>
          <div className="block-header">
            <h3>Interactive Configuration</h3>
            <button className="btn btn-primary" onClick={() => setShowAddCountryModal(true)}>
              <span>+</span> Add Country
            </button>
          </div>

        {showAddCountryModal && (
          <div className="modal-overlay" onClick={() => setShowAddCountryModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Country</h3>
                <button 
                  type="button" 
                  className="modal-close-btn"
                  onClick={() => setShowAddCountryModal(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddCountry} className="modal-form">
                <div className="form-group">
                  <label htmlFor="country">Country Code</label>
                  <input id="country" name="country" placeholder="e.g., us, gb, ca" required />
                </div>
                <div className="form-group">
                  <label htmlFor="defaultLanguage">Default Language</label>
                  <input id="defaultLanguage" name="defaultLanguage" placeholder="e.g., en-US" required />
                </div>
                <div className="form-group">
                  <label htmlFor="defaultMemberFirm">Default Member Firm</label>
                  <input id="defaultMemberFirm" name="defaultMemberFirm" placeholder="e.g., 12345" required />
                </div>
                <div className="form-group">
                  <label htmlFor="publicationID">Publication ID</label>
                  <input id="publicationID" name="publicationID" placeholder="Enter publication ID" required />
                </div>
                <div className="form-group">
                  <label htmlFor="publicationName">Publication Name</label>
                  <input id="publicationName" name="publicationName" placeholder="Enter publication name" required />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Add Country</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddCountryModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}


          <div className="country-selection">
            <label htmlFor="country-select" className="selection-label">Select Country:</label>
            <select id="country-select" value={selectedCountry} onChange={handleCountryChange} className="country-select">
              <option value="">Choose a country...</option>
              {dataObj.arr.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.country.toUpperCase()} - {item.defaultMemberFirm || 'No member firm'}
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
               defaultMemberFirm={selected.defaultMemberFirm || ''}    
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
        <div className="block-header">
          <h3>Output Configuration</h3>
          <button className="btn btn-success download-btn" onClick={handleDownload}>
            <span>💾</span> Download JSON
          </button>
        </div>
        <div className="json-output-container">
          <pre className="json-output">
            {JSON.stringify(outputJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
