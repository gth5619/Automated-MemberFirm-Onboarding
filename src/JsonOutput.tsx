
import React from 'react';

const JsonOutput: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JsonOutput;
