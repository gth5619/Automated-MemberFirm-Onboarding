

import React from 'react';
import './AddedAvailableUI.scss';

// Master lists (customize as needed)
const MASTER_USER_FEATURES = [
  'ResearchAssistant',
  'Annotations',
  'Bookmarks',
  'Dashboard',
  'RecentlyViewed',
  'RecentSearch',
];

const MASTER_SITE_FEATURES = [
  'ResearchAssistant',
];

const MASTER_DOMAINS = [
  { name: 'auditing', label: 'mf_Auditing', url: '/auditing', language: 'en-US', taxonomyMemberFirm: '', memberFirm: ''  },
  { name: 'assurance', label: 'mf_Assurance', url: '/assurance', language: 'en-US', taxonomyMemberFirm: '', memberFirm: '' },
  { name: 'accounting', label: 'mf_Accounting', url: '/accounting', language: 'en-US', taxonomyMemberFirm: '', memberFirm: '' },
  { name: 'advisory', label: 'mf_Advisory', url: '/advisory', language: 'en-US', taxonomyMemberFirm: '', memberFirm: ''},
];

// Types
type SiteFeature = { name: string; Enabled: string };
type KnowledgeDomain = typeof MASTER_DOMAINS[number] & { siteFeatures?: SiteFeature[] };
type UserFeature = { name: string; Enabled: string };
type MemberFirm = {
  country: string;
  memberFirm?: string;
  knowledgeDomain?: KnowledgeDomain[];
  UserFeatures?: UserFeature[];
  publicationID?: string;
  publicationName?: string;
  defaultMemberFirm?:string;
};

type Props = {
  selected: MemberFirm | undefined;
  selectedCountry: string;
  setDataObj: React.Dispatch<React.SetStateAction<any>>;
   // setDataObj: React.Dispatch<React.SetStateAction<DataObj>>;
};

