import logo from './logo.svg';
import smallLogo from './smallLogo.svg';
import type { ImgHTMLAttributes } from 'react';

export function EthosLogo({
  alt = 'Ethos logo',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={logo} alt={alt} {...props} />;
}

export function EthosSmallLogo({
  alt = 'Ethos small logo',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={smallLogo} alt={alt} {...props} />;
}

export default EthosLogo;
