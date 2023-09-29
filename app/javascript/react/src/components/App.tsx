/* eslint-disable no-underscore-dangle */
import React, {
  useEffect, useState, useRef, FC,
} from 'react';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import { PushToTalkButton } from '@speechly/react-ui';
import BugsnagPerformance from '@bugsnag/browser-performance';

import { FirebaseProvider } from '../contexts/FirebaseContext.tsx';
import Ticker from './Ticker.tsx';

Bugsnag.start({
  apiKey: window?.env?.REACT_APP_BUGSNAG_API_KEY, // TODO: update this to retrieve during api auth
  plugins: [new BugsnagPluginReact()],
});

BugsnagPerformance.start({
  appVersion: '0.0.5',
  releaseStage: 'testing',
  apiKey: window?.env?.REACT_APP_BUGSNAG_API_KEY,
});

const ErrorBoundary = Bugsnag?.getPlugin('react')?.createErrorBoundary(React) || React.Fragment;

// Handles voice commands globally
const App: FC = () => {
  const recognitionRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [tentative, setTentative] = useState<string>('');
  const [predictions, setPredictions] = useState<string[]>([]);

  // Match spoken words ("Call 911!") to Commands we can execute ("Dial?911")
  // "predictions" here is just jargon - they represent a match
  const handleSpeech = async (str: string) => {
    console.log('handleSpeech', str);
  };

  const handlePushToTalkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
    }
  };

  // Web Speech API Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const { transcript } = event.results[current][0];
      if (event.results[current].isFinal) {
        setTranscripts((prevTranscripts) => [...prevTranscripts, transcript]);
        handleSpeech(transcript);
      } else {
        setTentative(transcript);
      }
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      recognitionRef.current.start();
    };
  }, []);

  // Note: this is a large red 2d square that can used for quick visual/render testing purposes
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unused-vars
  const _testRenderBlock = <div style={{ height: '50vh', width: '50vw', background: isListening ? 'green' : 'red' }} />;

  return (
    <ErrorBoundary>
      <FirebaseProvider>
        {
          // ...replace with your app code
          _testRenderBlock
        }
        <Ticker transcripts={transcripts} tentative={tentative} predictions={predictions} />
      </FirebaseProvider>
    </ErrorBoundary>
  );
};

export default App;