const AddedAvailableUI: React.FC<Props> = ({ selected, selectedCountry, setDataObj }) => {
  if (!selected) return (
    <div className="ui-layout">
      <div className="added-section">
        <div className="section-title">Added Knowledge Domains</div>
        <div className="empty-msg">No country selected</div>
        <div className="section-title">Added User Features</div>
        <div className="empty-msg">No country selected</div>
      </div>
      <div className="available-section">
        <div className="section-title">Available Knowledge Domains</div>
        <div className="empty-msg">No country selected</div>
        <div className="section-title">Available User Features</div>
        <div className="empty-msg">No country selected</div>
        <div className="section-title">Available Site Features</div>
        <div className="empty-msg">No country selected</div>
      </div>
    </div>
  );

  // Compute available domains
  const addedDomainNames = (selected.knowledgeDomain || []).map((d) => d.name);
  const availableDomains = MASTER_DOMAINS.filter(
    (d) => !addedDomainNames.includes(d.name)
  );

  // Compute available user features
  const addedUserFeatureNames = (selected.UserFeatures || []).map((f) => f.name);
  const availableUserFeatures = MASTER_USER_FEATURES.filter(
    (f) => !addedUserFeatureNames.includes(f)
  );

  return (
    <div className="ui-layout">
      {/* Added Section */}
      <div className="added-section">
        <div className="section-title">Added Knowledge Domains</div>
        {(selected.knowledgeDomain || []).length === 0 ? (
          <div className="empty-msg">None added</div>
        ) : (
           (selected.knowledgeDomain || []).map((domain) => {
            // Label logic
            let label = '';
            if (domain.memberFirm === "17573177") {
              label = "Gl";
            } else if (
              selected.defaultMemberFirm &&
              domain.memberFirm === `17573177,${selected.defaultMemberFirm}`
            ) {
              label = "Gl + M";
            }

            return (
              <div key={domain.name} className="domain-block">
                <div className="domain-header">
                  <div className="circle-icon">{domain.name.charAt(0).toUpperCase()}</div>
                  <span className="domain-name">{domain.name}</span>
                  {label && <span className="domain-label">{label}</span>}
                  <select
                    value={
                      domain.memberFirm === "17573177"
                        ? "global"
                        : domain.memberFirm === `17573177,${selected.defaultMemberFirm}`
                        ? "global_plus"
                        : "memberfirm"
                    }
                    onChange={e => {
                      setDataObj((prev:any) => {
                        const newArr = prev.arr.map((item: MemberFirm) =>
                          item.country === selectedCountry
                            ? {
                                ...item,
                                knowledgeDomain: (item.knowledgeDomain || []).map((d) =>
                                  d.name === domain.name
                                    ? {
                                        ...d,
                                        memberFirm:
                                          e.target.value === "global"
                                            ? "17573177"
                                            : e.target.value === "global_plus"
                                            ? `17573177,${selected.defaultMemberFirm}`
                                            : selected.defaultMemberFirm || ""
                                      }
                                    : d
                                ),
                              }
                            : item
                        );
                        return { ...prev, arr: newArr };
                      });
                    }}
                  >
                    <option value="global">Gl</option>
                    <option value="global_plus">Gl +M</option>
                    <option value="memberfirm">M</option>
                  </select>
                  <button
                    className="feature-btn remove-btn"
                    onClick={() => {
                      setDataObj((prev: any) => {
                        const newArr = prev.arr.map((item: MemberFirm) =>
                          item.country === selectedCountry
                            ? {
                                ...item,
                                knowledgeDomain: (item.knowledgeDomain || []).filter(
                                  (d) => d.name !== domain.name
                                ),
                              }
                            : item
                        );
                        return { ...prev, arr: newArr };
                      });
                    }}
                  >
                    −
                  </button>
                </div>
                <div className="site-features-list">
                  <div className="site-features-title">Site Features:</div>
                  {(domain.siteFeatures || []).length === 0 ? (
                    <span className="empty-msg">None added</span>
                  ) : (
                    (domain.siteFeatures || []).map((sf) => (
                      <span key={sf.name} className="site-feature-pill">
                        {sf.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}

        <div className="section-title">Added User Features</div>
        {(selected.UserFeatures || []).length === 0 ? (
          <div className="empty-msg">None added</div>
        ) : (
          (selected.UserFeatures || []).map((f) => (
            <span key={f.name} className="user-feature-pill">
              {f.name}
              <button
                className="feature-btn"
                onClick={() => {
                  setDataObj((prev: any) => {
                    const newArr = prev.arr.map((item: MemberFirm) =>
                      item.country === selectedCountry
                        ? {
                            ...item,
                            UserFeatures: (item.UserFeatures || []).filter(
                              (feature) => feature.name !== f.name
                            ),
                          }
                        : item
                    );
                    return { ...prev, arr: newArr };
                  });
                }}
              >
                −
              </button>
            </span>
          ))
        )}
      </div>

      {/* Available Section */}
      <div className="available-section">
        <div className="section-title">Available Knowledge Domains</div>
        {availableDomains.length === 0 ? (
          <div className="empty-msg">All added</div>
        ) : (
          availableDomains.map((domain) => (
            <div key={domain.name} className="available-domain-row">
              <div className="available-circle-icon">{domain.name.charAt(0).toUpperCase()}</div>
              <span className="available-domain-name">{domain.name}</span>
              <button
                className="feature-btn"
                onClick={() => {
                  setDataObj((prev: any) => {
                    const newArr = prev.arr.map((item: MemberFirm) =>
                      item.country === selectedCountry
                        ? {
                            ...item,
                            knowledgeDomain: [
                              ...(item.knowledgeDomain || []),
                              {
                                ...domain,
                                siteFeatures: [],
                                memberFirm: "17573177", // Default to Global, can be edited after
                              },
                            ],
                          }
                        : item
                    );
                    return { ...prev, arr: newArr };
                  });
                }}
              >
                +
              </button>
            </div>
          ))
        )}

        <div className="section-title">Available User Features</div>
        {availableUserFeatures.length === 0 ? (
          <div className="empty-msg">All added</div>
        ) : (
          availableUserFeatures.map((name) => (
            <span key={name} className="available-feature-pill">
              {name}
              <button
                className="feature-btn"
                onClick={() => {
                  setDataObj((prev: any) => {
                    const newArr = prev.arr.map((item: MemberFirm) =>
                      item.country === selectedCountry
                        ? {
                            ...item,
                            UserFeatures: [
                              ...(item.UserFeatures || []),
                              { name, Enabled: 'true' },
                            ],
                          }
                        : item
                    );
                    return { ...prev, arr: newArr };
                  });
                }}
              >
                +
              </button>
            </span>
          ))
        )}

        <div className="section-title">Available Site Features</div>
        {(selected.knowledgeDomain || []).map((domain) => {
          const added = (domain.siteFeatures || []).map((sf) => sf.name);
          const availableSiteFeatures = MASTER_SITE_FEATURES.filter(
            (sf) => !added.includes(sf)
          );
          return (
            <div key={domain.name} className="site-features-available-block">
              <div className="domain-name">{domain.name}</div>
              {availableSiteFeatures.length === 0 ? (
                <div className="empty-msg">All added</div>
              ) : (
                availableSiteFeatures.map((sf) => (
                  <span key={sf} className="available-feature-pill">
                    {sf}
                    <button
                      className="feature-btn"
                      onClick={() => {
                        setDataObj((prev: any) => {
                          const newArr = prev.arr.map((item: MemberFirm) =>
                            item.country === selectedCountry
                              ? {
                                  ...item,
                                  knowledgeDomain: (item.knowledgeDomain || []).map((d) =>
                                    d.name === domain.name
                                      ? {
                                          ...d,
                                          siteFeatures: [
                                            ...(d.siteFeatures || []),
                                            { name: sf, Enabled: 'true' },
                                          ],
                                        }
                                      : d
                                  ),
                                }
                              : item
                          );
                          return { ...prev, arr: newArr };
                        });
                      }}
                    >
                      +
                    </button>
                  </span>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddedAvailableUI;
