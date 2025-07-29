import React from 'react';
import { WidgetConfig } from './types';
import { QuestionnaireContainer } from './components/QuestionnaireContainer';

interface AppProps {
  widgetConfig: WidgetConfig;
}

export function App({ widgetConfig }: AppProps) {
  return <QuestionnaireContainer widgetConfig={widgetConfig} />;
}