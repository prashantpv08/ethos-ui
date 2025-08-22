import logo from './logo.svg';
import type { ImgHTMLAttributes } from 'react';

export function EthosLogo({ alt = 'Ethos logo', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={logo} alt={alt} {...props} />;
}

export default EthosLogo;
