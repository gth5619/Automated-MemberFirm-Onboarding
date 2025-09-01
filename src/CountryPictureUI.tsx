import React from 'react';
import './CountryPictureUI.scss';

const countryBackgrounds: Record<string, string> = {
  dtt: '/images/International_Background_Image.jpg',
  us: '/images/US_Background_Image.jpg',
  gb: '/images/UK_Background_Image.jpg',
  al:'/images/DCE_Background_Image.jpg',
  bh:'/images/NSE_Background_Image.jpg',
  bs:'/images/CBC_Background_Image.jpg',
    dz:'/images/DCE_Background_Image.jpg',
      ao:'/images/DCE_Background_Image.jpg',
        ca:'/images/NOC_Background_Image.jpeg',
        kr:'/images/APAC_Background_Image.jpeg',
       es:'/images/Spain_Background_Image.jpg',
      //   bs:'/images/'
      //     bs:'/images/'
      //       bs:'/images/'

};

const countryLabels: Record<string, string> = {
  dtt: 'International',
  us: 'United States',
  gb: 'United Kingdom',
  al :'Albania',
  bh:'Bahrain',
  bs:'Bahamas',
  dz:'Algeria',
  ao:'Angola',
  ca:'Canada',
  kr:'Korea',
  xk:'Kosovo',
  ar: 'Argentina',
 am: 'Armenia',
aw: 'Aruba',
au: 'Australia',
at: 'Austria',
az: 'Azerbaijan',
bd: 'Bangladesh',
bb: 'Barbados',
be: 'Belgium',
bj: 'Benin',
bm: 'Bermuda',
bo: 'Bolivia',
ba: 'Bosnia Herzegovina',
bw: 'Botswana',
br: 'Brazil',
vg: 'British Virgin Islands',
bn: 'Brunei',
bg: 'Bulgaria',
kh: 'Cambodia',
cm: 'Cameroon',
ky: 'Cayman Islands',
td: 'Chad',
cl: 'Chile',

cn: 'China',
co: 'Colombia',
cg: 'Congo Brazzaville',
cd: 'Congo, Democratic Republic of',
cr: 'Costa Rica',
hr: 'Croatia',
cw: 'Curacao',
cy: 'Cyprus',
cz: 'Czech Republic',

dk: 'Denmark',
do: 'Dominican Republic',
ec: 'Ecuador',
eg: 'Egypt',
sv: 'El Salvador',
gq: 'Equatorial Guinea',
ee: 'Estonia',
et: 'Ethiopia',
fi: 'Finland',
fr: 'France',


ga: 'Gabon',
ge: 'Georgia',
de: 'Germany',
gh: 'Ghana',
gr: 'Greece',
gt: 'Guatemala',
hn: 'Honduras',
hu: 'Hungary',
is: 'Iceland',
in: 'India',
id: 'Indonesia',
iq: 'Iraq',
ie: 'Ireland',
il: 'Israel',
it: 'Italy',
ci: 'Ivory Coast',
jo: 'Jordan',
jp: 'Japan',
kz: 'Kazakhstan',
ke: 'Kenya',
kw: 'Kuwait',
kg: 'Kyrgyzstan',
la: 'Laos',
lb: 'Lebanon',
ly: 'Libya',
li: 'Liechtenstein',
lv: 'Latvia',
lt: 'Lithuania',
lu: 'Luxembourg',
mk: 'Macedonia',
mw: 'Malawi',
my: 'Malaysia',
mt: 'Malta',
mu: 'Mauritius',
mx: 'Mexico',
md: 'Moldova',
me: 'Montenegro',
ma: 'Morocco',
mz: 'Mozambique',
mm: 'Myanmar',
na: 'Namibia',
nl: 'Netherlands',
nz: 'New Zealand',
ni: 'Nicaragua',
ng: 'Nigeria',
no: 'Norway',
om: 'Oman',
ps: 'Palestinian Ruled Territories',
pa: 'Panama',
pg: 'Papua New Guinea',
py: 'Paraguay',
pe: 'Peru',
ph: 'Philippines',
pl: 'Poland',
pt: 'Portugal',
qa: 'Qatar',
ro: 'Romania',
rw: 'Rwanda',
sa: 'Saudi Arabia',
sn: 'Senegal',
rs: 'Serbia',
sg: 'Singapore',
sk: 'Slovakia',
si: 'Slovenia',
za: 'South Africa',
es: 'Spain',
lk: 'Sri Lanka',
se: 'Sweden',
ch: 'Switzerland',
tw: 'Taiwan',
tj: 'Tajikistan',
tz: 'Tanzania',
th: 'Thailand',
tg: 'Togo',
tt: 'Trinidad And Tobago',
tn: 'Tunisia',
tr: 'Turkey',
tm: 'Turkmenistan',
ug: 'Uganda',
ua: 'Ukraine',
ae: 'United Arab Emirates',
uy: 'Uruguay',
uz: 'Uzbekistan',
ve: 'Venezuela',
vn: 'Vietnam',
ye: 'Yemen',
zm: 'Zambia',



 
};

const domainIcons: Record<string, string> = {
  'auditing': '/images/Auditing_Home_Icon.svg',
  'accounting': '/images/Accounting_Home_Icon.svg',
  'advisory': '/images/Advisory_Home_Icon.svg',
  'assurance': '/images/Assurance_Home_Icon.svg',
};

type KnowledgeDomain = {
  name: string;
  memberFirm: string;
};

type Props = {
  country: string;
  countryList: string[];
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  knowledgeDomains: KnowledgeDomain[];
  defaultMemberFirm: string; 
};


const CountryPictureUI: React.FC<Props> = ({
  country,
  countryList,
  onCountryChange,
  knowledgeDomains,
  defaultMemberFirm,
}) => {
  const bgUrl = countryBackgrounds[country] || '/images/US_Background_Image.jpg';
    const label = countryLabels[country] || country;

const getDomainLabel = (domain: KnowledgeDomain, defaultMemberFirm: string) => {
  if (!domain.memberFirm) return '';
  const ids = domain.memberFirm.split(',').map(id => id.trim());
  const hasGlobal = ids.includes('17573177');
  const hasDefault = ids.includes(defaultMemberFirm);

  if (hasGlobal && hasDefault) {
    // Check for additional IDs besides global and defaultMemberFirm
    const extraIds = ids.filter(id => id !== '17573177' && id !== defaultMemberFirm);
    if (extraIds.length > 0) {
      return 'Glo+M (C)';
    }
    return 'Glo+M';
  }
  if (hasGlobal) return 'Glo';
  return 'M';
};
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
    <span className="domain-chip-domain-label" style={{ marginLeft: 4, fontWeight: 500, color: '#2d62ff' }}>
      {getDomainLabel(domain, defaultMemberFirm)}
    </span>
  </div>
))}
</div>

    </div>
  );
};

export default CountryPictureUI;
