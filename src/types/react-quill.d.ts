declare module 'react-quill' {
  import React from 'react';

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    placeholder?: string;
    tabIndex?: number;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    onFocus?: (range: any, source: string, editor: any) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onKeyDown?: React.EventHandler<any>;
    onKeyPress?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    className?: string;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
