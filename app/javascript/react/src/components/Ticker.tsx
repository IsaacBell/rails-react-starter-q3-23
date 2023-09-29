import React, { FC } from 'react';
import { List } from 'antd';

export interface TickerProps {
  transcripts?: string[];
  tentative?: string;
  predictions?: string[];
}

/*
	Example of how to display results from the Web Speech API
*/
const Ticker: FC<TickerProps> = ({ transcripts = [], tentative = '', predictions = [] }) => {
  // Combine transcripts and predictions, filtering out any null or empty values
  const items = [...transcripts, ...predictions.map((str:string) => (str[0] === '$' ? `${str}` : str))].filter(Boolean);

  return (
    <div className="transcript-ticker" style={{ backgroundColor: '#000', color: '#FFF', padding: '10px' }}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item className="transcript-item" style={{ color: item[0] === '$' ? '#FFA500' : '#FFF' }}>
            {item[0] === '$' ? item.slice(1) : item }
          </List.Item>
        )}
      />
      {tentative && <p className="tentative-transcript" style={{ color: '#FFA500' }}>{tentative}</p>}
    </div>
  );
};

export default Ticker;
