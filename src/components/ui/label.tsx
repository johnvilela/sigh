import React from 'react';

export interface LabelProps extends React.ComponentProps<'label'> {
  children: React.ReactNode;
}

export const Label = ({ children, ...rest }: LabelProps) => (
  <label
    className="text-xs font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
    {...rest}
  >
    {children}
  </label>
);
