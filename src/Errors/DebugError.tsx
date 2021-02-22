import React from 'react';

export function DebugError(error: any) {
    return (
        <div>
          <p>{`${error.code}`}</p>
          <p>Error: {`${error.message}`}</p>
        </div>
      );
}